"use client";

import { createClient } from "@/lib/supabase/client";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Navbar({ userEmail }: { userEmail: string | undefined }) {
    const supabase = createClient();
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    return (
        <nav className="flex items-center justify-between border-b border-white/10 bg-black/50 px-6 py-4 backdrop-blur-md">
            <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Smart Bookmarks
                </h1>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
                    <User className="h-4 w-4" />
                    <span>{userEmail}</span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-gray-400 hover:text-white"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                </Button>
            </div>
        </nav>
    );
}
