import { cn } from "../../lib/cn";

export default function Spinner({ className }) {
  return (
    <div
      className={cn(
        "h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900",
        className
      )}
      aria-label="Cargando"
      role="status"
    />
  );
}
