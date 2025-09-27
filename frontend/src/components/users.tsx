import { useState } from "react";
import { 
  Search, 
  Users as UsersIcon, 
  Send,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { GetUser } from "@/types/user";
import { TransferModal } from "./transferModal";

interface UsersProps {
  users: GetUser[];
  query: string;
  setQuery: (val: string) => void;
  isLoading?: boolean;
  error?: unknown;
  onTransferSuccess?: () => void; // Callback to refresh data
}

const USERS_PER_PAGE = 4;

export function Users({
  users,
  query,
  setQuery,
  isLoading = false,
  error,
  onTransferSuccess,
}: UsersProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const sortedUsers = [...users].sort((a, b) => {
    return a.firstName.localeCompare(b.firstName);
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + USERS_PER_PAGE);

  // Reset to page 1 when search changes
  const handleSearch = (value: string) => {
    setQuery(value);
    setCurrentPage(1);
  };

  // Handle successful transfer - refresh balance and call parent callback
  const handleTransferSuccess = () => {
    onTransferSuccess?.();
  };

  const renderUserSkeleton = () => (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
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
            We couldn't find any users matching "{query}".
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
        Something went wrong while loading the user list.
      </p>
    </div>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages} ({sortedUsers.length} users)
        </p>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm px-2">{currentPage}</span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

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
            onChange={(e) => handleSearch(e.target.value)}
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
            paginatedUsers.map((user) => (
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
                  </div>
                </div>
                
                <TransferModal user={user} onSuccess={handleTransferSuccess}>
                  <Button size="sm" className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Send
                  </Button>
                </TransferModal>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {!isLoading && !error && renderPagination()}
      </CardContent>
    </Card>
  );
}
