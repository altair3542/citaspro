import { useMemo, useState } from "react";
import Card from "../../../shared/components/ui/Card";
import Input from "../../../shared/components/ui/Input";
import Button from "../../../shared/components/ui/Button";
import EmptyState from "./EmptyState";

function formatDate(iso) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleString();
}

export default function AppointmentsView({
  appointments,
  clientById,
  onSelectAppointment,
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all"); // all | scheduled | completed | canceled

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return appointments.filter((a) => {
      const c = clientById.get(a.clientId);
      const clientName = (c?.name || "Cliente desconocido").toLowerCase();

      const matchesStatus = status === "all" ? true : a.status === status;

      const hay = `${clientName} ${a.service} ${a.notes || ""}`.toLowerCase();
      const matchesSearch = q ? hay.includes(q) : true;

      return matchesStatus && matchesSearch;
    });
  }, [appointments, clientById, search, status]);

  // Estado vacío “real”
  if (appointments.length === 0) {
    return (
      <EmptyState
        title="Sin citas aún"
        description="En esta sesión trabajamos con datos simulados. Más adelante crearemos citas reales."
        actionLabel="Simular acción"
        onAction={() => window.alert("Acción simulada")}
      />
    );
  }

  return (
    <div className="grid gap-4">
      {/* Filtros */}
      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <Input
            label="Buscar"
            name="appointmentSearch"
            placeholder="Cliente, servicio o notas"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="grid gap-1.5">
            <label className="text-sm font-medium text-gray-800">Estado</label>
            <select
              className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="scheduled">Programadas</option>
              <option value="completed">Completadas</option>
              <option value="canceled">Canceladas</option>
            </select>
          </div>

          <div className="flex items-end justify-end">
            <Button onClick={() => window.alert("Crear cita (real en sesión 3/5)")}>
              Nueva cita
            </Button>
          </div>
        </div>
      </Card>

      {/* No resultados tras filtrar */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No hay resultados"
          description="Prueba cambiando el texto de búsqueda o el estado."
        />
      ) : (
        <div className="grid gap-3">
          {filtered.map((a) => {
            const c = clientById.get(a.clientId);

            return (
              <Card key={a.id} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold">{c?.name || "Cliente desconocido"}</div>
                  <div className="text-sm text-gray-600">
                    {formatDate(a.dateTime)} • {a.service}
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    Estado: <span className="font-medium">{a.status}</span>
                  </div>
                </div>

                <Button variant="secondary" onClick={() => onSelectAppointment(a)}>
                  Ver detalle
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
