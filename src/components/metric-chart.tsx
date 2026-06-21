"use client";

/**
 * Dependency-free time-series chart (SVG area + axis). Matches the accounts.elixpo
 * aesthetic (purple accent, soft glass). Renders one or more series from the
 * normalized MetricPoint[] produced by src/lib/metrics.ts.
 */

import { Box, Typography } from "@mui/material";
import { useMemo } from "react";

export interface ChartSeries {
    key: string;
    label: string;
    color?: string;
}

export interface MetricPoint {
    ts: string;
    [k: string]: number | string;
}

const PALETTE = ["#9b7bf7", "#86efac", "#fbbf24", "#5fb6ff", "#ff6a8a"];

export default function MetricChart({
    points,
    series,
    height = 180,
    unit,
}: {
    points: MetricPoint[];
    series: ChartSeries[];
    height?: number;
    unit?: string;
}) {
    const W = 600;
    const H = height;
    const PAD = { top: 12, right: 8, bottom: 20, left: 8 };

    const { paths, max, lastLabels } = useMemo(() => {
        const innerW = W - PAD.left - PAD.right;
        const innerH = H - PAD.top - PAD.bottom;
        const n = points.length;
        let max = 0;
        for (const p of points) for (const s of series) max = Math.max(max, Number(p[s.key]) || 0);
        if (max <= 0) max = 1;

        const x = (i: number) => PAD.left + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
        const y = (v: number) => PAD.top + innerH - (v / max) * innerH;

        const paths = series.map((s, si) => {
            const color = s.color || PALETTE[si % PALETTE.length];
            let line = "";
            points.forEach((p, i) => {
                const px = x(i);
                const py = y(Number(p[s.key]) || 0);
                line += `${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)} `;
            });
            const area =
                n > 0
                    ? `${line}L${x(n - 1).toFixed(1)},${(PAD.top + innerH).toFixed(1)} L${x(0).toFixed(1)},${(PAD.top + innerH).toFixed(1)} Z`
                    : "";
            const total = points.reduce((a, p) => a + (Number(p[s.key]) || 0), 0);
            return { color, line, area, label: s.label, total };
        });

        const lastLabels =
            n > 0
                ? [
                      new Date(points[0].ts).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric" }),
                      new Date(points[n - 1].ts).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric" }),
                  ]
                : ["", ""];

        return { paths, max, lastLabels };
    }, [points, series, H]);

    if (!points.length) {
        return (
            <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", py: 4, textAlign: "center" }}>
                No data in this window.
            </Typography>
        );
    }

    return (
        <Box>
            <Box sx={{ display: "flex", gap: 2, mb: 1, flexWrap: "wrap" }}>
                {paths.map((p) => (
                    <Box key={p.label} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: "2px", bgcolor: p.color }} />
                        <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>
                            {p.label}
                            <Box component="span" sx={{ color: "#fff", fontWeight: 600, ml: 0.5 }}>
                                {p.total >= 1000 ? `${(p.total / 1000).toFixed(1)}k` : p.total.toLocaleString()}
                                {unit ? ` ${unit}` : ""}
                            </Box>
                        </Typography>
                    </Box>
                ))}
            </Box>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" role="img" aria-label="metric chart">
                <defs>
                    {paths.map((p, i) => (
                        <linearGradient key={i} id={`grad-${i}-${p.color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={p.color} stopOpacity="0.35" />
                            <stop offset="100%" stopColor={p.color} stopOpacity="0" />
                        </linearGradient>
                    ))}
                </defs>
                {paths.map((p, i) => (
                    <g key={i}>
                        <path d={p.area} fill={`url(#grad-${i}-${p.color.replace("#", "")})`} />
                        <path d={p.line} fill="none" stroke={p.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                    </g>
                ))}
            </svg>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                <Typography sx={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)" }}>{lastLabels[0]}</Typography>
                <Typography sx={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)" }}>peak {max >= 1000 ? `${(max / 1000).toFixed(1)}k` : max}</Typography>
                <Typography sx={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)" }}>{lastLabels[1]}</Typography>
            </Box>
        </Box>
    );
}
