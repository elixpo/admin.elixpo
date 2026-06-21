/* Static, descriptive landing content rendered below the pixel hero. Inline
 * styles (no MUI/theme provider) so it renders standalone on the public page. */

import type { CSSProperties } from "react";

const FEATURES: { title: string; body: string; accent: string }[] = [
    {
        title: "Auto-discovery",
        body: "Every Pages project, Worker, D1, KV, Queue, Durable Object, Workflow and zone is enumerated live from the Cloudflare API. Spin up a new resource and it appears here on the next refresh — nothing is hardcoded.",
        accent: "#9b7bf7",
    },
    {
        title: "Full observability",
        body: "The same charts the Cloudflare dashboard gives you — traffic, DNS, errors, Workers, D1, KV, Queues, Durable Objects — unified in one place, per resource and account-wide.",
        accent: "#86efac",
    },
    {
        title: "Query console",
        body: "Run SQL straight against any D1 database from the browser, with table shortcuts and a results grid. Read-only today; guarded writes and KV/queue actions are next.",
        accent: "#fbbf24",
    },
    {
        title: "Admins only",
        body: "Sign in with one Elixpo ID through Accounts SSO. Only accounts flagged as admin get in — everyone else is turned away at the door. Every write action is audit-logged.",
        accent: "#5fb6ff",
    },
];

const COVERAGE = [
    "Pages",
    "Workers",
    "D1",
    "KV",
    "Queues",
    "Durable Objects",
    "Workflows",
    "Containers",
    "Zones / Traffic",
    "DNS",
    "Gateway",
    "Logs",
];

const wrap: CSSProperties = {
    position: "relative",
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 1.5rem",
};

const eyebrow: CSSProperties = {
    display: "inline-block",
    padding: "5px 12px",
    borderRadius: 999,
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#b69aff",
    background: "rgba(155,123,247,0.1)",
    border: "1px solid rgba(155,123,247,0.25)",
};

const h2: CSSProperties = {
    fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    margin: "1rem 0 0.6rem",
    color: "#f5f5f4",
};

const sub: CSSProperties = {
    color: "rgba(245,245,244,0.6)",
    fontSize: "1rem",
    lineHeight: 1.7,
    maxWidth: 620,
};

const card: CSSProperties = {
    background:
        "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: "1.6rem",
};

export default function LandingSections() {
    return (
        <div style={{ position: "relative", zIndex: 1, paddingBottom: "6rem" }}>
            {/* Features */}
            <section style={{ ...wrap, paddingTop: "2rem" }}>
                <span style={eyebrow}>One control plane</span>
                <h2 style={h2}>The whole Cloudflare account, in one window.</h2>
                <p style={sub}>
                    Elixpo Admin is the internal control plane for everything
                    the suite runs on Cloudflare. No tab-juggling across
                    dashboards — discovery, metrics and a query console, all
                    gated to admins.
                </p>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: "1rem",
                        marginTop: "2.2rem",
                    }}
                >
                    {FEATURES.map((f) => (
                        <div key={f.title} style={card}>
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 10,
                                    marginBottom: "1rem",
                                    background: `${f.accent}22`,
                                    border: `1px solid ${f.accent}55`,
                                }}
                            />
                            <h3
                                style={{
                                    fontSize: "1.1rem",
                                    fontWeight: 700,
                                    color: "#f5f5f4",
                                    margin: "0 0 0.5rem",
                                }}
                            >
                                {f.title}
                            </h3>
                            <p
                                style={{
                                    fontSize: "0.88rem",
                                    lineHeight: 1.6,
                                    color: "rgba(245,245,244,0.62)",
                                    margin: 0,
                                }}
                            >
                                {f.body}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Coverage */}
            <section style={{ ...wrap, marginTop: "4.5rem" }}>
                <span style={eyebrow}>Coverage</span>
                <h2 style={h2}>Every primitive you ship on.</h2>
                <p style={sub}>
                    If it lives in the Elixpo Cloudflare account, it shows up
                    here automatically.
                </p>
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.6rem",
                        marginTop: "1.8rem",
                    }}
                >
                    {COVERAGE.map((c) => (
                        <span
                            key={c}
                            style={{
                                padding: "8px 16px",
                                borderRadius: 999,
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                color: "rgba(245,245,244,0.85)",
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.1)",
                            }}
                        >
                            {c}
                        </span>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section
                style={{ ...wrap, marginTop: "4.5rem", textAlign: "center" }}
            >
                <div
                    style={{
                        ...card,
                        padding: "3rem 2rem",
                        background:
                            "radial-gradient(circle at 50% 0%, rgba(155,123,247,0.14) 0%, rgba(255,255,255,0.02) 60%)",
                    }}
                >
                    <h2 style={{ ...h2, margin: "0 0 0.6rem" }}>
                        Ready when you are.
                    </h2>
                    <p style={{ ...sub, margin: "0 auto 1.8rem" }}>
                        Sign in with your Elixpo ID. Admins land straight on the
                        live overview.
                    </p>
                    <a
                        href="/api/auth/login"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            height: 50,
                            padding: "0 32px",
                            borderRadius: 14,
                            fontSize: "0.95rem",
                            fontWeight: 700,
                            color: "#fff",
                            textDecoration: "none",
                            background:
                                "linear-gradient(180deg, #a98cff 0%, #7c5cff 100%)",
                            boxShadow:
                                "inset 0 1px 1px rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.2), 0 14px 30px rgba(124,92,255,0.35)",
                        }}
                    >
                        Sign in with Elixpo
                    </a>
                </div>
                <p
                    style={{
                        color: "rgba(245,245,244,0.35)",
                        fontSize: "0.8rem",
                        marginTop: "2rem",
                    }}
                >
                    Elixpo Admin · internal control plane · admins only
                </p>
            </section>
        </div>
    );
}
