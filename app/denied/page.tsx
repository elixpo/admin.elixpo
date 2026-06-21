import Link from "next/link";

export const runtime = "edge";

const REASONS: Record<string, string> = {
    not_admin:
        "Your Elixpo account isn't marked as an admin. Ask an existing admin to grant you access.",
    bad_state:
        "The sign-in request expired or was tampered with. Please try again.",
    exchange_failed:
        "We couldn't complete sign-in with Elixpo Accounts. Please try again.",
    no_profile: "We couldn't read your Elixpo profile. Please try again.",
    access_denied: "You declined the sign-in request.",
};

export default async function Denied({
    searchParams,
}: {
    searchParams: Promise<{ reason?: string }>;
}) {
    const { reason } = await searchParams;
    const message =
        (reason && REASONS[reason]) ||
        "You don't have access to the Elixpo Admin console.";

    return (
        <main
            style={{
                minHeight: "100dvh",
                background:
                    "linear-gradient(180deg, #0b0d12 0%, #11151c 50%, #0b0d12 100%)",
                color: "#f5f5f4",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "2rem",
                gap: "1.2rem",
            }}
        >
            <div
                style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#f87171",
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: 999,
                    padding: "6px 14px",
                }}
            >
                Access denied
            </div>
            <h1
                style={{
                    fontSize: "clamp(2rem, 6vw, 3.2rem)",
                    fontWeight: 800,
                    margin: 0,
                }}
            >
                Admins only
            </h1>
            <p
                style={{
                    maxWidth: 460,
                    color: "rgba(245,245,244,0.72)",
                    lineHeight: 1.6,
                    margin: 0,
                }}
            >
                {message}
            </p>
            <div
                style={{
                    display: "flex",
                    gap: 12,
                    marginTop: "0.5rem",
                    flexWrap: "wrap",
                    justifyContent: "center",
                }}
            >
                <a
                    href="/api/auth/login"
                    style={{
                        height: 46,
                        padding: "0 26px",
                        display: "inline-flex",
                        alignItems: "center",
                        borderRadius: 12,
                        fontWeight: 700,
                        color: "#fff",
                        textDecoration: "none",
                        background:
                            "linear-gradient(180deg, #a98cff 0%, #7c5cff 100%)",
                    }}
                >
                    Try again
                </a>
                <Link
                    href="/"
                    style={{
                        height: 46,
                        padding: "0 26px",
                        display: "inline-flex",
                        alignItems: "center",
                        borderRadius: 12,
                        fontWeight: 700,
                        color: "#f5f5f4",
                        textDecoration: "none",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.14)",
                    }}
                >
                    Home
                </Link>
            </div>
        </main>
    );
}
