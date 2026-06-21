"use client";

import { C, StatusBar } from "@/components/ui";
import { fmt } from "@/lib/format";
import { Box, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: { mode: "dark" },
    typography: { fontFamily: "var(--font-geist-sans), Arial, sans-serif" },
});

export type Health = "operational" | "degraded" | "outage" | "idle";

export interface ProductStatus {
    label: string;
    domain?: string;
    total: number;
    availability: number; // %
    health: Health;
    status: { label: string; count: number }[];
}

const HEALTH: Record<Health, { color: string; label: string }> = {
    operational: { color: "#4ade80", label: "Operational" },
    degraded: { color: "#fbbf24", label: "Degraded" },
    outage: { color: "#f87171", label: "Outage" },
    idle: { color: "#7c8493", label: "No traffic" },
};

export default function StatusView({
    products,
    fetchedAt,
}: { products: ProductStatus[]; fetchedAt: number }) {
    const worst: Health = products.some((p) => p.health === "outage")
        ? "outage"
        : products.some((p) => p.health === "degraded")
          ? "degraded"
          : "operational";
    const banner =
        worst === "operational"
            ? "All systems operational"
            : worst === "degraded"
              ? "Some systems degraded"
              : "Active incident";
    const bannerColor = HEALTH[worst].color;

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    minHeight: "100dvh",
                    background:
                        "linear-gradient(180deg,#0b0d12 0%,#11151c 50%,#0b0d12 100%)",
                    color: C.text,
                }}
            >
                <Box
                    sx={{
                        maxWidth: 900,
                        mx: "auto",
                        px: 2,
                        py: { xs: 4, md: 7 },
                    }}
                >
                    {/* header */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            mb: 4,
                        }}
                    >
                        <Box
                            component="img"
                            src="/icon.png"
                            alt="Elixpo"
                            sx={{ width: 34, height: 34, borderRadius: "8px" }}
                        />
                        <Box>
                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    fontSize: "1.3rem",
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                Elixpo Status
                            </Typography>
                            <Typography
                                sx={{ color: C.textMuted, fontSize: "0.78rem" }}
                            >
                                Live health of every Elixpo service
                            </Typography>
                        </Box>
                    </Box>

                    {/* overall banner */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            p: 2.25,
                            mb: 3,
                            borderRadius: "14px",
                            bgcolor: `${bannerColor}14`,
                            border: `1px solid ${bannerColor}55`,
                        }}
                    >
                        <Box
                            sx={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                bgcolor: bannerColor,
                                boxShadow: `0 0 12px ${bannerColor}`,
                            }}
                        />
                        <Typography
                            sx={{
                                fontWeight: 700,
                                fontSize: "1.1rem",
                                color: bannerColor,
                            }}
                        >
                            {banner}
                        </Typography>
                        <Typography
                            sx={{
                                ml: "auto",
                                color: C.textMuted,
                                fontSize: "0.74rem",
                            }}
                        >
                            updated {new Date(fetchedAt).toLocaleTimeString()}
                        </Typography>
                    </Box>

                    {/* per-product cards */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.25,
                        }}
                    >
                        {products.map((p) => {
                            const h = HEALTH[p.health];
                            return (
                                <Box
                                    key={p.label}
                                    sx={{
                                        p: 2,
                                        borderRadius: "12px",
                                        bgcolor: "rgba(255,255,255,0.03)",
                                        border: `1px solid ${C.border}`,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1.5,
                                            mb: 1.25,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 9,
                                                height: 9,
                                                borderRadius: "50%",
                                                bgcolor: h.color,
                                                boxShadow: `0 0 8px ${h.color}`,
                                            }}
                                        />
                                        <Box>
                                            <Typography
                                                sx={{
                                                    fontWeight: 700,
                                                    fontSize: "0.95rem",
                                                }}
                                            >
                                                {p.label}
                                            </Typography>
                                            {p.domain && (
                                                <Box
                                                    component="a"
                                                    href={`https://${p.domain}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    sx={{
                                                        color: C.textMuted,
                                                        fontSize: "0.74rem",
                                                        textDecoration: "none",
                                                        "&:hover": {
                                                            color: C.accentLight,
                                                        },
                                                    }}
                                                >
                                                    {p.domain}
                                                </Box>
                                            )}
                                        </Box>
                                        <Box
                                            sx={{
                                                ml: "auto",
                                                textAlign: "right",
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: h.color,
                                                    fontWeight: 700,
                                                    fontSize: "0.82rem",
                                                }}
                                            >
                                                {h.label}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    color: C.textMuted,
                                                    fontSize: "0.72rem",
                                                }}
                                            >
                                                {p.total > 0
                                                    ? `${p.availability.toFixed(2)}% · ${fmt(p.total)} req / 24h`
                                                    : "no traffic in 24h"}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    {p.total > 0 && (
                                        <StatusBar status={p.status} />
                                    )}
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
