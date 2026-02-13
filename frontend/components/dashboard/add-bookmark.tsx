"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2, Link as LinkIcon, Type } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function AddBookmark() {
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url || !title) return;

        setLoading(true);
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                // Auto-fix URL if missing protocol
                let finalUrl = url;
                if (!/^https?:\/\//i.test(url)) {
                    finalUrl = `https://${url}`;
                }

                await supabase.from("bookmarks").insert({
                    title,
                    url: finalUrl,
                    user_id: user.id,
                });
                setUrl("");
                setTitle("");
                router.refresh();
            }
        } catch (error) {
            console.error("Error adding bookmark:", error);
        } finally {
            setLoading(false);
            setFocused(false);
        }
    };

    return (
        <div className={`relative transition-all duration-500 ease-out ${focused ? "scale-[1.01]" : "scale-100"}`}>
            <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0 blur-2xl transition-opacity duration-500 ${focused ? "opacity-100" : ""}`} />

            <Card className="relative overflow-hidden border-white/10 bg-zinc-900/70 backdrop-blur-xl transition-all duration-300 hover:border-white/20">
                <form onSubmit={handleSubmit} className="flex flex-col gap-0 p-1 sm:flex-row sm:items-center">
                    <div className="relative flex-1 group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-hover:text-zinc-500">
                            <Type className="h-4 w-4" />
                        </div>
                        <Input
                            placeholder="Title (e.g., Linear App)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onFocus={() => setFocused(true)}
                            className="bg-transparent border-0 h-14 pl-12 pr-4 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                            required
                        />
                        <div className="absolute right-0 top-1/2 h-6 w-px bg-white/5 -translate-y-1/2 hidden sm:block" />
                    </div>

                    <div className="relative flex-1 group sm:border-t-0 border-t border-white/5">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-hover:text-zinc-500">
                            <LinkIcon className="h-4 w-4" />
                        </div>
                        <Input
                            placeholder="URL (e.g., linear.app)"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onFocus={() => setFocused(true)}
                            className="bg-transparent border-0 h-14 pl-12 pr-4 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-sm"
                            required
                        />
                    </div>

                    <div className="p-2 sm:pl-0">
                        <Button
                            type="submit"
                            disabled={loading || !url || !title}
                            className={`h-10 w-full sm:w-auto px-6 font-medium transition-all duration-300 ${loading || (!url && !title)
                                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                                }`}
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" /> <span className="sm:hidden">Add</span>
                                </span>
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
