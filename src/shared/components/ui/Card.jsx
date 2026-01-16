import { cn } from "../../lib/cn";

export default function Card({ className, ...props }) {
  return (
    <div
      className={cn("rounded-lg border border-gray-200 bg-white shadow-sm", className)}
      {...props}
    />
  );
}
