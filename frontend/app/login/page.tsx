import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoginButton from "@/components/auth/login-button";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-[100px]" />
                <div className="absolute -right-[10%] -bottom-[10%] h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[100px]" />
            </div>

            <Card className="z-10 w-full max-w-md border-white/10 bg-black/40 backdrop-blur-xl text-white">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Smart Bookmarks
                    </CardTitle>
                    <p className="text-sm text-gray-400 mt-2">
                        Organize work & life with AI-powered simplicity.
                    </p>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <LoginButton />
                    <p className="text-xs text-center text-gray-500 pt-4">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
