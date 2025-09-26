import { Wallet, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BalanceProps {
  value: number;
  className?: string;
}

export function Balance({ value, className }: BalanceProps) {
  const [isVisible, setIsVisible] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 10000) return "text-emerald-600 dark:text-emerald-400";
    if (balance > 1000) return "text-blue-600 dark:text-blue-400";
    if (balance > 0) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getBalanceStatus = (balance: number) => {
    if (balance > 10000) return { text: "Excellent", icon: "🌟" };
    if (balance > 1000) return { text: "Good", icon: "👍" };
    if (balance > 0) return { text: "Low", icon: "⚠️" };
    return { text: "Critical", icon: "🚨" };
  };

  const balanceStatus = getBalanceStatus(value);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            Current Balance
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(!isVisible)}
            className="h-8 w-8"
          >
            {isVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span 
              className={cn(
                "text-3xl font-bold tabular-nums",
                getBalanceColor(value)
              )}
            >
              {isVisible ? formatCurrency(value) : "₹ ****"}
            </span>
            {isVisible && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                {balanceStatus.icon} {balanceStatus.text}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Available for transfer
          </p>
        </div>

        {/* Balance Indicator Bar */}
        {isVisible && (
          <div className="space-y-2">
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={cn(
                  "h-2 rounded-full transition-all duration-500",
                  value > 10000 ? "bg-emerald-500" :
                  value > 1000 ? "bg-blue-500" :
                  value > 0 ? "bg-amber-500" : "bg-red-500"
                )}
                style={{
                  width: `${Math.min((value / 15000) * 100, 100)}%`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₹0</span>
              <span>₹15,000+</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}