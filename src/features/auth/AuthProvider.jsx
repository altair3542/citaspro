import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function init() {
      setAuthLoading(true);

      // 1) Recupera sesión guardada (persistencia)
      const { data, error } = await supabase.auth.getSession();
      if (!alive) return;

      if (error) {
        // No bloqueamos el app, pero dejamos trazabilidad
        console.error("supabase.auth.getSession error:", error);
      }

      setSession(data?.session ?? null);
      setUser(data?.session?.user ?? null);
      setAuthLoading(false);

      // 2) Listener: logins/logouts/refresh
      const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession);
        setUser(nextSession?.user ?? null);
      });

      return subscription;
    }

    let subscriptionRef;
    init().then((sub) => (subscriptionRef = sub));

    return () => {
      alive = false;
      if (subscriptionRef?.subscription?.unsubscribe) {
        subscriptionRef.subscription.unsubscribe();
      }
    };
  }, []);

  async function signInWithPassword({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signUp({ email, password }) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  const value = useMemo(
    () => ({
      session,
      user,
      authLoading,
      signInWithPassword,
      signUp,
      signOut,
    }),
    [session, user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth() debe usarse dentro de <AuthProvider />");
  return ctx;
}
