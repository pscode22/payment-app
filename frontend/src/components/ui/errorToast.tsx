import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

export function errorToast(message: string) {
  toast.custom(() => (
    <div
      className="flex items-center gap-3 rounded-lg border px-4 py-3 
                 bg-destructive text-destructive-foreground shadow-lg 
                 animate-in fade-in slide-in-from-bottom-5"
    >
      <AlertTriangle className="h-5 w-5 shrink-0" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  ));
}
