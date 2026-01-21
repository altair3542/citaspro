import Card from "../../../shared/components/ui/Card";
import Button from "../../../shared/components/ui/Button";

export default function ErrorState({ message, onRetry }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold">Ocurrió un error</h3>
      <p className="mt-2 text-gray-600">{message}</p>
      <div className="mt-4">
        <Button onClick={onRetry}>Reintentar</Button>
      </div>
    </Card>
  );
}
  