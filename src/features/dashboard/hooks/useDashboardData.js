import { useEffect, useMemo, useState } from "react";
import { createClientDb, deleteClientDb, listClients, updateClientDb } from "../data/clientsApi";
import {
  countAppointmentsForClient,
  createAppointmentDb,
  deleteAppointmentDb,
  listAppointments,
  updateAppointmentDb,
} from "../data/appointmentsApi";

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
        const [c, a] = await Promise.all([listClients(userId), listAppointments(userId)]);
        if (!alive) return;

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

  // =========
  // CLIENTES
  // =========

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
    // 1) check explícito para mensaje más claro
    const n = await countAppointmentsForClient(userId, clientId);
    if (n > 0) {
      throw new Error("No puedes eliminar este cliente porque tiene citas asociadas.");
    }

    // 2) DB delete (además el FK impediría borrado si existieran citas)
    await deleteClientDb(userId, clientId);

    setClients((prev) => prev.filter((c) => c.id !== clientId));
  }

  // =======
  // CITAS
  // =======

  async function createAppointment(payload) {
    const row = await createAppointmentDb(userId, payload);
    setAppointments((prev) => [row, ...prev]);
    return row;
  }

  async function updateAppointment(appointmentId, payload) {
    const row = await updateAppointmentDb(userId, appointmentId, payload);
    setAppointments((prev) => prev.map((a) => (a.id === appointmentId ? row : a)));
    return row;
  }

  async function deleteAppointment(appointmentId) {
    await deleteAppointmentDb(userId, appointmentId);
    setAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
  }

  return {
    clients,
    appointments,
    clientById,
    loading,
    error,
    reload,

    // clientes
    createClient,
    updateClient,
    deleteClient,

    // citas
    createAppointment,
    updateAppointment,
    deleteAppointment,
  };
}
