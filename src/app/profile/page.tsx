"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditProfileModal } from "@/components/profile/edit-profile-modal";
import { ProfileCard } from "@/components/profile/profile-card";
import { ProfileSummary } from "@/components/profile/profile-summary";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    username?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
    role?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadUserData = () => {
      try {
        const userData = localStorage.getItem("user");
        let parsedUser = userData ? JSON.parse(userData) : null;

        if (!parsedUser) {
          const userInfo = localStorage.getItem("userInfo");
          parsedUser = userInfo ? JSON.parse(userInfo) : null;
        }

        if (!parsedUser) {
          const username = localStorage.getItem("username");
          const email = localStorage.getItem("email");
          const roles = localStorage.getItem("roles");
          if (username) {
            parsedUser = {
              username,
              email: email || undefined,
              role: roles ? JSON.parse(roles)[0] : "Customer",
            };
          }
        }

        if (parsedUser) {
          const userData = {
            username: parsedUser.username || "User",
            fullName:
              parsedUser.fullName ||
              parsedUser.customer?.fullName ||
              "User Profile",
            email: parsedUser.email || "Not provided",
            phone:
              parsedUser.phone ||
              parsedUser.customer?.phoneNumber ||
              "Not provided",
            address:
              parsedUser.address ||
              parsedUser.customer?.address ||
              "Not provided",
            role: parsedUser.role || "Customer",
          };
          setUser(userData);
          setEditForm({
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            address: userData.address,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
    window.addEventListener("auth-change", loadUserData);
    return () => window.removeEventListener("auth-change", loadUserData);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  const handleOpenEdit = () => {
    if (user) {
      setEditForm({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      setUser((prev) => (prev ? { ...prev, ...editForm } : null));
      localStorage.setItem("user", JSON.stringify({ ...user, ...editForm }));
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">You are not logged in</h2>
        <Button onClick={() => router.push("/auth/login")}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <ProfileCard user={user} onLogout={handleLogout} activeNav="profile" />
        </div>
        <ProfileSummary user={user} onOpenEdit={handleOpenEdit} />
      </div>

      <EditProfileModal
        isOpen={isEditOpen}
        formValues={editForm}
        onChange={handleFormChange}
        onClose={handleCloseEdit}
        onSave={handleSaveProfile}
        isSaving={isSaving}
      />
    </div>
  );
}
