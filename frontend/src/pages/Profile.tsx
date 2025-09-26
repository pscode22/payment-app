import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, ArrowLeft, Trash2, AlertTriangle } from "lucide-react";
import useSWR from "swr";

import { getProfile, deleteAccount } from "@/services/api/user.api";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
}

interface ProfileResponse {
  user: UserProfile;
}

export default function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: userData,
    isLoading,
    error,
  } = useSWR<ProfileResponse>("user-profile", getProfile);
  
  const user = userData?.user;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteAccount();
      toast.success(res.message || "Your account has been successfully deleted.");
      logout();
      navigate("/");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete your account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderProfileContent = () => {
    if (isLoading) {
      return (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardContent>
        </Card>
      );
    }

    if (error) {
      return (
        <Card className="border-destructive/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <p>Failed to load profile data</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (!user) {
      return (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">No profile data available</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Email</span>
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-muted-foreground">Full Name</span>
              <span className="text-sm">
                {user.firstName} {user.lastName}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        </div>

        {renderProfileContent()}

        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Delete Account
                  </div>
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>
                    Are you absolutely sure you want to delete your account? This action cannot be undone.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    All your data will be permanently removed from our servers.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}