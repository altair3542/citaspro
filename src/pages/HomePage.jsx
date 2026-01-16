import Card from "../shared/components/ui/Card";
import Button from "../shared/components/ui/Button";

export default function HomePage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bienvenido a CitasPro</h1>
        <p className="mt-2 text-gray-600">
          Gestiona clientes y citas desde una interfaz simple. Hoy dejamos lista la base del proyecto.
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold">Estado del proyecto</h2>
        <p className="mt-2 text-gray-600">
          UI base + rutas públicas. En sesiones posteriores integramos Auth y base de datos con Supabase.
        </p>

        <div className="mt-4 flex gap-2">
          <Button onClick={() => window.alert("Demo: Acción de ejemplo")}>Acción de ejemplo</Button>
          <Button variant="secondary" onClick={() => window.alert("Demo: Acción secundaria")}>
            Secundaria
          </Button>
        </div>
      </Card>
    </div>
  );
}
