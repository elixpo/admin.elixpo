import { Box } from "@mui/material";
import ListView, { type ListItem } from "@/components/list-view";
import MetricChart from "@/components/metric-chart";
import { Panel, SectionError } from "@/components/ui";
import { discoverAccount } from "@/lib/discovery";
import { doMetrics } from "@/lib/metrics";
import { autoLabel } from "@/lib/enrich";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function DurableObjectsPage() {
    const inv = await discoverAccount();
    const metrics = await doMetrics();

    const items: ListItem[] = inv.durableObjects.map((d) => ({
        id: d.id,
        primary: d.class || d.name || autoLabel(d.id),
        secondary: [d.script, d.use_sqlite ? "SQLite" : null, d.id].filter(Boolean).join(" · "),
    }));

    return (
        <ListView
            title="Durable Objects"
            subtitle="Stateful coordination objects across the account"
            panelTitle={`${items.length} namespaces`}
            items={items}
            emptyMessage="No Durable Object namespaces found."
            error={inv.errors.durableObjects?.error}
        >
            <Box sx={{ mb: 3 }}>
                <Panel title="Durable Object requests · 24h (account-wide)">
                    {metrics.available ? (
                        <MetricChart
                            points={metrics.points}
                            series={[
                                { key: "requests", label: "Requests", color: "#c4b5fd" },
                                { key: "errors", label: "Errors", color: "#f87171" },
                            ]}
                        />
                    ) : (
                        <SectionError message={`Metrics unavailable: ${metrics.error}`} />
                    )}
                </Panel>
            </Box>
        </ListView>
    );
}
