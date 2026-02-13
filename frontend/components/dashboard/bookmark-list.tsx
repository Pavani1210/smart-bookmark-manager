"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash2, Globe, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

    useEffect(() => {
        setBookmarks(initialBookmarks);
    }, [initialBookmarks]);

    useEffect(() => {
        const channel = supabase
            .channel("realtime bookmarks")
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
    }, [supabase]);

    const handleDelete = async (id: string) => {
        await supabase.from("bookmarks").delete().eq("id", id);
        // Realtime subscription will handle the UI update
        // But for instant feedback we can also update local state optimistically
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
    };

    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p>No bookmarks yet. Add one above!</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bookmark) => (
                <Card
                    key={bookmark.id}
                    className="group relative overflow-hidden bg-white/5 border-white/10 hover:border-indigo-500/50 transition-all hover:bg-white/10 backdrop-blur-sm"
                >
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400">
                                        <Globe className="h-4 w-4" />
                                    </div>
                                    <h3 className="font-semibold text-lg text-white truncate pr-2">
                                        {bookmark.title}
                                    </h3>
                                </div>
                                <a
                                    href={bookmark.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm text-gray-400 hover:text-indigo-400 flex items-center gap-1 transition-colors truncate block max-w-full"
                                >
                                    {bookmark.url}
                                    <ExternalLink className="h-3 w-3 inline" />
                                </a>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(bookmark.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-500/20"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
