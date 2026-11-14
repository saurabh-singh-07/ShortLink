
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";


export default function GoogleCallback() {
    const { setAuth} = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;

        async function exchangeCode() {
            const code = new URLSearchParams(
                window.location.search
            ).get("code");

            if (!code) {
                navigate("/login?error=google_oauth_failed", {
                    replace: true,
                });
                return;
            }

            try {
                const response = await fetch(
                    import.meta.env.VITE_GOOGLE_EXCHANGE_URL,
                    {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ code }),
                    }
                );

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error("Google login failed");
                }

                if (cancelled) return;
                setAuth(data.accessToken, data.user);
                window.history.replaceState(
                    {},
                    document.title,
                    window.location.pathname
                );
                toast.success("login successufull...")
                navigate("/", { replace: true });
            } catch {
                if (!cancelled) {
                    navigate("/login?error=google_oauth_failed", {
                        replace: true,
                    });
                }
                toast.error("something wrong...")
            }
        }

        exchangeCode();

        return () => {
            cancelled = true;
        };
    }, [navigate]);

    return <p>Signing you in with Google...</p>;
}
