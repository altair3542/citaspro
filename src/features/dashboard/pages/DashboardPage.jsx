import Card from "../../../shared/components/ui/Card";

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Placeholder: aquí vivirá el flujo principal (Clientes y Citas). Se protegerá con Auth en la sesión 4.
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold">Próximo paso</h2>
        <p className="mt-2 text-gray-600">
          En la sesión 2 construiremos el dashboard con datos simulados, estados de UI (empty/loading/error) y filtros.
        </p>
      </Card>
    </div>
  );
}
