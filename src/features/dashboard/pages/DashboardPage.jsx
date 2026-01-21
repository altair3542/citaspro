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

export default function DashboardPage() {
  const { clients, appointments, clientById, loading, error, reload } = useDashboardData();

  const [tab, setTab] = useState("clients"); // clients | appointments

  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const modalOpen = Boolean(selectedClient || selectedAppointment);

  const modalTitle = useMemo(() => {
    if (selectedClient) return `Cliente: ${selectedClient.name}`;
    if (selectedAppointment) return "Detalle de cita";
    return "";
  }, [selectedClient, selectedAppointment]);

  // 1) Loading
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

  // 2) Error
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

  // 3) Data OK
  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Vista principal con listas, filtros y detalle (mocks + estados UX).
          </p>
        </div>

        <DashboardTabs active={tab} onChange={setTab} />
      </div>

      {tab === "clients" ? (
        <ClientsView clients={clients} onSelectClient={setSelectedClient} />
      ) : (
        <AppointmentsView
          appointments={appointments}
          clientById={clientById}
          onSelectAppointment={setSelectedAppointment}
        />
      )}

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

        <div className="mt-6 flex justify-end">
          <Button
            variant="secondary"
            onClick={() => {
              setSelectedClient(null);
              setSelectedAppointment(null);
            }}
          >
            Cerrar
          </Button>
        </div>
      </DetailModal>
    </div>
  );
}
