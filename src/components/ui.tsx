"use client";

/**
 * UI kit — aurora purple scheme over a glass-on-aurora surface, kept dense and
 * commercial (KPI tiles with sparklines + deltas, bordered glass panels, top-N
 * bar tables, donuts). Single accent color (#9b7bf7) across the whole app.
 */

import { ArrowDownward, ArrowUpward, MoreHoriz } from "@mui/icons-material";
import { Box, Card, Chip, Typography } from "@mui/material";
import Link from "next/link";
import type React from "react";

export const C = {
    bg: "#0b0d12",
    accent: "#9b7bf7",
    accentLight: "#b69aff",
    accentDeep: "#7c5cff",
    accentDim: "rgba(155,123,247,0.15)",
    panel: "rgba(18,21,32,0.55)",
    panelSolid: "#14172270",
    panelHover: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.09)",
    borderLight: "rgba(255,255,255,0.16)",
    text: "#f5f5f4",
    textDim: "#b6bcc8",
    textMuted: "#7c8493",
    success: "#4ade80",
    error: "#f87171",
    warn: "#fbbf24",
};

/** Purple-forward chart palette (single scheme). Error red reserved for errors. */
export const CHART = [
    "#9b7bf7",
    "#b69aff",
    "#7c5cff",
    "#c4b5fd",
    "#86efac",
    "#5fb6ff",
];

export const glass = {
    bgcolor: C.panel,
    backdropFilter: "blur(16px)",
    border: `1px solid ${C.border}`,
    borderRadius: "12px",
} as const;

/* ---------------------------------------------------------------- page header */

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
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1.5,
                mb: 2.5,
            }}
        >
            <Box>
                <Typography
                    sx={{
                        fontWeight: 800,
                        fontSize: "1.4rem",
                        color: C.text,
                        letterSpacing: "-0.02em",
                    }}
                >
                    {title}
                </Typography>
                {subtitle && (
                    <Typography
                        sx={{
                            color: C.textMuted,
                            fontSize: "0.82rem",
                            mt: 0.25,
                        }}
                    >
                        {subtitle}
                    </Typography>
                )}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                    label="Last 24 hours"
                    size="small"
                    sx={{
                        height: 28,
                        fontSize: "0.76rem",
                        color: C.accentLight,
                        bgcolor: C.accentDim,
                        border: `1px solid ${C.accent}44`,
                        borderRadius: "8px",
                    }}
                />
                {action}
            </Box>
        </Box>
    );
}

/* ---------------------------------------------------------------------- panel */

export function Panel({
    title,
    action,
    children,
    dense,
}: {
    title?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    dense?: boolean;
}) {
    return (
        <Card
            sx={{
                ...glass,
                height: "100%",
                boxShadow: "0 8px 32px rgba(0,0,0,0.30)",
            }}
        >
            {title && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 1.75,
                        py: 1.25,
                        borderBottom: `1px solid ${C.border}`,
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 600,
                            color: C.text,
                            fontSize: "0.85rem",
                        }}
                    >
                        {title}
                    </Typography>
                    {action ?? (
                        <MoreHoriz
                            sx={{ fontSize: "1.05rem", color: C.textMuted }}
                        />
                    )}
                </Box>
            )}
            <Box sx={{ p: dense ? 0 : 1.75 }}>{children}</Box>
        </Card>
    );
}

/* ------------------------------------------------------------------- sparkline */

export function Sparkline({
    values,
    color = C.accent,
    height = 34,
}: { values: number[]; color?: string; height?: number }) {
    if (!values.length) return <Box sx={{ height }} />;
    const W = 120;
    const H = height;
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const span = max - min || 1;
    const step = values.length > 1 ? W / (values.length - 1) : W;
    const pts = values.map(
        (v, i) =>
            `${(i * step).toFixed(1)},${(H - ((v - min) / span) * H).toFixed(1)}`,
    );
    const line = `M${pts.join(" L")}`;
    const area = `${line} L${W},${H} L0,${H} Z`;
    const id = `sl-${color.replace(/[^a-z0-9]/gi, "")}`;
    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            height={H}
            preserveAspectRatio="none"
            aria-hidden
        >
            <defs>
                <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={area} fill={`url(#${id})`} />
            <path d={line} fill="none" stroke={color} strokeWidth="1.6" />
        </svg>
    );
}

/* --------------------------------------------------------------------- KPI tile */

export function KpiTile({
    label,
    value,
    delta,
    spark,
    color = C.accent,
    href,
    sub,
}: {
    label: string;
    value: string | number;
    delta?: number | null;
    spark?: number[];
    color?: string;
    href?: string;
    sub?: string;
}) {
    const up = (delta ?? 0) >= 0;
    const tile = (
        <Card
            sx={{
                ...glass,
                p: 1.5,
                height: "100%",
                transition: "border-color 0.15s",
                "&:hover": { borderColor: href ? C.accent : C.border },
            }}
        >
            <Typography
                sx={{
                    color: C.textMuted,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                }}
            >
                {label}
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 1,
                    mt: 0.5,
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 800,
                        color: C.text,
                        fontSize: "1.5rem",
                        lineHeight: 1.1,
                    }}
                >
                    {value}
                </Typography>
                {delta != null && Number.isFinite(delta) && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            color: up ? C.success : C.error,
                            fontSize: "0.74rem",
                            fontWeight: 600,
                        }}
                    >
                        {up ? (
                            <ArrowUpward sx={{ fontSize: "0.85rem" }} />
                        ) : (
                            <ArrowDownward sx={{ fontSize: "0.85rem" }} />
                        )}
                        {Math.abs(delta).toFixed(1)}%
                    </Box>
                )}
            </Box>
            {sub && (
                <Typography
                    sx={{ color: C.textMuted, fontSize: "0.7rem", mt: 0.25 }}
                >
                    {sub}
                </Typography>
            )}
            {spark && spark.length > 0 && (
                <Box sx={{ mt: 1 }}>
                    <Sparkline values={spark} color={color} />
                </Box>
            )}
        </Card>
    );
    return href ? (
        <Link
            href={href}
            style={{ textDecoration: "none", display: "block", height: "100%" }}
        >
            {tile}
        </Link>
    ) : (
        tile
    );
}

/* ----------------------------------------------------------------- top-N table */

export function TopList({
    items,
    color = C.accent,
    valueFmt = (n: number) => n.toLocaleString(),
}: {
    items: {
        label: string;
        value: number;
        href?: string;
        chip?: React.ReactNode;
    }[];
    color?: string;
    valueFmt?: (n: number) => string;
}) {
    const max = Math.max(...items.map((i) => i.value), 1);
    if (!items.length) return <Empty message="No data." />;
    return (
        <Box>
            {items.map((it) => {
                const row = (
                    <Box
                        sx={{
                            position: "relative",
                            py: 0.8,
                            px: 1,
                            borderBottom: `1px solid ${C.border}`,
                            "&:hover": it.href
                                ? { bgcolor: C.panelHover }
                                : undefined,
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: `${(it.value / max) * 100}%`,
                                bgcolor: color,
                                opacity: 0.12,
                                borderRight: `2px solid ${color}`,
                            }}
                        />
                        <Box
                            sx={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1,
                            }}
                        >
                            <Typography
                                sx={{
                                    color: C.text,
                                    fontSize: "0.82rem",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "68%",
                                }}
                            >
                                {it.label}
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                {it.chip}
                                <Typography
                                    sx={{
                                        color: C.textDim,
                                        fontSize: "0.8rem",
                                        fontVariantNumeric: "tabular-nums",
                                    }}
                                >
                                    {valueFmt(it.value)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                );
                return it.href ? (
                    <Link
                        key={it.label}
                        href={it.href}
                        style={{ textDecoration: "none" }}
                    >
                        {row}
                    </Link>
                ) : (
                    <Box key={it.label}>{row}</Box>
                );
            })}
        </Box>
    );
}

/* -------------------------------------------------------------------- donut */

export function Donut({
    data,
    size = 150,
}: { data: { label: string; value: number }[]; size?: number }) {
    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    const r = size / 2 - 10;
    const cx = size / 2;
    const cy = size / 2;
    const circ = 2 * Math.PI * r;
    let offset = 0;
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
            }}
        >
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="14"
                />
                {data.map((d, i) => {
                    const frac = d.value / total;
                    const dash = frac * circ;
                    const seg = (
                        <circle
                            key={d.label}
                            cx={cx}
                            cy={cy}
                            r={r}
                            fill="none"
                            stroke={CHART[i % CHART.length]}
                            strokeWidth="14"
                            strokeDasharray={`${dash} ${circ - dash}`}
                            strokeDashoffset={-offset}
                            transform={`rotate(-90 ${cx} ${cy})`}
                        />
                    );
                    offset += dash;
                    return seg;
                })}
                <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={C.text}
                    fontSize="0.95rem"
                    fontWeight="700"
                >
                    {total >= 1000 ? `${(total / 1000).toFixed(1)}k` : total}
                </text>
            </svg>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                {data.map((d, i) => (
                    <Box
                        key={d.label}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.75,
                        }}
                    >
                        <Box
                            sx={{
                                width: 9,
                                height: 9,
                                borderRadius: "2px",
                                bgcolor: CHART[i % CHART.length],
                            }}
                        />
                        <Typography
                            sx={{ fontSize: "0.76rem", color: C.textDim }}
                        >
                            {d.label}{" "}
                            <Box
                                component="span"
                                sx={{ color: C.text, fontWeight: 600 }}
                            >
                                {((d.value / total) * 100).toFixed(0)}%
                            </Box>
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

/* ------------------------------------------------------------- misc primitives */

const STATUS: Record<string, { color: string; bg: string }> = {
    success: { color: C.success, bg: "rgba(74,222,128,0.12)" },
    warning: { color: C.warn, bg: "rgba(251,191,36,0.12)" },
    error: { color: C.error, bg: "rgba(248,113,113,0.12)" },
    info: { color: C.accentLight, bg: C.accentDim },
    neutral: { color: C.textDim, bg: "rgba(255,255,255,0.05)" },
};

export function StatusChip({
    label,
    tone = "neutral",
}: { label: string; tone?: keyof typeof STATUS }) {
    const s = STATUS[tone];
    return (
        <Chip
            label={label}
            size="small"
            sx={{
                height: 20,
                fontSize: "0.68rem",
                fontWeight: 600,
                color: s.color,
                bgcolor: s.bg,
                border: `1px solid ${s.color}33`,
                borderRadius: "6px",
            }}
        />
    );
}

export function SectionError({ message }: { message: string }) {
    return (
        <Box
            sx={{
                p: 1.5,
                borderRadius: "8px",
                bgcolor: "rgba(251,191,36,0.07)",
                border: "1px solid rgba(251,191,36,0.25)",
                color: C.warn,
                fontSize: "0.78rem",
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
                color: C.textMuted,
                fontSize: "0.82rem",
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
    return String(Math.round(n));
}

export function fmtBytes(n: number): string {
    if (n >= 1 << 30) return `${(n / (1 << 30)).toFixed(1)} GB`;
    if (n >= 1 << 20) return `${(n / (1 << 20)).toFixed(1)} MB`;
    if (n >= 1 << 10) return `${(n / (1 << 10)).toFixed(1)} KB`;
    return `${n} B`;
}

export function trend(values: number[]): number | null {
    if (values.length < 4) return null;
    const mid = Math.floor(values.length / 2);
    const a = values.slice(0, mid).reduce((s, v) => s + v, 0);
    const b = values.slice(mid).reduce((s, v) => s + v, 0);
    if (a === 0) return b > 0 ? 100 : 0;
    return ((b - a) / a) * 100;
}
