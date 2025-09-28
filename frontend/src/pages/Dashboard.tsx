import { useEffect, useState } from "react";
import { Users as UsersIcon } from "lucide-react";
import useSWR, { mutate } from "swr";

import { Balance } from "@/components/balance";
import { Users } from "@/components/users";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { getAllOtherUsers, getUserBalance } from "@/services/api/user.api";
import { useDebounce } from "@/hooks/useDebounce";

export default function Dashboard() {
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
    isValidating: isBalanceValidating,
  } = useSWR(
    ["user-list", debouncedQuery],
    () => getAllOtherUsers({ name: debouncedQuery }),
    { keepPreviousData: true, revalidateOnFocus: false }
  );

  const balance = (balanceData as { balance: number })?.balance ?? 0;

  return (
    <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Balance Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {isBalanceLoading ? (
              // Initial load shimmer
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
              <>
                <Balance value={balance} />
                {isBalanceValidating && (
                  <p className="text-xs text-muted-foreground mt-1 animate-pulse">
                    ⏳ Updating balance...
                  </p>
                )}
              </>
            )}
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Users
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
        <Users
          users={usersData?.users ?? []}
          query={query}
          setQuery={setQuery}
          isLoading={isUsersLoading}
          error={usersError}
          onTransferSuccess={() => {
            // ✅ Refresh balance and users list after transfer
            mutate("user-balance");
            mutate(["user-list", debouncedQuery]);
          }}
        />
      </div>
    </div>
  );
}
