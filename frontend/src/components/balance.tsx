import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BalanceProps {
  value: number;
}

export function Balance({ value }: BalanceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Your balance</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">₹ {value.toLocaleString()}</p>
      </CardContent>
    </Card>
  );
}
