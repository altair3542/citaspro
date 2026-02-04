import { useMemo, useState } from "react";
import Card from "../../../shared/components/ui/Card";
import Input from "../../../shared/components/ui/Input";
import Button from "../../../shared/components/ui/Button";
import EmptyState from "./EmptyState";

const statusLabels = {
  scheduled: "Programada",
  completed: "Completada",
  cancelled: "Cancelada",
};

const statusColors = {
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-700",
};

export default function AppointmentsView({
  appointments,
  clientById,
  onSelectAppointment,
  onCreate,
  onEdit,
  onDelete,
  onQuickStatus,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | scheduled | completed | cancelled

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return appointments.filter((a) => {
      const matchesStatus = statusFilter === "all" ? true : a.status === statusFilter;

      const clientName = clientById.get(a.clientId)?.name || "";
      const hay = `${clientName} ${a.service} ${a.notes || ""}`.toLowerCase();
      const matchesSearch = q ? hay.includes(q) : true;

      return matchesStatus && matchesSearch;
    });
  }, [appointments, search, statusFilter, clientById]);

  if (appointments.length === 0) {
    return (
      <EmptyState
        title="Sin citas aún"
        description="Crea tu primera cita para comenzar."
        actionLabel="Nueva cita"
        onAction={onCreate}
      />
    );
  }

  return (
    <div className="grid gap-4">
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todas</option>
              <option value="scheduled">Programadas</option>
              <option value="completed">Completadas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>

          <div className="flex items-end justify-end">
            <Button onClick={onCreate}>Nueva cita</Button>
          </div>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          title="No hay resultados"
          description="Prueba cambiando el texto de búsqueda o el estado."
        />
      ) : (
        <div className="grid gap-3">
          {filtered.map((a) => {
            const client = clientById.get(a.clientId);
            const clientName = client?.name || "Cliente desconocido";
            const dateObj = new Date(a.dateTime);
            const dateStr = dateObj.toLocaleDateString("es-CO");
            const timeStr = dateObj.toLocaleTimeString("es-CO", {
              hour: "2-digit",
              minute: "2-digit"
            });

            return (
              <Card key={a.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{clientName}</div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        statusColors[a.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {statusLabels[a.status] || a.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {a.service} • {dateStr} {timeStr}
                  </div>
                  {a.notes && (
                    <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {a.notes}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {a.status === "scheduled" && (
                    <Button
                      variant="secondary"
                      onClick={() => onQuickStatus(a, "completed")}
                      className="text-green-700 hover:bg-green-50"
                    >
                      Completar
                    </Button>
                  )}
                  <Button variant="secondary" onClick={() => onSelectAppointment(a)}>
                    Ver
                  </Button>
                  <Button variant="secondary" onClick={() => onEdit(a)}>
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => onDelete(a)}
                    className="text-red-700 hover:bg-red-50"
                  >
                    Eliminar
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
