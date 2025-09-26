import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  Users as UsersIcon,
  TrendingUp,
  User,
} from "lucide-react";
import useSWR from "swr";

import { Balance } from "@/components/balance";
import { Users } from "@/components/users";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllOtherUsers, getUserBalance } from "@/services/api/user.api";
import { useDebounce } from "@/hooks/useDebounce";

export default function Dashboard() {
  const navigate = useNavigate();

  // Load initial query from localStorage (safely)
  const [query, setQuery] = useState<string>(() => {
    try {
      return typeof window !== "undefined"
        ? localStorage.getItem("userSearch") ?? ""
        : "";
    } catch {
      return "";
    }
  });

  // Keep localStorage in sync
  useEffect(() => {
    try {
      localStorage.setItem("userSearch", query);
    } catch {
      /* ignore storage errors */
    }
  }, [query]);

  // Debounced query for API
  const debouncedQuery = useDebounce(query, 500);

  // Balance fetch
  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    error: balanceError,
  } = useSWR("user-balance", getUserBalance);

  // Users fetch
  const {
    data: usersData,
    isLoading: isUsersLoading,
    error: usersError,
  } = useSWR(
    ["user-list", debouncedQuery],
    () => getAllOtherUsers({ name: debouncedQuery }),
    { keepPreviousData: true, revalidateOnFocus: false }
  );

  const handleSendMoney = (userId: string) => {
    navigate(`/transfer/${userId}`);
  };

  const balance = (balanceData as { balance: number })?.balance ?? 0;

  return (
    <div className="min-h-screen bg-background">

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Current Balance */}
            <div className="lg:col-span-2">
              {isBalanceLoading ? (
                <Card>
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-32" />
                  </CardContent>
                </Card>
              ) : balanceError ? (
                <Card className="border-destructive/50">
                  <CardContent className="p-6">
                    <p className="text-destructive text-sm">
                      Failed to load balance
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Balance value={balance} />
              )}
            </div>


            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold">
                      {usersData?.users?.length || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Available</p>
                  </div>
                  <div className="h-12 w-12 bg-secondary/50 rounded-lg flex items-center justify-center">
                    <UsersIcon className="h-6 w-6 text-secondary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Users Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Users
                users={usersData?.users ?? []}
                onSendMoney={handleSendMoney}
                query={query}
                setQuery={setQuery}
                isLoading={isUsersLoading}
                error={usersError}
              />
            </div>

            {/* Quick Actions Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => navigate("/transfer")}
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Send Money
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => navigate("/history")}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Transaction History
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => navigate("/profile")}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Manage Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
