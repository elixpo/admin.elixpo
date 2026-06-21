"use client";

/**
 * Shared presentational kit — glass cards, stat tiles, status chips, page
 * headers, and the section-error state. Matches accounts.elixpo's admin styling.
 * Client components so they sit under the dashboard ThemeProvider.
 */

import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import Link from "next/link";
import type React from "react";

const GLASS = {
    background:
        "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "16px",
};

export function PageHeader({
    title,
    subtitle,
    action,
}: {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
                mb: 3,
            }}
        >
            <Box>
                <Typography
                    sx={{
                        fontWeight: 800,
                        fontSize: "1.6rem",
                        color: "#f5f5f4",
                        letterSpacing: "-0.02em",
                    }}
                >
                    {title}
                </Typography>
                {subtitle && (
                    <Typography
                        sx={{
                            color: "rgba(245,245,244,0.6)",
                            fontSize: "0.9rem",
                            mt: 0.5,
                        }}
                    >
                        {subtitle}
                    </Typography>
                )}
            </Box>
            {action}
        </Box>
    );
}

export function Panel({
    title,
    action,
    children,
    accent = "#9b7bf7",
}: {
    title?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    accent?: string;
}) {
    return (
        <Card sx={{ ...GLASS, height: "100%", backgroundImage: "none" }}>
            <CardContent sx={{ p: 2.5 }}>
                {title && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 2,
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 600,
                                color: "#fff",
                                fontSize: "1rem",
                            }}
                        >
                            {title}
                        </Typography>
                        {action}
                    </Box>
                )}
                <Box sx={{ "--accent": accent } as React.CSSProperties}>
                    {children}
                </Box>
            </CardContent>
        </Card>
    );
}

export function StatCard({
    icon: Icon,
    label,
    value,
    sub,
    color = "#9b7bf7",
    href,
}: {
    icon?: React.ElementType;
    label: string;
    value: string | number;
    sub?: string;
    color?: string;
    href?: string;
}) {
    const card = (
        <Card
            sx={{
                ...GLASS,
                backgroundImage: "none",
                height: "100%",
                transition: "all 0.3s ease",
                cursor: href ? "pointer" : "default",
                "&:hover": href
                    ? {
                          borderColor: color,
                          boxShadow: `0 0 20px ${color}40`,
                          transform: "translateY(-2px)",
                      }
                    : undefined,
            }}
        >
            <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                    {Icon && (
                        <Box
                            sx={{
                                p: 1.25,
                                borderRadius: "8px",
                                bgcolor: `${color}20`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mr: 1.5,
                            }}
                        >
                            <Icon sx={{ color, fontSize: "1.4rem" }} />
                        </Box>
                    )}
                    <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                        {label}
                    </Typography>
                </Box>
                <Typography
                    sx={{
                        fontWeight: 700,
                        color: "#fff",
                        fontSize: "1.8rem",
                        lineHeight: 1.1,
                    }}
                >
                    {value}
                </Typography>
                {sub && (
                    <Typography
                        variant="caption"
                        sx={{
                            color: "rgba(255,255,255,0.45)",
                            fontSize: "0.75rem",
                        }}
                    >
                        {sub}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
    return href ? (
        <Link
            href={href}
            style={{ textDecoration: "none", display: "block", height: "100%" }}
        >
            {card}
        </Link>
    ) : (
        card
    );
}

const STATUS_COLORS: Record<
    string,
    { color: string; bg: string; border: string }
> = {
    success: {
        color: "#4ade80",
        bg: "rgba(34,197,94,0.12)",
        border: "rgba(34,197,94,0.3)",
    },
    warning: {
        color: "#fbbf24",
        bg: "rgba(251,191,36,0.12)",
        border: "rgba(251,191,36,0.3)",
    },
    error: {
        color: "#f87171",
        bg: "rgba(239,68,68,0.12)",
        border: "rgba(239,68,68,0.3)",
    },
    info: {
        color: "#818cf8",
        bg: "rgba(88,101,242,0.15)",
        border: "rgba(88,101,242,0.3)",
    },
    neutral: {
        color: "#d1d5db",
        bg: "rgba(156,163,175,0.1)",
        border: "rgba(156,163,175,0.2)",
    },
};

export function StatusChip({
    label,
    tone = "neutral",
}: {
    label: string;
    tone?: keyof typeof STATUS_COLORS;
}) {
    const c = STATUS_COLORS[tone];
    return (
        <Chip
            label={label}
            size="small"
            sx={{
                height: 22,
                fontSize: "0.7rem",
                fontWeight: 600,
                color: c.color,
                bgcolor: c.bg,
                border: `1px solid ${c.border}`,
            }}
        />
    );
}

export function SectionError({ message }: { message: string }) {
    return (
        <Box
            sx={{
                p: 2,
                borderRadius: "12px",
                bgcolor: "rgba(251,191,36,0.08)",
                border: "1px solid rgba(251,191,36,0.25)",
                color: "#fbbf24",
                fontSize: "0.82rem",
            }}
        >
            {message}
        </Box>
    );
}

export function Empty({ message }: { message: string }) {
    return (
        <Typography
            sx={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "0.85rem",
                py: 2,
                textAlign: "center",
            }}
        >
            {message}
        </Typography>
    );
}

export function fmt(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
    return String(n);
}

export function fmtBytes(n: number): string {
    if (n >= 1 << 30) return `${(n / (1 << 30)).toFixed(1)} GB`;
    if (n >= 1 << 20) return `${(n / (1 << 20)).toFixed(1)} MB`;
    if (n >= 1 << 10) return `${(n / (1 << 10)).toFixed(1)} KB`;
    return `${n} B`;
}
