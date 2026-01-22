import { useMemo, useState } from "react";
import Card from "../../../../shared/components/ui/Card";
import Input from "../../../../shared/components/ui/Input";
import Button from "../../../../shared/components/ui/Button";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizePhone(phone) {
  return phone.replace(/\s+/g, "").trim();
}

export default function ValidationExercise() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [formError, setFormError] = useState("");
  const [okPayload, setOkPayload] = useState(null);

  const validation = useMemo(() => {
    const errors = {};

    const n = name.trim();
    const p = normalizePhone(phone);
    const e = email.trim();

    if (!n) errors.name = "El nombre es obligatorio.";
    if (!p) errors.phone = "El teléfono es obligatorio.";
    if (p && !/^\d{7,15}$/.test(p)) errors.phone = "Teléfono inválido (7 a 15 dígitos, solo números).";
    if (e && !isValidEmail(e)) errors.email = "Email inválido.";

    return {
      ok: Object.keys(errors).length === 0,
      errors,
      payload: { name: n, phone: p, email: e },
    };
  }, [name, phone, email]);

  function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    setOkPayload(null);

    if (!validation.ok) {
      setFormError("Corrige los campos marcados antes de continuar.");
      return;
    }

    setOkPayload(validation.payload);
  }

  return (
    <Card className="p-6 grid gap-4">
      <div>
        <h2 className="text-lg font-semibold">Ejercicio 3: Validación mínima</h2>
        <p className="mt-1 text-sm text-gray-600">
          Reglas: nombre requerido, teléfono requerido y numérico (7–15), email opcional pero válido si se llena.
        </p>
      </div>

      {formError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </div>
      ) : null}

      <form className="grid gap-3" onSubmit={handleSubmit}>
        <div className="grid gap-1">
          <Input
            label="Nombre"
            name="name"
            placeholder="Ej: Ana Pérez"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {validation.errors.name ? <p className="text-sm text-red-600">{validation.errors.name}</p> : null}
        </div>

        <div className="grid gap-1">
          <Input
            label="Teléfono"
            name="phone"
            placeholder="Ej: 3001234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {validation.errors.phone ? <p className="text-sm text-red-600">{validation.errors.phone}</p> : null}
        </div>

        <div className="grid gap-1">
          <Input
            label="Email (opcional)"
            name="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {validation.errors.email ? <p className="text-sm text-red-600">{validation.errors.email}</p> : null}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setName("");
              setPhone("");
              setEmail("");
              setFormError("");
              setOkPayload(null);
            }}
          >
            Reset
          </Button>

          <Button type="submit" disabled={!validation.ok}>
            Guardar
          </Button>
        </div>
      </form>

      <div className="grid gap-2">
        <h3 className="text-sm font-semibold text-gray-800">Payload válido</h3>
        <pre className="rounded-md bg-gray-50 p-3 text-xs overflow-auto border">
{okPayload ? JSON.stringify(okPayload, null, 2) : "—"}
        </pre>
      </div>
    </Card>
  );
}
