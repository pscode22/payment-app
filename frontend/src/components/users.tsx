import { useState } from "react";
import { 
  Search, 
  Users as UsersIcon, 
  Send, 
  Filter,
  AlertCircle,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const [sortBy, setSortBy] = useState<'name' | 'recent'>('name');

  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === 'name') {
      return a.firstName.localeCompare(b.firstName);
    }
    // For 'recent' sort, you'd use actual timestamp data
    return 0;
  });

  const renderUserSkeleton = () => (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      ))}
    </div>
  );

  const renderEmptyState = () => {
    if (query) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No users found</h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            We couldn't find any users matching "{query}". Try adjusting your search terms.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <UsersIcon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No users available</h3>
        <p className="text-muted-foreground text-sm max-w-sm">
          There are currently no other users in the system.
        </p>
      </div>
    );
  };

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-destructive">Failed to load users</h3>
      <p className="text-muted-foreground text-sm max-w-sm">
        Something went wrong while loading the user list. Please try again.
      </p>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            Send Money
            {users.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {users.length}
              </Badge>
            )}
          </CardTitle>
          
          {users.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortBy(sortBy === 'name' ? 'recent' : 'name')}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {sortBy === 'name' ? 'Name' : 'Recent'}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            aria-label="Search users"
            placeholder="Search users by name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Content */}
        <div className="space-y-3">
          {isLoading ? (
            renderUserSkeleton()
          ) : error ? (
            renderErrorState()
          ) : sortedUsers.length === 0 ? (
            renderEmptyState()
          ) : (
            sortedUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {user.firstName.charAt(0).toUpperCase()}
                      {user.lastName?.charAt(0).toUpperCase() || ''}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="font-medium leading-none">
                      {user.firstName} {user.lastName}
                    </p>
                    {/* <p className="text-sm text-muted-foreground">
                      {user.email || 'User'}
                    </p> */}
                  </div>
                </div>
                
                <Button 
                  size="sm" 
                  onClick={() => onSendMoney(user._id)}
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {!isLoading && !error && sortedUsers.length > 0 && (
          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Showing {sortedUsers.length} user{sortedUsers.length !== 1 ? 's' : ''}
              {query && ` matching "${query}"`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}