import { useState } from "react";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  Filter,
  Calendar,
  AlertCircle
} from "lucide-react";
import useSWR from "swr";

import { getTransactions } from "@/services/api/user.api";
import { type TransactionQuery, type Transaction } from "@/types/transaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TransactionHistoryProps {
  userId?: string;
}

export default function TransactionHistory({ userId }: TransactionHistoryProps) {
  const [query, setQuery] = useState<TransactionQuery>({
    page: 1,
    limit: 10,
    type: 'all'
  });

  // Fetch transactions with SWR
  const { data, isLoading, error } = useSWR(
    ['transactions', query],
    () => getTransactions(query)
  );

  // Format currency
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  // Check if transaction is sent by current user
  const isOutgoing = (transaction: Transaction) => {
    return transaction.fromUserId._id === userId;
  };

  // Handle filter change
  const handleFilterChange = (type: 'all' | 'sent' | 'received') => {
    setQuery(prev => ({ ...prev, type, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setQuery(prev => ({ ...prev, page: newPage }));
  };

  // Render transaction item
  const renderTransaction = (transaction: Transaction) => {
    const outgoing = isOutgoing(transaction);
    const otherUser = outgoing ? transaction.toUserId : transaction.fromUserId;
    
    return (
      <div key={transaction._id} className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
            outgoing ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
          }`}>
            {outgoing ? (
              <ArrowUpRight className="h-5 w-5" />
            ) : (
              <ArrowDownLeft className="h-5 w-5" />
            )}
          </div>
          
          <div className="space-y-1">
            <p className="font-medium">
              {outgoing ? 'Sent to' : 'Received from'} {otherUser.firstName} {otherUser.lastName}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDate(transaction.createdAt)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${
            outgoing ? 'text-red-600' : 'text-green-600'
          }`}>
            {outgoing ? '-' : '+'}{formatAmount(transaction.amount)}
          </span>
          
          <Badge variant={
            transaction.status === 'completed' ? 'default' : 
            transaction.status === 'pending' ? 'secondary' : 'destructive'
          }>
            {transaction.status}
          </Badge>
        </div>
      </div>
    );
  };

  // Render loading skeleton
  const renderSkeleton = () => (
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
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );

  // Render empty state
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <History className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
      <p className="text-muted-foreground text-sm max-w-sm">
        {query.type === 'sent' ? "You haven't sent any money yet." :
         query.type === 'received' ? "You haven't received any money yet." :
         "You don't have any transactions yet."}
      </p>
    </div>
  );

  // Render error state
  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-destructive">Failed to load transactions</h3>
      <p className="text-muted-foreground text-sm">
        Something went wrong while loading your transaction history.
      </p>
    </div>
  );

  // Render pagination
  const renderPagination = () => {
    if (!data?.data.pagination || data.data.pagination.totalPages <= 1) return null;

    const { currentPage, totalPages } = data.data.pagination;
    
    return (
      <div className="flex items-center justify-between pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
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
            <History className="h-5 w-5" />
            Transaction History
            {data?.data.pagination && data.data.pagination.totalTransactions > 0 && (
              <Badge variant="secondary">
                {data.data.pagination.totalTransactions}
              </Badge>
            )}
          </CardTitle>
          
          <Select value={query.type} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-36">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="received">Received</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isLoading ? (
          renderSkeleton()
        ) : error ? (
          renderErrorState()
        ) : !data?.data.transactions.length ? (
          renderEmptyState()
        ) : (
          <div className="space-y-3">
            {data.data.transactions.map(renderTransaction)}
          </div>
        )}
        
        {!isLoading && !error && renderPagination()}
      </CardContent>
    </Card>
  );
}