import MetricChart from "@/components/metric-chart";
import { Empty, PageHeader, Panel, SectionError } from "@/components/ui";
import { discoverAccount } from "@/lib/discovery";
import { autoLabel } from "@/lib/enrich";
import { workersMetrics } from "@/lib/metrics";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function WorkersPage() {
    const inv = await discoverAccount();
    const metrics = await Promise.all(
        inv.workers.map((w) =>
            workersMetrics(w.id).then((m) => ({ name: w.id, m })),
        ),
    );

    return (
        <div>
            <PageHeader
                title="Workers"
                subtitle="Invocations, errors and subrequests per script · 24h"
            />
            {inv.errors.workers && (
                <SectionError
                    message={`Couldn't list Workers: ${inv.errors.workers.error}`}
                />
            )}
            {inv.workers.length === 0 ? (
                <Empty message="No Workers found." />
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(440px, 1fr))",
                        gap: 12,
                    }}
                >
                    {metrics.map(({ name, m }) => (
                        <Panel key={name} title={autoLabel(name)}>
                            {m.available ? (
                                <MetricChart
                                    points={m.points}
                                    series={[
                                        {
                                            key: "requests",
                                            label: "Requests",
                                            color: "#a855f7",
                                        },
                                        {
                                            key: "errors",
                                            label: "Errors",
                                            color: "#ef4444",
                                        },
                                    ]}
                                />
                            ) : (
                                <SectionError
                                    message={`Metrics unavailable: ${m.error}`}
                                />
                            )}
                        </Panel>
                    ))}
                </div>
            )}
        </div>
    );
}
