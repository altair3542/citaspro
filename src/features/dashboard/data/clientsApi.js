import { supabase } from "../../../lib/supabaseClient";

function mapClient(row) {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    phone: row.phone,
    email: row.email || "",
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function listClients(userId) {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapClient);
}

export async function createClientDb(userId, payload) {
  const { data, error } = await supabase
    .from("clients")
    .insert({
      user_id: userId,
      name: payload.name,
      phone: payload.phone,
      email: payload.email || null,
      status: payload.status || "active",
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapClient(data);
}

export async function updateClientDb(userId, clientId, payload) {
  const { data, error } = await supabase
    .from("clients")
    .update({
      name: payload.name,
      phone: payload.phone,
      email: payload.email || null,
      status: payload.status || "active",
    })
    .eq("id", clientId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) throw error;
  return mapClient(data);
}

export async function deleteClientDb(userId, clientId) {
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", clientId)
    .eq("user_id", userId);

  if (error) throw error;
}
