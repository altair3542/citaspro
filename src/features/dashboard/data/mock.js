const CLIENTS = [
  { id: "c1", name: "Ana Perez", phone: "3001234567", email: "ana@correo.com", status: "active"},
  { id: "c2", name: "Carlos Gomez", phone: "3107654321", email: "", status: "active"},
  { id: "c3", name: "Lucia Diaz", phone: "3201112233", email: "lucia@correo.com", status: "inactive"},
]

const APPOINTMENTS = [
  { id: "a1", clientId: "c1", dateTime: "2026-01-20T09:00:00", service: "Consulta general", notes: "Primera visita", status: "scheduled" },
  { id: "a2", clientId: "c2", dateTime: "2026-01-18T15:30:00", service: "Control", notes: "", status: "completed" },
  { id: "a3", clientId: "c1", dateTime: "2026-01-25T11:00:00", service: "Seguimiento", notes: "Revisar evolución", status: "canceled" },
];

const SIMULATE_ERROR = false

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

export async function fetchClients() {
  await delay(600)
  if (SIMULATE_ERROR) throw new Error("No se pudieron cargar los clientes simulados");
  return CLIENTS.map((a) => ({ ...a }))
}

export async function fetchAppointments() {
  await delay(800)
  if (SIMULATE_ERROR) throw new Error("No se pudieron cargar las citas");
  return APPOINTMENTS.map((a) => ({ ...a }))
}
