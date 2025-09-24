import { useEffect, useState } from "react";
import { Balance } from "@/components/balance";
import { Users } from "@/components/users";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllOtherUsers, getUserBalance } from "@/services/api/user.api";
// import { useUser } from "@/context/UserContext";
import useSWR from "swr";
import { useDebounce } from "@/hooks/useDebounce";

export default function Dashboard() {
  // const { user } = useUser();

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

  console.log({ debouncedQuery, query });

  // Balance fetch
  const { data, isLoading: isBalanceLoading } = useSWR(
    "user-balance",
    getUserBalance
  );

  // Users fetch — only run when user is available
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
    console.log("Send money to:", userId);
    // call transfer API here
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="text-xl font-bold">📊 Dashboard Page</h1>

      {/* Balance */}
      {isBalanceLoading && !data ? (
        <Skeleton className="h-[60px] w-[250px] rounded-xl" />
      ) : (
        <Balance value={(data as { balance: number })?.balance ?? 0} />
      )}

      {/* Users — always render the Users component so the search input never disappears */}
      <Users
        users={usersData?.users ?? []}
        onSendMoney={handleSendMoney}
        query={query}
        setQuery={setQuery}
        isLoading={isUsersLoading}
        error={usersError}
      />
    </div>
  );
}
