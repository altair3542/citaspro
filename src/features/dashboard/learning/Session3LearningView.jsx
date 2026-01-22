import { useState } from "react";
import Card from "../../../shared/components/ui/Card";
import Button from "../../../shared/components/ui/Button";

import ControlledInputExercise from "./components/ControlledInputExercise";
import FormSubmitExercise from "./components/FormSubmitExercise";
import ValidationExercise from "./components/ValidationExercise";

export default function Session3LearningView({ onOpenCreateClient }) {
  const [tab, setTab] = useState("controlled"); // controlled | submit | validation

  return (
    <div className="grid gap-6">
      <Card className="p-5">
        <h2 className="text-lg font-semibold">Aprender — Sesión 3 (integrado)</h2>
        <p className="mt-1 text-sm text-gray-600">
          Estos ejercicios viven dentro del proyecto y conectan directamente con el CRUD real de Clientes.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant={tab === "controlled" ? "primary" : "secondary"}
            onClick={() => setTab("controlled")}
          >
            Input controlado
          </Button>
          <Button
            variant={tab === "submit" ? "primary" : "secondary"}
            onClick={() => setTab("submit")}
          >
            Submit
          </Button>
          <Button
            variant={tab === "validation" ? "primary" : "secondary"}
            onClick={() => setTab("validation")}
          >
            Validación
          </Button>

          <div className="flex-1" />

          <Button onClick={onOpenCreateClient}>
            Ir al CRUD real: Nuevo cliente
          </Button>
        </div>
      </Card>

      {tab === "controlled" ? <ControlledInputExercise /> : null}
      {tab === "submit" ? <FormSubmitExercise /> : null}
      {tab === "validation" ? <ValidationExercise /> : null}
    </div>
  );
}
