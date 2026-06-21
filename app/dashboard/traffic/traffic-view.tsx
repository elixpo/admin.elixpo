"use client";

import ExpandableGlobe from "@/components/expandable-globe";
import MetricChart from "@/components/metric-chart";
import {
    C,
    Donut,
    Empty,
    KpiTile,
    PageHeader,
    Panel,
    SectionError,
    StatusChip,
    TopList,
    fmt,
    fmtBytes,
    trend,
} from "@/components/ui";
import type { MetricSeries, ZoneBreakdown } from "@/lib/metrics";
import { Box, Typography } from "@mui/material";

export interface ZoneData {
    name: string;
    id: string;
    traffic: MetricSeries;
    breakdown: ZoneBreakdown;
}

const statusTone = (code: string): "success" | "info" | "warning" | "error" => {
    const n = Number(code);
    if (n >= 500) return "error";
    if (n >= 400) return "warning";
    if (n >= 300) return "info";
    return "success";
};

export default function TrafficView({ zones }: { zones: ZoneData[] }) {
    return (
        <Box>
            <PageHeader
                title="Traffic"
                subtitle="HTTP analytics across all zones · last 24 hours"
            />
            {zones.length === 0 && <Empty message="No zones found." />}
            {zones.map((z) => (
                <ZoneBlock key={z.id} z={z} />
            ))}
        </Box>
    );
}

function ZoneBlock({ z }: { z: ZoneData }) {
    const t = z.traffic;
    const b = z.breakdown;
    const reqSpark = t.points.map((p) => Number(p.requests) || 0);
    const bytSpark = t.points.map((p) => Number(p.bytes) || 0);
    const peak = Math.max(...reqSpark, 0);

    return (
        <Box sx={{ mb: 4 }}>
            <Typography
                sx={{
                    color: C.accentLight,
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    mb: 1.5,
                }}
            >
                {z.name}
            </Typography>

            {!t.available ? (
                <SectionError
                    message={`Zone analytics unavailable: ${t.error}`}
                />
            ) : (
                <>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(210px, 1fr))",
                            gap: 1.5,
                            mb: 1.5,
                        }}
                    >
                        <KpiTile
                            label="Total requests"
                            value={fmt(t.totals.requests || 0)}
                            delta={trend(reqSpark)}
                            spark={reqSpark}
                            color={C.accent}
                        />
                        <KpiTile
                            label="Bandwidth"
                            value={fmtBytes(t.totals.bytes || 0)}
                            spark={bytSpark}
                            color={C.accentLight}
                        />
                        <KpiTile
                            label="Peak / hr"
                            value={fmt(peak)}
                            color={C.accentDeep}
                        />
                        <KpiTile
                            label="Countries"
                            value={b.country.length}
                            sub="distinct in window"
                            color="#86efac"
                        />
                    </Box>

                    <Box sx={{ mb: 1.5 }}>
                        <Panel title="Requests over time">
                            <MetricChart
                                points={t.points}
                                series={[
                                    {
                                        key: "requests",
                                        label: "Requests",
                                        color: C.accent,
                                    },
                                    {
                                        key: "bytes",
                                        label: "Bytes",
                                        color: C.accentLight,
                                    },
                                ]}
                                height={220}
                            />
                        </Panel>
                    </Box>

                    {b.available && (
                        <>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        lg: "1.4fr 1fr 1fr",
                                    },
                                    gap: 1.5,
                                    mb: 1.5,
                                }}
                            >
                                <Panel title="Requests by country">
                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: {
                                                xs: "1fr",
                                                sm: "auto 1fr",
                                            },
                                            gap: 2,
                                            alignItems: "center",
                                        }}
                                    >
                                        <ExpandableGlobe
                                            country={b.country}
                                            size={300}
                                        />
                                        <TopList
                                            items={b.country
                                                .slice(0, 9)
                                                .map((c) => ({
                                                    label: c.label,
                                                    value: c.count,
                                                }))}
                                        />
                                    </Box>
                                </Panel>
                                <Panel title="Status codes">
                                    <TopList
                                        color={C.accentLight}
                                        items={b.status
                                            .slice(0, 9)
                                            .map((s) => ({
                                                label: s.label,
                                                value: s.count,
                                                chip: (
                                                    <StatusChip
                                                        label={s.label}
                                                        tone={statusTone(
                                                            s.label,
                                                        )}
                                                    />
                                                ),
                                            }))}
                                    />
                                </Panel>
                                <Panel title="Requests by device">
                                    {b.device.length ? (
                                        <Donut
                                            data={b.device.map((d) => ({
                                                label: d.label || "unknown",
                                                value: d.count,
                                            }))}
                                        />
                                    ) : (
                                        <Empty message="No device data." />
                                    )}
                                </Panel>
                            </Box>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(360px, 1fr))",
                                    gap: 1.5,
                                }}
                            >
                                <Panel title="Top hosts">
                                    <TopList
                                        color={C.accentDeep}
                                        items={b.host.slice(0, 10).map((h) => ({
                                            label: h.label,
                                            value: h.count,
                                        }))}
                                    />
                                </Panel>
                                <Panel title="Top paths">
                                    <TopList
                                        color="#86efac"
                                        items={b.path.slice(0, 10).map((p) => ({
                                            label: p.label,
                                            value: p.count,
                                        }))}
                                    />
                                </Panel>
                            </Box>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(280px, 1fr))",
                                    gap: 1.5,
                                    mt: 1.5,
                                }}
                            >
                                <Panel title="Top browsers">
                                    <TopList
                                        items={b.browser
                                            .slice(0, 8)
                                            .map((x) => ({
                                                label: x.label || "—",
                                                value: x.count,
                                            }))}
                                    />
                                </Panel>
                                <Panel title="HTTP versions">
                                    <TopList
                                        color={C.accentLight}
                                        items={b.httpProtocol
                                            .slice(0, 8)
                                            .map((x) => ({
                                                label: x.label || "—",
                                                value: x.count,
                                            }))}
                                    />
                                </Panel>
                                <Panel title="TLS versions">
                                    <TopList
                                        color={C.accentDeep}
                                        items={b.tls
                                            .slice(0, 8)
                                            .map((x) => ({
                                                label: x.label || "—",
                                                value: x.count,
                                            }))}
                                    />
                                </Panel>
                                <Panel title="Top IPs">
                                    <TopList
                                        color="#86efac"
                                        items={b.ip
                                            .slice(0, 8)
                                            .map((x) => ({
                                                label: x.label || "—",
                                                value: x.count,
                                            }))}
                                    />
                                </Panel>
                            </Box>
                        </>
                    )}
                </>
            )}
        </Box>
    );
}
