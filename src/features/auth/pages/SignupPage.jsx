import Card from "../../../shared/components/ui/Card";
import Input from "../../../shared/components/ui/Input";
import Button from "../../../shared/components/ui/Button";

export default function SignupPage() {
  return (
    <Card className="max-w-md p-6">
      <h1 className="text-xl font-semibold">Signup</h1>
      <p className="mt-1 text-sm text-gray-600">En la sesión 4 este formulario se conectará a Supabase Auth.</p>

      <form className="mt-6 grid gap-4" onSubmit={(e) => e.preventDefault()}>
        <Input label="Email" name="email" type="email" placeholder="correo@ejemplo.com" required />
        <Input label="Contraseña" name="password" type="password" placeholder="mínimo 8 caracteres" required />
        <Button type="submit">Crear cuenta</Button>
      </form>
    </Card>
  );
}
