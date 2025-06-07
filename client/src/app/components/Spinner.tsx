type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  inline?: boolean;
  className?: string;
};

export default function Spinner({
  size = "md",
  inline = false,
  className = "",
}: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-4",
    lg: "h-8 w-8 border-4",
  };

  const spinner = (
    <div
      role="status"
      className={`${sizeClasses[size]} ${
        inline ? "border-white" : "border-blue-600"
      } border-t-transparent rounded-full animate-spin ${className}`}
    />
  );

  if (inline) return spinner;

  return <div className="flex justify-center items-center py-8">{spinner}</div>;
}
