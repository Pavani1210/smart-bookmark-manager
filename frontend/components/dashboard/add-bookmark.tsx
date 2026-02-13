"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function AddBookmark() {
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
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
                await supabase.from("bookmarks").insert({
                    title,
                    url,
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
        }
    };

    return (
        <Card className="mb-8 border-white/5 bg-white/5 backdrop-blur-md">
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
                    <Input
                        placeholder="Bookmark Title (e.g., My Portfolio)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-white/5 border-white/10"
                        required
                    />
                    <Input
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="bg-white/5 border-white/10"
                        required
                        type="url"
                    />
                    <Button type="submit" disabled={loading} className="whitespace-nowrap bg-indigo-600 hover:bg-indigo-500 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Add
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
