import { supabase } from "../../../lib/supabaseClient";

function mapAppointment(row) {
  return {
    id: row.id,
    userId: row.user_id,
    clientId: row.client_id,
    dateTime: row.date_time, // ISO string (timestamptz)
    service: row.service,
    notes: row.notes || "",
    status: row.status, // scheduled | completed | cancelled
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listAppointments(userId) {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("user_id", userId)
    .order("date_time", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapAppointment);
}

export async function createAppointmentDb(userId, payload) {
  const { data, error } = await supabase
    .from("appointments")
    .insert({
      user_id: userId,
      client_id: payload.clientId,
      date_time: payload.dateTime,
      service: payload.service,
      notes: payload.notes || null,
      status: payload.status || "scheduled",
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapAppointment(data);
}

export async function updateAppointmentDb(userId, appointmentId, payload) {
  const { data, error } = await supabase
    .from("appointments")
    .update({
      client_id: payload.clientId,
      date_time: payload.dateTime,
      service: payload.service,
      notes: payload.notes || null,
      status: payload.status || "scheduled",
    })
    .eq("id", appointmentId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) throw error;
  return mapAppointment(data);
}

export async function deleteAppointmentDb(userId, appointmentId) {
  const { error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", appointmentId)
    .eq("user_id", userId);

  if (error) throw error;
}


// Útil para regla de negocio (bloquear delete de cliente)
export async function countAppointmentsForClient(userId, clientId) {
  const { count, error } = await supabase
    .from("appointments")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("client_id", clientId);

  if (error) throw error;
  return count || 0;
}
