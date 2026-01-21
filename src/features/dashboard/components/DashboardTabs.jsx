import Button from "../../../shared/components/ui/Button";

export default function DashboardTabs({ active, onChange }) {
  return (
    <div className="flex gap-2">
      <Button variant={active === "clients" ? "primary" : "secondary"} onClick={() => onChange("clients")}>
        Clientes
      </Button>
      <Button
        variant={active === "appointments" ? "primary" : "secondary"}
        onClick={() => onChange("appointments")}
      >
        Citas
      </Button>
    </div>
  );
}
