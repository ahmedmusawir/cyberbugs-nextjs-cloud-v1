import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export const LoadingState = ({ 
  message = "Loading...", 
  size = "md" 
}: LoadingStateProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-500`} />
      <p className="text-slate-400 text-sm">{message}</p>
    </div>
  );
};
