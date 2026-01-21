import { useEffect, useMemo, useState } from "react";
import { fetchAppointments, fetchClients } from "../data/mock";

export function useDashboardData() {
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const [c, a] = await Promise.all([fetchClients(), fetchAppointments()]);
        if (!alive) return;
        setClients(c);
        setAppointments(a);
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Error desconocido cargando datos.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, [reloadKey]);

  const clientById = useMemo(() => {
    const map = new Map();
    for (const c of clients) map.set(c.id, c);
    return map;
  }, [clients]);

  return { clients, appointments, clientById, loading, error, reload };
}
