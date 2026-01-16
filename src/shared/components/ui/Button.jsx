import { cn } from "../../lib/cn";

const base =
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary: "bg-gray-900 text-white hover:bg-gray-800 focus-visible:ring-gray-900",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400",
  ghost: "bg-transparent text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-400",
};

export default function Button({ variant = "primary", className, ...props }) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}
