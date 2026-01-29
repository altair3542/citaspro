import { useEffect, useMemo, useState } from "react";
import DetailModal from "./DetailModal";
import Input from "../../../shared/components/ui/Input";
import Button from "../../../shared/components/ui/Button";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizePhone(phone) {
  return phone.replace(/\s+/g, "").trim();
}

export default function ClientFormModal({ open, mode, initialClient, onClose, onSubmit }) {
  const isEdit = mode === "edit";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("active");

  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (isEdit && initialClient) {
      setName(initialClient.name || "");
      setPhone(initialClient.phone || "");
      setEmail(initialClient.email || "");
      setStatus(initialClient.status || "active");
    } else {
      setName("");
      setPhone("");
      setEmail("");
      setStatus("active");
    }

    setFormError("");
    setSubmitting(false);
  }, [open, isEdit, initialClient]);

  const validation = useMemo(() => {
    const errors = {};
    const n = name.trim();
    const p = normalizePhone(phone);
    const e = email.trim();

    if (!n) errors.name = "El nombre es obligatorio.";
    if (!p) errors.phone = "El teléfono es obligatorio.";
    if (p && !/^\d{7,15}$/.test(p)) errors.phone = "Teléfono inválido. Usa 7 a 15 dígitos (solo números).";
    if (e && !isValidEmail(e)) errors.email = "Email inválido.";

    return { ok: Object.keys(errors).length === 0, errors, payload: { name: n, phone: p, email: e, status } };
  }, [name, phone, email, status]);

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
    <DetailModal open={open} title={isEdit ? "Editar cliente" : "Nuevo cliente"} onClose={onClose}>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        {formError ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </div>
        ) : null}

        <Input label="Nombre" name="name" value={name} onChange={(e) => setName(e.target.value)} />
        {validation.errors.name ? <p className="text-sm text-red-600 -mt-3">{validation.errors.name}</p> : null}

        <Input label="Teléfono" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        {validation.errors.phone ? <p className="text-sm text-red-600 -mt-3">{validation.errors.phone}</p> : null}

        <Input label="Email (opcional)" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {validation.errors.email ? <p className="text-sm text-red-600 -mt-3">{validation.errors.email}</p> : null}

        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-gray-800">Estado</label>
          <select
            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={!validation.ok || submitting}>
            {submitting ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear cliente"}
          </Button>
        </div>
      </form>
    </DetailModal>
  );
}
