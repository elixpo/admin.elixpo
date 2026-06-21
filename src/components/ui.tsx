"use client";

/**
 * Professional analytics UI kit — flat surfaces, thin borders, compact density,
 * blue accent. Modeled on Cloudflare's own dashboards (KPI tiles with
 * sparklines + deltas, bordered panels, top-N bar tables).
 */

import { ArrowDownward, ArrowUpward, MoreHoriz } from "@mui/icons-material";
import { Box, Card, Chip, Typography } from "@mui/material";
import Link from "next/link";
import type React from "react";

export const C = {
    bg: "#0a0e14",
    bgElev: "#0d1117",
    panel: "#11161f",
    panelHover: "#141b26",
    border: "#1e2530",
    borderLight: "#283040",
    text: "#e6e9ef",
    textDim: "#9aa4b2",
    textMuted: "#67707e",
    accent: "#4593ff",
    accentDim: "rgba(69,147,255,0.14)",
    success: "#22c55e",
    error: "#ef4444",
    warn: "#f59e0b",
};

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
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1.5, mb: 2.5 }}>
            <Box>
                <Typography sx={{ fontWeight: 700, fontSize: "1.25rem", color: C.text, letterSpacing: "-0.01em" }}>
                    {title}
                </Typography>
                {subtitle && <Typography sx={{ color: C.textMuted, fontSize: "0.8rem", mt: 0.25 }}>{subtitle}</Typography>}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                    label="Last 24 hours"
                    size="small"
                    sx={{ height: 26, fontSize: "0.74rem", color: C.textDim, bgcolor: C.panel, border: `1px solid ${C.border}`, borderRadius: "6px" }}
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
        <Card sx={{ bgcolor: C.panel, border: `1px solid ${C.border}`, borderRadius: "8px", height: "100%" }}>
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
                    <Typography sx={{ fontWeight: 600, color: C.text, fontSize: "0.82rem" }}>{title}</Typography>
                    {action ?? <MoreHoriz sx={{ fontSize: "1.05rem", color: C.textMuted }} />}
                </Box>
            )}
            <Box sx={{ p: dense ? 0 : 1.75 }}>{children}</Box>
        </Card>
    );
}

/* ------------------------------------------------------------------- sparkline */

export function Sparkline({ values, color = C.accent, height = 32 }: { values: number[]; color?: string; height?: number }) {
    if (!values.length) return <Box sx={{ height }} />;
    const W = 120;
    const H = height;
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const span = max - min || 1;
    const step = values.length > 1 ? W / (values.length - 1) : W;
    const pts = values.map((v, i) => `${(i * step).toFixed(1)},${(H - ((v - min) / span) * H).toFixed(1)}`);
    const line = `M${pts.join(" L")}`;
    const area = `${line} L${W},${H} L0,${H} Z`;
    const id = `sl-${color.replace(/[^a-z0-9]/gi, "")}`;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" aria-hidden>
            <defs>
                <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={area} fill={`url(#${id})`} />
            <path d={line} fill="none" stroke={color} strokeWidth="1.5" />
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
                bgcolor: C.panel,
                border: `1px solid ${C.border}`,
                borderRadius: "8px",
                p: 1.5,
                height: "100%",
                transition: "border-color 0.15s",
                "&:hover": { borderColor: href ? C.borderLight : C.border },
            }}
        >
            <Typography sx={{ color: C.textMuted, fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {label}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mt: 0.5 }}>
                <Typography sx={{ fontWeight: 700, color: C.text, fontSize: "1.5rem", lineHeight: 1.1 }}>{value}</Typography>
                {delta != null && Number.isFinite(delta) && (
                    <Box sx={{ display: "flex", alignItems: "center", color: up ? C.success : C.error, fontSize: "0.74rem", fontWeight: 600 }}>
                        {up ? <ArrowUpward sx={{ fontSize: "0.85rem" }} /> : <ArrowDownward sx={{ fontSize: "0.85rem" }} />}
                        {Math.abs(delta).toFixed(1)}%
                    </Box>
                )}
            </Box>
            {sub && <Typography sx={{ color: C.textMuted, fontSize: "0.7rem", mt: 0.25 }}>{sub}</Typography>}
            {spark && spark.length > 0 && (
                <Box sx={{ mt: 1 }}>
                    <Sparkline values={spark} color={color} />
                </Box>
            )}
        </Card>
    );
    return href ? (
        <Link href={href} style={{ textDecoration: "none", display: "block", height: "100%" }}>
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
    items: { label: string; value: number; href?: string; chip?: React.ReactNode }[];
    color?: string;
    valueFmt?: (n: number) => string;
}) {
    const max = Math.max(...items.map((i) => i.value), 1);
    return (
        <Box>
            {items.map((it) => {
                const row = (
                    <Box sx={{ position: "relative", py: 0.85, px: 1, borderBottom: `1px solid ${C.border}`, "&:hover": it.href ? { bgcolor: C.panelHover } : undefined }}>
                        <Box
                            sx={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: `${(it.value / max) * 100}%`,
                                bgcolor: color,
                                opacity: 0.1,
                                borderRight: `2px solid ${color}`,
                            }}
                        />
                        <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                            <Typography sx={{ color: C.text, fontSize: "0.82rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "70%" }}>
                                {it.label}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                {it.chip}
                                <Typography sx={{ color: C.textDim, fontSize: "0.8rem", fontVariantNumeric: "tabular-nums" }}>{valueFmt(it.value)}</Typography>
                            </Box>
                        </Box>
                    </Box>
                );
                return it.href ? (
                    <Link key={it.label} href={it.href} style={{ textDecoration: "none" }}>
                        {row}
                    </Link>
                ) : (
                    <Box key={it.label}>{row}</Box>
                );
            })}
        </Box>
    );
}

/* ------------------------------------------------------------- misc primitives */

const STATUS: Record<string, { color: string; bg: string }> = {
    success: { color: C.success, bg: "rgba(34,197,94,0.12)" },
    warning: { color: C.warn, bg: "rgba(245,158,11,0.12)" },
    error: { color: C.error, bg: "rgba(239,68,68,0.12)" },
    info: { color: C.accent, bg: C.accentDim },
    neutral: { color: C.textDim, bg: "rgba(255,255,255,0.05)" },
};

export function StatusChip({ label, tone = "neutral" }: { label: string; tone?: keyof typeof STATUS }) {
    const s = STATUS[tone];
    return (
        <Chip
            label={label}
            size="small"
            sx={{ height: 20, fontSize: "0.68rem", fontWeight: 600, color: s.color, bgcolor: s.bg, border: `1px solid ${s.color}33`, borderRadius: "5px" }}
        />
    );
}

export function SectionError({ message }: { message: string }) {
    return (
        <Box sx={{ p: 1.5, borderRadius: "6px", bgcolor: "rgba(245,158,11,0.07)", border: `1px solid rgba(245,158,11,0.25)`, color: C.warn, fontSize: "0.78rem" }}>
            {message}
        </Box>
    );
}

export function Empty({ message }: { message: string }) {
    return <Typography sx={{ color: C.textMuted, fontSize: "0.82rem", py: 2, textAlign: "center" }}>{message}</Typography>;
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

/** Period-over-period trend %: second half vs first half of the series. */
export function trend(values: number[]): number | null {
    if (values.length < 4) return null;
    const mid = Math.floor(values.length / 2);
    const a = values.slice(0, mid).reduce((s, v) => s + v, 0);
    const b = values.slice(mid).reduce((s, v) => s + v, 0);
    if (a === 0) return b > 0 ? 100 : 0;
    return ((b - a) / a) * 100;
}
