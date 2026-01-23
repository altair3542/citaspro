import { useMemo, useState } from "react";
import Card from "../../../shared/components/ui/Card";
import Input from "../../../shared/components/ui/Input";
import Button from "../../../shared/components/ui/Button";
import EmptyState from "./EmptyState";

export default function ClientsView({
  clients,
  onSelectClient,
  onCreate,
  onEdit,
  onDelete,
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all"); // all | active | inactive

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return clients.filter((c) => {
      const matchesStatus = status === "all" ? true : c.status === status;
      const hay = `${c.name} ${c.phone} ${c.email || ""}`.toLowerCase();
      const matchesSearch = q ? hay.includes(q) : true;
      return matchesStatus && matchesSearch;
    });
  }, [clients, search, status]);

  if (clients.length === 0) {
    return (
      <EmptyState
        title="Sin clientes aún"
        description="Crea tu primer cliente para comenzar."
        actionLabel="Nuevo cliente"
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
            name="clientSearch"
            placeholder="Nombre, teléfono o email"
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
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>

          <div className="flex items-end justify-end">
            <Button onClick={onCreate}>Nuevo cliente</Button>
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
          {filtered.map((c) => (
            <Card key={c.id} className="p-4 flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm text-gray-600">
                  {c.phone} {c.email ? `• ${c.email}` : ""}
                </div>
                <div className="mt-1 text-xs text-gray-600">
                  Estado: <span className="font-medium">{c.status}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => onSelectClient(c)}>
                  Ver
                </Button>
                <Button variant="secondary" onClick={() => onEdit(c)}>
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => onDelete(c)}
                  className="text-red-700 hover:bg-red-50"
                >
                  Eliminar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
