"use client";

import { Box } from "@mui/material";
import MetricChart from "@/components/metric-chart";
import QueryConsole from "@/components/query-console";
import { PageHeader, Panel, SectionError, StatCard } from "@/components/ui";
import type { MetricSeries } from "@/lib/metrics";

export default function D1DetailView({
    dbId,
    dbName,
    tables,
    tablesError,
    metrics,
}: {
    dbId: string;
    dbName: string;
    tables: string[];
    tablesError?: string | null;
    metrics: MetricSeries;
}) {
    return (
        <Box>
            <PageHeader title={dbName} subtitle={`D1 · ${dbId}`} />

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                    gap: 2,
                    mb: 3,
                }}
            >
                <StatCard label="Read queries · 24h" value={metrics.totals.readQueries?.toLocaleString() ?? "—"} color="#86efac" />
                <StatCard label="Write queries · 24h" value={metrics.totals.writeQueries?.toLocaleString() ?? "—"} color="#fbbf24" />
                <StatCard label="Rows read · 24h" value={metrics.totals.rowsRead?.toLocaleString() ?? "—"} color="#9b7bf7" />
                <StatCard label="Rows written · 24h" value={metrics.totals.rowsWritten?.toLocaleString() ?? "—"} color="#5fb6ff" />
            </Box>

            <Box sx={{ mb: 3 }}>
                <Panel title="D1 activity · 24h">
                    {metrics.available ? (
                        <MetricChart
                            points={metrics.points}
                            series={[
                                { key: "readQueries", label: "Reads", color: "#86efac" },
                                { key: "writeQueries", label: "Writes", color: "#fbbf24" },
                            ]}
                        />
                    ) : (
                        <SectionError message={`Metrics unavailable: ${metrics.error}`} />
                    )}
                </Panel>
            </Box>

            <Panel title="Query console">
                {tablesError && <SectionError message={`Couldn't list tables: ${tablesError}`} />}
                <QueryConsole dbId={dbId} tables={tables} />
            </Panel>
        </Box>
    );
}
