import { LogOut } from "lucide-react";
import { useAuth } from "../lib/auth-context";

export default function Profile() {
    const { logout } = useAuth();
    return(
        <div className="px-5 py-4 flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Profile</h1>
            <button onClick={logout}
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <LogOut className="h-4 w-4" /> Log out
            </button>
        </div>
    )
}
