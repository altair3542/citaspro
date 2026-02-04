import { useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";

import Spinner from "../../../shared/components/ui/Spinner";
import Card from "../../../shared/components/ui/Card";
import Button from "../../../shared/components/ui/Button";

import { useDashboardData } from "../hooks/useDashboardData";

import DashboardTabs from "../components/DashboardTabs";
import ErrorState from "../components/ErrorState";
import ClientsView from "../components/ClientsView";
import AppointmentsView from "../components/AppointmentsView";
import DetailModal from "../components/DetailModal";
import ClientFormModal from "../components/ClientFormModal";
import AppointmentFormModal from "../components/AppointmentFormModal";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const userId = user?.id;

  const {
    clients,
    appointments,
    clientById,
    loading,
    error,
    reload,

    createClient,
    updateClient,
    deleteClient,

    createAppointment,
    updateAppointment,
    deleteAppointment,
  } = useDashboardData({ userId });

  const [tab, setTab] = useState("clients"); // clients | appointments

  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Modales de formularios
  const [clientFormOpen, setClientFormOpen] = useState(false);
  const [clientFormMode, setClientFormMode] = useState("create");
  const [editingClient, setEditingClient] = useState(null);

  const [apptFormOpen, setApptFormOpen] = useState(false);
  const [apptFormMode, setApptFormMode] = useState("create");
  const [editingAppointment, setEditingAppointment] = useState(null);

  const detailOpen = Boolean(selectedClient || selectedAppointment);

  const detailTitle = useMemo(() => {
    if (selectedClient) return `Cliente: ${selectedClient.name}`;
    if (selectedAppointment) return "Detalle de cita";
    return "";
  }, [selectedClient, selectedAppointment]);

  function openCreateClient() {
    setClientFormMode("create");
    setEditingClient(null);
    setClientFormOpen(true);
  }

  function openEditClient(client) {
    setClientFormMode("edit");
    setEditingClient(client);
    setClientFormOpen(true);
  }

  async function handleDeleteClient(client) {
    const ok = window.confirm(`¿Eliminar el cliente "${client.name}"?\n\nEsta acción no se puede deshacer.`);
    if (!ok) return;

    try {
      await deleteClient(client.id);
      if (selectedClient?.id === client.id) setSelectedClient(null);
    } catch (e) {
      window.alert(e?.message || "No se pudo eliminar el cliente.");
    }
  }

  function openCreateAppointment() {
    if (clients.length === 0) {
      window.alert("Crea al menos un cliente antes de agendar una cita.");
      return;
    }
    setApptFormMode("create");
    setEditingAppointment(null);
    setApptFormOpen(true);
  }

  function openEditAppointment(a) {
    setApptFormMode("edit");
    setEditingAppointment(a);
    setApptFormOpen(true);
  }

  async function handleDeleteAppointment(a) {
    const ok = window.confirm("¿Eliminar esta cita? Esta acción no se puede deshacer.");
    if (!ok) return;

    try {
      await deleteAppointment(a.id);
      if (selectedAppointment?.id === a.id) setSelectedAppointment(null);
    } catch (e) {
      window.alert(e?.message || "No se pudo eliminar la cita.");
    }
  }

  async function handleQuickStatus(a, nextStatus) {
    try {
      const updated = await updateAppointment(a.id, {
        clientId: a.clientId,
        dateTime: a.dateTime,
        service: a.service,
        notes: a.notes,
        status: nextStatus,
      });

      if (selectedAppointment?.id === a.id) {
        setSelectedAppointment(updated);
      }
    } catch (e) {
      window.alert(e?.message || "No se pudo actualizar el estado.");
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-gray-600">Cargando datos…</p>
        </div>

        <Card className="p-6 flex items-center gap-3">
          <Spinner />
          <span className="text-gray-700">Cargando clientes y citas</span>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-gray-600">No pudimos cargar los datos.</p>
        </div>

        <ErrorState message={error} onRetry={reload} />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Sesión 6: Citas persistidas en Supabase (RLS + CRUD).
          </p>
        </div>

        <div className="flex items-end gap-2">
          <div className="text-sm text-gray-600">{user?.email ? `Sesión: ${user.email}` : null}</div>
          <Button variant="secondary" onClick={async () => await signOut()}>
            Cerrar sesión
          </Button>
        </div>
      </div>

      <div className="flex items-end justify-between gap-3">
        <DashboardTabs active={tab} onChange={setTab} />

        {tab === "clients" ? (
          <Button onClick={openCreateClient}>Nuevo cliente</Button>
        ) : (
          <Button onClick={openCreateAppointment}>Nueva cita</Button>
        )}
      </div>

      {tab === "clients" ? (
        <ClientsView
          clients={clients}
          onSelectClient={setSelectedClient}
          onCreate={openCreateClient}
          onEdit={openEditClient}
          onDelete={handleDeleteClient}
        />
      ) : (
        <AppointmentsView
          appointments={appointments}
          clientById={clientById}
          onSelectAppointment={setSelectedAppointment}
          onCreate={openCreateAppointment}
          onEdit={openEditAppointment}
          onDelete={handleDeleteAppointment}
          onQuickStatus={handleQuickStatus}
        />
      )}

      {/* Modal de detalle */}
      <DetailModal
        open={detailOpen}
        title={detailTitle}
        onClose={() => {
          setSelectedClient(null);
          setSelectedAppointment(null);
        }}
      >
        {selectedClient ? (
          <div className="grid gap-2 text-sm">
            <div><span className="font-medium">Nombre:</span> {selectedClient.name}</div>
            <div><span className="font-medium">Teléfono:</span> {selectedClient.phone}</div>
            <div><span className="font-medium">Email:</span> {selectedClient.email || "—"}</div>
            <div><span className="font-medium">Estado:</span> {selectedClient.status}</div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => openEditClient(selectedClient)}>Editar</Button>
              <Button
                variant="ghost"
                onClick={() => handleDeleteClient(selectedClient)}
                className="text-red-700 hover:bg-red-50"
              >
                Eliminar
              </Button>
            </div>
          </div>
        ) : null}

        {selectedAppointment ? (
          <div className="grid gap-2 text-sm">
            <div>
              <span className="font-medium">Cliente:</span>{" "}
              {clientById.get(selectedAppointment.clientId)?.name || "Cliente desconocido"}
            </div>
            <div><span className="font-medium">Fecha/hora:</span> {new Date(selectedAppointment.dateTime).toLocaleString("es-CO")}</div>
            <div><span className="font-medium">Servicio:</span> {selectedAppointment.service}</div>
            <div><span className="font-medium">Notas:</span> {selectedAppointment.notes || "—"}</div>
            <div><span className="font-medium">Estado:</span> {selectedAppointment.status}</div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => openEditAppointment(selectedAppointment)}>Editar</Button>
              <Button
                variant="ghost"
                onClick={() => handleDeleteAppointment(selectedAppointment)}
                className="text-red-700 hover:bg-red-50"
              >
                Eliminar
              </Button>
            </div>
          </div>
        ) : null}
      </DetailModal>

      {/* Modal CRUD Clientes */}
      <ClientFormModal
        open={clientFormOpen}
        mode={clientFormMode}
        initialClient={editingClient}
        onClose={() => setClientFormOpen(false)}
        onSubmit={async (payload) => {
          if (clientFormMode === "create") return await createClient(payload);
          if (!editingClient) throw new Error("No hay cliente para editar.");
          const updated = await updateClient(editingClient.id, payload);
          if (selectedClient?.id === editingClient.id) setSelectedClient(updated);
          return updated;
        }}
      />

      {/* Modal CRUD Citas */}
      <AppointmentFormModal
        open={apptFormOpen}
        mode={apptFormMode}
        initialAppointment={editingAppointment}
        clients={clients}
        onClose={() => setApptFormOpen(false)}
        onSubmit={async (payload) => {
          if (apptFormMode === "create") return await createAppointment(payload);
          if (!editingAppointment) throw new Error("No hay cita para editar.");
          const updated = await updateAppointment(editingAppointment.id, payload);
          if (selectedAppointment?.id === editingAppointment.id) setSelectedAppointment(updated);
          return updated;
        }}
      />
    </div>
  );
}
