import { cn } from "../../lib/cn";

export default function Input({ label, id, className, ...props }) {
  const inputId = id ?? props.name;

  return (
    <div className="grid gap-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-800">
          {label}
        </label>
      ) : null}

      <input
        id={inputId}
        className={cn(
          "h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2",
          className
        )}
        {...props}
      />
    </div>
  );
}
