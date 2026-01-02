import { toast as shadcnToast } from "@/components/ui/use-toast";

export const toast = {
  success: (message: string, description?: string) => {
    shadcnToast({
      title: message,
      description,
      variant: "default",
      className: "bg-green-900/50 border-green-800 text-white",
    });
  },

  error: (message: string, description?: string) => {
    shadcnToast({
      title: message,
      description,
      variant: "destructive",
    });
  },

  info: (message: string, description?: string) => {
    shadcnToast({
      title: message,
      description,
      variant: "default",
    });
  },

  warning: (message: string, description?: string) => {
    shadcnToast({
      title: message,
      description,
      variant: "default",
      className: "bg-yellow-900/50 border-yellow-800 text-white",
    });
  },
};
