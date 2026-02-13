"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash2, Globe, ExternalLink, MoreHorizontal, Copy } from "lucide-react";
import { Card } from "@/components/ui/card";

type Bookmark = {
    id: string;
    title: string;
    url: string;
    created_at: string;
    user_id: string;
};

export default function BookmarkList({ initialBookmarks, userId }: { initialBookmarks: Bookmark[]; userId: string }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks || []);
    const supabase = createClient();

    // Optimistic UI updates
    useEffect(() => {
        setBookmarks(initialBookmarks);
    }, [initialBookmarks]);

    useEffect(() => {
        const channel = supabase
            .channel("realtime-bookmarks")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "bookmarks",
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    if (payload.eventType === "INSERT") {
                        setBookmarks((prev) => [payload.new as Bookmark, ...prev]);
                    } else if (payload.eventType === "DELETE") {
                        setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
                    } else if (payload.eventType === "UPDATE") {
                        setBookmarks((prev) =>
                            prev.map((b) => (b.id === payload.new.id ? (payload.new as Bookmark) : b))
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, userId]);

    const handleDelete = async (id: string) => {
        // Optimistic delete
        const backup = [...bookmarks];
        setBookmarks((prev) => prev.filter((b) => b.id !== id));

        const { error } = await supabase.from("bookmarks").delete().eq("id", id);

        if (error) {
            // Revert if failed
            setBookmarks(backup);
            console.error("Failed to delete:", error);
        }
    };

    const getFaviconUrl = (url: string) => {
        try {
            const domain = new URL(url).hostname;
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        } catch {
            return null;
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    if (bookmarks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 mb-4">
                    <Globe className="h-6 w-6 text-zinc-500" />
                </div>
                <h3 className="text-lg font-medium text-zinc-200">No bookmarks yet</h3>
                <p className="text-sm text-zinc-500 mt-2 max-w-sm">
                    Add your first bookmark to get started building your collection.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {bookmarks.map((bookmark) => {
                const favicon = getFaviconUrl(bookmark.url);

                return (
                    <Card
                        key={bookmark.id}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/5 bg-zinc-900/40 p-5 transition-all duration-300 hover:bg-zinc-900/80 hover:border-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/5 backdrop-blur-sm"
                    >
                        <div className="space-y-3">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800/50 border border-white/5 text-zinc-400 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-colors">
                                    {favicon ? (
                                        <img
                                            src={favicon}
                                            alt=""
                                            className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                            }}
                                        />
                                    ) : null}
                                    <Globe className={`h-5 w-5 ${favicon ? 'hidden' : ''}`} />
                                </div>

                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
                                        onClick={() => copyToClipboard(bookmark.url)}
                                        title="Copy URL"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(bookmark.id)}
                                        className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                        title="Delete Bookmark"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium text-zinc-200 group-hover:text-white transition-colors truncate">
                                    {bookmark.title}
                                </h3>
                                <a
                                    href={bookmark.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500 group-hover:text-indigo-400 transition-colors truncate"
                                >
                                    <span className="truncate">{new URL(bookmark.url).hostname}</span>
                                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-0.5" />
                                </a>
                            </div>
                        </div>

                        {/* Decorative bottom gradient highlight */}
                        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500/0 to-transparent group-hover:via-indigo-500/50 transition-all duration-500" />
                    </Card>
                );
            })}
        </div>
    );
}
