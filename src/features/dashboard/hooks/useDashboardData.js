import { useEffect, useMemo, useState } from "react";
import { fetchAppointments, fetchClients } from "../data/mock";

function makeId(prefix = "c") {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

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

  // =========================
  // CRUD real de Clientes (Sesión 3)
  // =========================

  function createClient(data) {
    const newClient = {
      id: makeId("c"),
      name: data.name,
      phone: data.phone,
      email: data.email || "",
      status: data.status || "active",
    };

    setClients((prev) => [newClient, ...prev]);
    return newClient;
  }

  function updateClient(clientId, data) {
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? {
              ...c,
              name: data.name,
              phone: data.phone,
              email: data.email || "",
              status: data.status || c.status,
            }
          : c
      )
    );
  }

  function deleteClient(clientId) {
    // Regla de negocio: no eliminar si tiene citas asociadas
    const hasAppointments = appointments.some((a) => a.clientId === clientId);
    if (hasAppointments) {
      throw new Error("No puedes eliminar este cliente porque tiene citas asociadas.");
    }

    setClients((prev) => prev.filter((c) => c.id !== clientId));
  }

  return {
    clients,
    appointments,
    clientById,
    loading,
    error,
    reload,

    // CRUD Clientes
    createClient,
    updateClient,
    deleteClient,
  };
}
