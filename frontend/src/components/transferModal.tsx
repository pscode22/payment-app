import { useState } from "react";
import { Eye, EyeOff, Send } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

import { transferMoney } from "@/services/api/user.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { GetUser } from "@/types/user";
import type { AxiosError } from "axios";

// Transfer validation schema
const transferSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be positive")
    .min(1, "Minimum amount is ₹1")
    .max(100000, "Maximum amount is ₹1,00,000"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

interface TransferModalProps {
  user: GetUser;
  onSuccess?: () => void;
  children: React.ReactNode;
}

function disableClicks() {
  document.body.style.pointerEvents = "none";
}

// Re-enable clicks
function enableClicks() {
  document.body.style.pointerEvents = "auto"; // or 'all'
}

export function TransferModal({
  user,
  onSuccess,
  children,
}: TransferModalProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal closes
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setAmount("");
      setPassword("");
      setShowPassword(false);
      setErrors({});
    }
  };

  // Validate form data
  const validateForm = () => {
    try {
      const numAmount = parseFloat(amount);
      transferSchema.parse({ amount: numAmount, password });
      setErrors({});
      return { amount: numAmount, password };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return null;
    }
  };

  // Handle transfer submission
  const handleTransfer = async () => {
    const validData = validateForm();
    if (!validData) return;

    setIsTransferring(true);
    disableClicks();
    try {
      await transferMoney({
        amount: validData.amount,
        toUser: user._id,
        password: validData.password,
      });

      toast.success(
        `₹${validData.amount} sent to ${user.firstName} ${user.lastName}`
      );
      handleOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      const message =
        error.response?.data?.message ||
        (error.response?.data as unknown as { error: string }).error ||
        "Transfer failed";
      toast.error(message);
    } finally {
      setIsTransferring(false);
      enableClicks();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Money
          </DialogTitle>
          <DialogDescription>
            Transfer money to {user.firstName} {user.lastName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Recipient Info */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {user.firstName.charAt(0).toUpperCase()}
                {user.lastName?.charAt(0).toUpperCase() || ""}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-muted-foreground">Recipient</p>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount in INR"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={errors.amount ? "border-red-500" : ""}
            />
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "border-red-500 pr-10" : "pr-10"}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleTransfer}
            disabled={isTransferring || !amount || !password}
          >
            {isTransferring ? "Sending..." : `Send ₹${amount || "0"}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
