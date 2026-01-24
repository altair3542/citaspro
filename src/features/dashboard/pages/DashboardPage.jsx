import { useMemo, useState } from "react";

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

export default function DashboardPage() {
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
  } = useDashboardData();

  const [tab, setTab] = useState("clients"); // clients | appointments (si ya agregaste otros tabs, mantenlos)

  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Modal formulario (CRUD clientes)
  const [clientFormOpen, setClientFormOpen] = useState(false);
  const [clientFormMode, setClientFormMode] = useState("create"); // create | edit
  const [editingClient, setEditingClient] = useState(null);

  const modalOpen = Boolean(selectedClient || selectedAppointment);

  const modalTitle = useMemo(() => {
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

  function handleDeleteClient(client) {
    const ok = window.confirm(
      `¿Eliminar el cliente "${client.name}"?\n\nEsta acción no se puede deshacer.`
    );
    if (!ok) return;

    try {
      deleteClient(client.id);
      if (selectedClient?.id === client.id) setSelectedClient(null);
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "No se pudo eliminar el cliente.");
    }
  }

  // Loading
  if (loading) {
    return (
      <div className="grid gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-gray-600">Cargando datos simulados…</p>
        </div>

        <Card className="p-6 flex items-center gap-3">
          <Spinner />
          <span className="text-gray-700">Cargando clientes y citas</span>
        </Card>
      </div>
    );
  }

  // Error
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

  // Data OK
  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Sesión 3: CRUD de Clientes (formularios + validación + regla de negocio).
          </p>
        </div>

        <DashboardTabs active={tab} onChange={setTab} />
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
        />
      )}

      {/* Modal detalle (Sesión 2) + acciones rápidas */}
      <DetailModal
        open={modalOpen}
        title={modalTitle}
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
              <Button variant="secondary" onClick={() => openEditClient(selectedClient)}>
                Editar
              </Button>
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
            <div><span className="font-medium">Fecha/hora:</span> {selectedAppointment.dateTime}</div>
            <div><span className="font-medium">Servicio:</span> {selectedAppointment.service}</div>
            <div><span className="font-medium">Notas:</span> {selectedAppointment.notes || "—"}</div>
            <div><span className="font-medium">Estado:</span> {selectedAppointment.status}</div>
          </div>
        ) : null}
      </DetailModal>

      {/* Modal formulario (Sesión 3) */}
      <ClientFormModal
        open={clientFormOpen}
        mode={clientFormMode}
        initialClient={editingClient}
        onClose={() => setClientFormOpen(false)}
        
        onSubmit={(payload) => {
          if (clientFormMode === "create") {
            createClient(payload);
            return;
          }

          if (!editingClient) throw new Error("No hay cliente para editar.");

          updateClient(editingClient.id, payload);

          // Mantener sincronizado el detalle si está abierto
          if (selectedClient?.id === editingClient.id) {
            setSelectedClient((prev) => (prev ? { ...prev, ...payload } : prev));
          }
        }}
      />
    </div>
  );
}
