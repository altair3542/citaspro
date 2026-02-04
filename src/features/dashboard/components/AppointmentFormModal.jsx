import { useEffect, useMemo, useState } from "react";
import DetailModal from "./DetailModal";
import Input from "../../../shared/components/ui/Input";
import Button from "../../../shared/components/ui/Button";

// Convierte un ISO (timestamptz) a valor para <input type="datetime-local">
function isoToLocalInputValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Convierte el valor de datetime-local a ISO string
function localInputValueToIso(localValue) {
  // localValue: "YYYY-MM-DDTHH:mm"
  if (!localValue) return "";
  const d = new Date(localValue);
  return d.toISOString();
}

export default function AppointmentFormModal({
  open,
  mode, // "create" | "edit"
  initialAppointment,
  clients, // lista de clientes para select
  onClose,
  onSubmit, // async (payload) => ...
}) {
  const isEdit = mode === "edit";

  const [clientId, setClientId] = useState("");
  const [dateTimeLocal, setDateTimeLocal] = useState("");
  const [service, setService] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("scheduled");

  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (isEdit && initialAppointment) {
      setClientId(initialAppointment.clientId || "");
      setDateTimeLocal(isoToLocalInputValue(initialAppointment.dateTime));
      setService(initialAppointment.service || "");
      setNotes(initialAppointment.notes || "");
      setStatus(initialAppointment.status || "scheduled");
    } else {
      setClientId(clients?.[0]?.id || "");
      setDateTimeLocal("");
      setService("");
      setNotes("");
      setStatus("scheduled");
    }

    setFormError("");
    setSubmitting(false);
  }, [open, isEdit, initialAppointment, clients]);

  const validation = useMemo(() => {
    const errors = {};
    const s = service.trim();
    const dtIso = localInputValueToIso(dateTimeLocal);

    if (!clientId) errors.clientId = "Selecciona un cliente.";
    if (!dateTimeLocal) errors.dateTime = "La fecha/hora es obligatoria.";
    if (dateTimeLocal && !dtIso) errors.dateTime = "Fecha/hora inválida.";
    if (!s) errors.service = "El servicio es obligatorio.";

    return {
      ok: Object.keys(errors).length === 0,
      errors,
      payload: {
        clientId,
        dateTime: dtIso,
        service: s,
        notes: notes.trim(),
        status,
      },
    };
  }, [clientId, dateTimeLocal, service, notes, status]);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    if (!validation.ok) {
      setFormError("Corrige los campos marcados antes de continuar.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(validation.payload);
      onClose();
    } catch (err) {
      setFormError(err?.message || "Ocurrió un error al guardar.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DetailModal open={open} title={isEdit ? "Editar cita" : "Nueva cita"} onClose={onClose}>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        {formError ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </div>
        ) : null}

        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-gray-800">Cliente</label>
          <select
            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          >
            {Array.isArray(clients) && clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {validation.errors.clientId ? <p className="text-sm text-red-600">{validation.errors.clientId}</p> : null}
        </div>

        <Input
          label="Fecha y hora"
          name="dateTime"
          type="datetime-local"
          value={dateTimeLocal}
          onChange={(e) => setDateTimeLocal(e.target.value)}
        />
        {validation.errors.dateTime ? <p className="text-sm text-red-600 -mt-3">{validation.errors.dateTime}</p> : null}

        <Input
          label="Servicio"
          name="service"
          placeholder="Ej: Corte de cabello"
          value={service}
          onChange={(e) => setService(e.target.value)}
        />
        {validation.errors.service ? <p className="text-sm text-red-600 -mt-3">{validation.errors.service}</p> : null}

        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-gray-800">Notas (opcional)</label>
          <textarea
            className="min-h-24 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observaciones..."
          />
        </div>

        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-gray-800">Estado</label>
          <select
            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="scheduled">Programada</option>
            <option value="completed">Completada</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={!validation.ok || submitting}>
            {submitting ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear cita"}
          </Button>
        </div>
      </form>
    </DetailModal>
  );
}
