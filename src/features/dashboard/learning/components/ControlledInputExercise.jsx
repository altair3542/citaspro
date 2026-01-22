import { useState } from "react";
import Card from "../../../../shared/components/ui/Card";
import Input from "../../../../shared/components/ui/Input";

export default function ControlledInputExercise() {
  const [name, setName] = useState("");

  return (
    <Card className="p-6 grid gap-4">
      <div>
        <h2 className="text-lg font-semibold">Ejercicio 1: Input controlado</h2>
        <p className="mt-1 text-sm text-gray-600">
          Un input es controlado cuando su valor viene del estado y cada cambio actualiza ese estado.
        </p>
      </div>

      <Input
        label="Nombre"
        name="name"
        placeholder="Escribe tu nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="text-sm">
        <span className="text-gray-600">Salida:</span>{" "}
        <span className="font-medium">{name ? `Hola, ${name}` : "—"}</span>
      </div>
    </Card>
  );
}
