import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { GetUser } from "@/types/user";

interface UsersProps {
  users: GetUser[];
  onSendMoney: (userId: string) => void;
  query: string;
  setQuery: (val: string) => void;
  isLoading?: boolean;
  error?: unknown;
}

export function Users({
  users,
  onSendMoney,
  query,
  setQuery,
  isLoading = false,
  error,
}: UsersProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Users</h3>

      {/* Search input (always visible) */}
      <Input
        aria-label="Search users"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Loading state */}
      {isLoading ? (
        <div className="space-y-2 mt-2">
          {/* A few skeleton rows to simulate results */}
          <Skeleton className="h-[56px] w-full rounded-lg" />
          <Skeleton className="h-[56px] w-full rounded-lg" />
          <Skeleton className="h-[56px] w-full rounded-lg" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-sm mt-2">Failed to load users</p>
      ) : users.length === 0 ? (
        <p className="text-muted-foreground text-sm mt-2">No users found</p>
      ) : (
        <div className="space-y-2 mt-2">
          {users.map((user) => (
            <Card key={user._id} className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{user.firstName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{user.firstName} {user.lastName}</span>
              </div>
              <Button size="sm" onClick={() => onSendMoney(user._id)}>
                Send Money
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
