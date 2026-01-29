import { useEffect, useMemo, useState } from "react";
import { fetchAppointments } from "../data/mock";
import { createClientDb, deleteClientDb, listClients, updateClientDb } from "../data/clientsApi";

export function useDashboardData({ userId }) {
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!userId) return;

      setLoading(true);
      setError("");

      try {
        const [c, a] = await Promise.all([listClients(userId), fetchAppointments()]);
        if (!alive) return;

        // Nota: appointments sigue mock por ahora (se persiste en otra sesión).
        setClients(c);
        setAppointments(a);
      } catch (e) {
        if (!alive) return;
        setError(e?.message || "Error desconocido cargando datos.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [userId, reloadKey]);

  const clientById = useMemo(() => {
    const map = new Map();
    for (const c of clients) map.set(c.id, c);
    return map;
  }, [clients]);

  // CRUD real (DB)
  async function createClient(payload) {
    const row = await createClientDb(userId, payload);
    setClients((prev) => [row, ...prev]);
    return row;
  }

  async function updateClient(clientId, payload) {
    const row = await updateClientDb(userId, clientId, payload);
    setClients((prev) => prev.map((c) => (c.id === clientId ? row : c)));
    return row;
  }

  async function deleteClient(clientId) {
    // Regla de negocio local (hasta que citas sean persistentes)
    const hasAppointments = appointments.some((a) => a.clientId === clientId);
    if (hasAppointments) {
      throw new Error("No puedes eliminar este cliente porque tiene citas asociadas.");
    }

    await deleteClientDb(userId, clientId);
    setClients((prev) => prev.filter((c) => c.id !== clientId));
  }

  return {
    clients,
    appointments,
    clientById,
    loading,
    error,
    reload,
    createClient,
    updateClient,
    deleteClient,
  };
}
