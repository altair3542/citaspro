import { useState } from "react";
import Card from "../../../../shared/components/ui/Card";
import Input from "../../../../shared/components/ui/Input";
import Button from "../../../../shared/components/ui/Button";

export default function FormSubmitExercise() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [lastPayload, setLastPayload] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
    };

    setLastPayload(payload);
  }

  return (
    <Card className="p-6 grid gap-4">
      <div>
        <h2 className="text-lg font-semibold">Ejercicio 2: Submit</h2>
        <p className="mt-1 text-sm text-gray-600">
          Interceptamos el submit con <code className="font-mono">preventDefault()</code> y generamos un payload.
        </p>
      </div>

      <form className="grid gap-3" onSubmit={handleSubmit}>
        <Input
          label="Nombre"
          name="name"
          placeholder="Ej: Ana Pérez"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Teléfono"
          name="phone"
          placeholder="Ej: 3001234567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div className="flex justify-end">
          <Button type="submit">Enviar</Button>
        </div>
      </form>

      <div className="grid gap-2">
        <h3 className="text-sm font-semibold text-gray-800">Payload generado</h3>
        <pre className="rounded-md bg-gray-50 p-3 text-xs overflow-auto border">
{lastPayload ? JSON.stringify(lastPayload, null, 2) : "—"}
        </pre>
      </div>
    </Card>
  );
}
