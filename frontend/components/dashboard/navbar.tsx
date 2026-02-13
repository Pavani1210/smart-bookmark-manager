"use client";

import { createClient } from "@/lib/supabase/client";
import { LogOut, User, Command, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";

export default function Navbar({ userEmail }: { userEmail: string | undefined }) {
    const supabase = createClient();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    const userInitials = userEmail
        ? userEmail.split('@')[0].slice(0, 2).toUpperCase()
        : "U";

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                        <Command className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-lg text-zinc-100 tracking-tight">
                        Bookmarks
                    </span>
                </div>

                <div className="flex items-center gap-4" ref={dropdownRef}>
                    <div className="relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900 p-1 pl-3 pr-2 transition-colors hover:border-white/20 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        >
                            <span className="text-sm font-medium text-zinc-300">
                                {userEmail?.split('@')[0]}
                            </span>
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-xs font-medium text-zinc-300">
                                {userInitials}
                            </div>
                        </button>

                        {isOpen && (
                            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-white/10 bg-zinc-950 p-1 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-2 py-1.5">
                                    <p className="text-xs font-medium text-zinc-500">Signed in as</p>
                                    <p className="truncate text-sm font-medium text-zinc-200">{userEmail}</p>
                                </div>
                                <div className="my-1 h-px bg-white/10" />
                                <button
                                    onClick={handleSignOut}
                                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
