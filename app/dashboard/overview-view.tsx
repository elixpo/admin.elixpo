"use client";

import {
    AccountTree,
    Bolt,
    CloudQueue,
    Dns,
    Hub,
    Inventory2,
    Public,
    Queue,
    Storage,
    ViewList,
    Warning,
} from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import MetricChart from "@/components/metric-chart";
import { Empty, PageHeader, Panel, SectionError, StatCard, StatusChip } from "@/components/ui";
import { autoLabel, metaFor } from "@/lib/enrich";
import type { Inventory } from "@/lib/discovery";
import type { MetricSeries } from "@/lib/metrics";

const grid = (min: number) => ({
    display: "grid",
    gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`,
    gap: 2,
});

function ResourceRow({
    primary,
    secondary,
    href,
    chip,
}: {
    primary: string;
    secondary?: string;
    href?: string;
    chip?: React.ReactNode;
}) {
    const inner = (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                py: 1,
                px: 1,
                borderRadius: "8px",
                transition: "background 0.15s",
                "&:hover": href ? { bgcolor: "rgba(255,255,255,0.04)" } : undefined,
            }}
        >
            <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ color: "#f5f5f4", fontSize: "0.85rem", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {primary}
                </Typography>
                {secondary && (
                    <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem" }}>{secondary}</Typography>
                )}
            </Box>
            {chip}
        </Box>
    );
    return href ? (
        <Link href={href} style={{ textDecoration: "none" }}>
            {inner}
        </Link>
    ) : (
        inner
    );
}

export default function OverviewView({
    inv,
    workers,
    traffic,
    primaryZoneName,
}: {
    inv: Inventory;
    workers: MetricSeries;
    traffic: MetricSeries | null;
    primaryZoneName?: string;
}) {
    const deadQueues = inv.queues.filter((q) => (q.consumers_total_count ?? 0) === 0);
    const failedSections = Object.entries(inv.errors).filter(([, e]) => e !== null) as [string, { error: string }][];

    return (
        <Box>
            <PageHeader
                title="Overview"
                subtitle={`Live inventory of the Elixpo Cloudflare account · ${new Date(inv.fetchedAt).toLocaleTimeString()}`}
                action={
                    <Link href="/dashboard?ts=refresh" style={{ textDecoration: "none" }}>
                        <StatusChip label="Refresh" tone="info" />
                    </Link>
                }
            />

            {/* queue health alarm */}
            {deadQueues.length > 0 && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 3,
                        p: 2,
                        borderRadius: "12px",
                        bgcolor: "rgba(251,191,36,0.08)",
                        border: "1px solid rgba(251,191,36,0.3)",
                    }}
                >
                    <Warning sx={{ color: "#fbbf24" }} />
                    <Typography sx={{ color: "#fbbf24", fontSize: "0.85rem" }}>
                        {deadQueues.length} queue{deadQueues.length > 1 ? "s have" : " has"} no consumer (messages won't be processed):{" "}
                        <b>{deadQueues.map((q) => q.queue_name).join(", ")}</b>
                    </Typography>
                </Box>
            )}

            {/* inventory stat tiles */}
            <Box sx={{ ...grid(170), mb: 3 }}>
                <StatCard icon={Inventory2} label="Pages projects" value={inv.pages.length} color="#9b7bf7" />
                <StatCard icon={Bolt} label="Workers" value={inv.workers.length} color="#fbbf24" href="/dashboard/workers" />
                <StatCard icon={Storage} label="D1 databases" value={inv.d1.length} color="#86efac" href="/dashboard/d1" />
                <StatCard icon={ViewList} label="KV namespaces" value={inv.kv.length} color="#5fb6ff" href="/dashboard/kv" />
                <StatCard icon={Queue} label="Queues" value={inv.queues.length} color="#ff6a8a" href="/dashboard/queues" />
                <StatCard icon={Hub} label="Durable Objects" value={inv.durableObjects.length} color="#c4b5fd" href="/dashboard/durable-objects" />
                <StatCard icon={AccountTree} label="Workflows" value={inv.workflows.length} color="#818cf8" href="/dashboard/workflows" />
                <StatCard icon={CloudQueue} label="Containers" value={inv.containers.length} color="#34d399" />
                <StatCard icon={Public} label="Zones" value={inv.zones.length} color="#fb923c" />
            </Box>

            {/* charts */}
            <Box sx={{ ...grid(420), mb: 3 }}>
                <Panel title="Workers invocations · 24h (all scripts)">
                    {workers.available ? (
                        <MetricChart
                            points={workers.points}
                            series={[
                                { key: "requests", label: "Requests", color: "#9b7bf7" },
                                { key: "errors", label: "Errors", color: "#f87171" },
                            ]}
                        />
                    ) : (
                        <SectionError message={`Metrics unavailable: ${workers.error}`} />
                    )}
                </Panel>
                <Panel title={`Traffic · 24h${primaryZoneName ? ` · ${primaryZoneName}` : ""}`}>
                    {traffic ? (
                        traffic.available ? (
                            <MetricChart points={traffic.points} series={[{ key: "requests", label: "Requests", color: "#86efac" }]} />
                        ) : (
                            <SectionError message={`Zone analytics unavailable: ${traffic.error}`} />
                        )
                    ) : (
                        <Empty message="No zones discovered." />
                    )}
                </Panel>
            </Box>

            {/* discovery-driven resource lists */}
            <Box sx={grid(360)}>
                <Panel title={`Pages projects (${inv.pages.length})`}>
                    {inv.pages.length ? (
                        inv.pages.map((p) => {
                            const m = metaFor(p.name);
                            const domain = p.domains?.find((d) => !d.endsWith(".pages.dev")) || p.domains?.[0];
                            return (
                                <ResourceRow
                                    key={p.name}
                                    primary={m.label}
                                    secondary={domain || p.name}
                                    href={domain ? `https://${domain}` : undefined}
                                />
                            );
                        })
                    ) : (
                        <Empty message="No Pages projects." />
                    )}
                </Panel>

                <Panel title={`Workers (${inv.workers.length})`}>
                    {inv.workers.length ? (
                        inv.workers.map((w) => (
                            <ResourceRow key={w.id} primary={autoLabel(w.id)} secondary={w.id} href="/dashboard/workers" />
                        ))
                    ) : (
                        <Empty message="No Workers." />
                    )}
                </Panel>

                <Panel title={`D1 databases (${inv.d1.length})`}>
                    {inv.d1.length ? (
                        inv.d1.map((d) => (
                            <ResourceRow
                                key={d.uuid}
                                primary={d.name}
                                secondary={d.num_tables != null ? `${d.num_tables} tables` : d.uuid}
                                href={`/dashboard/d1/${d.uuid}`}
                            />
                        ))
                    ) : (
                        <Empty message="No D1 databases." />
                    )}
                </Panel>

                <Panel title={`KV namespaces (${inv.kv.length})`}>
                    {inv.kv.length ? (
                        inv.kv.map((k) => (
                            <ResourceRow key={k.id} primary={k.title} secondary={k.id} href="/dashboard/kv" />
                        ))
                    ) : (
                        <Empty message="No KV namespaces." />
                    )}
                </Panel>

                <Panel title={`Queues (${inv.queues.length})`}>
                    {inv.queues.length ? (
                        inv.queues.map((q) => (
                            <ResourceRow
                                key={q.queue_id}
                                primary={q.queue_name}
                                secondary={`${q.producers_total_count ?? 0} producers · ${q.consumers_total_count ?? 0} consumers`}
                                href="/dashboard/queues"
                                chip={
                                    (q.consumers_total_count ?? 0) === 0 ? (
                                        <StatusChip label="no consumer" tone="warning" />
                                    ) : (
                                        <StatusChip label="active" tone="success" />
                                    )
                                }
                            />
                        ))
                    ) : (
                        <Empty message="No queues." />
                    )}
                </Panel>

                <Panel title={`Durable Objects (${inv.durableObjects.length})`}>
                    {inv.durableObjects.length ? (
                        inv.durableObjects.map((d) => (
                            <ResourceRow key={d.id} primary={d.class || d.name || d.id} secondary={d.script || d.id} href="/dashboard/durable-objects" />
                        ))
                    ) : (
                        <Empty message="No Durable Object namespaces." />
                    )}
                </Panel>

                <Panel title={`Workflows (${inv.workflows.length})`}>
                    {inv.workflows.length ? (
                        inv.workflows.map((w) => <ResourceRow key={w.name} primary={w.name} secondary={w.class_name || w.script_name} />)
                    ) : (
                        <Empty message="No Workflows yet." />
                    )}
                </Panel>

                <Panel title={`Zones (${inv.zones.length})`}>
                    {inv.zones.length ? (
                        inv.zones.map((z) => (
                            <ResourceRow
                                key={z.id}
                                primary={z.name}
                                secondary={z.id}
                                chip={<StatusChip label={z.status || "?"} tone={z.status === "active" ? "success" : "neutral"} />}
                            />
                        ))
                    ) : (
                        <Empty message="No zones." />
                    )}
                </Panel>
            </Box>

            {/* discovery section errors (missing scopes / unentitled products) */}
            {failedSections.length > 0 && (
                <Box sx={{ mt: 3 }}>
                    <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                        <Dns sx={{ fontSize: "1rem" }} /> Some resource types couldn't be listed (token scope or product not enabled):
                    </Typography>
                    <Box sx={grid(300)}>
                        {failedSections.map(([name, e]) => (
                            <SectionError key={name} message={`${name}: ${e.error}`} />
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
}
