"use client";

import { User, Package, Heart, LogOut, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export interface ProfileCardProps {
  user: {
    username?: string;
    fullName?: string;
    role?: string;
  };
  onLogout: () => void;
}

export function ProfileCard({ user, onLogout }: ProfileCardProps) {
  const displayName = user.fullName || user.username || "User";
  const initials = displayName.substring(0, 1).toUpperCase();

  return (
    <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-b from-primary/5 to-white">
      <CardContent className="pt-10 pb-8 flex flex-col items-center">
        <div className="relative mb-6">
          <Avatar className="h-32 w-32 border-4 border-white shadow-2xl">
            <AvatarImage src="" />
            <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-0 right-0 rounded-full h-10 w-10 shadow-lg border-2 border-white"
          >
            <Camera className="h-5 w-5" />
          </Button>
        </div>

        <h2 className="text-2xl font-black tracking-tight">{displayName}</h2>
        <p className="text-muted-foreground font-medium mb-4">
          @{user.username}
        </p>

        <Badge
          variant="secondary"
          className="px-4 py-1 rounded-full font-bold uppercase tracking-wider"
        >
          {user.role || "Customer"}
        </Badge>
      </CardContent>

      <Separator />

      <CardContent className="p-0">
        <nav className="flex flex-col">
          <button className="flex items-center gap-3 px-6 py-4 hover:bg-slate-50 transition-colors text-primary font-bold border-l-4 border-primary">
            <User className="h-5 w-5" />
            Profile Information
          </button>
          <button className="flex items-center gap-3 px-6 py-4 hover:bg-slate-50 transition-colors text-slate-600 font-medium">
            <Package className="h-5 w-5" />
            My Orders
          </button>
          <button className="flex items-center gap-3 px-6 py-4 hover:bg-slate-50 transition-colors text-slate-600 font-medium">
            <Heart className="h-5 w-5" />
            Wishlist
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-6 py-4 hover:bg-rose-50 transition-colors text-rose-600 font-medium"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </nav>
      </CardContent>
    </Card>
  );
}
