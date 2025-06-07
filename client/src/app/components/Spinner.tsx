type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  inline?: boolean;
  color?: string;
  className?: string;
};

export default function Spinner({
  size = "md",
  inline = false,
  color,
  className = "",
}: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-4",
    lg: "h-8 w-8 border-4",
  };

  const borderColor = color ?? (inline ? "white" : "blue-600");

  const spinner = (
    <div
      className={`${sizeClasses[size]} border-${borderColor} border-t-transparent rounded-full animate-spin ${className}`}
    />
  );

  if (inline) return spinner;

  return <div className="flex justify-center items-center py-8">{spinner}</div>;
}
