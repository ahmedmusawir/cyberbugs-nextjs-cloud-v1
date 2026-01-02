import { AlertTriangle } from "lucide-react";
import { Button } from "./button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({
  title = "Something went wrong",
  message = "We encountered an error while loading this content.",
  onRetry,
}: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center px-4">
      <div className="p-4 bg-red-900/20 rounded-full">
        <AlertTriangle className="h-8 w-8 text-red-400" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-slate-400 max-w-md">{message}</p>
      </div>
      {onRetry && (
        <Button 
          onClick={onRetry} 
          variant="outline"
          className="mt-2"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
