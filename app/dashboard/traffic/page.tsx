import MetricChart from "@/components/metric-chart";
import { Empty, PageHeader, Panel, SectionError } from "@/components/ui";
import { discoverAccount } from "@/lib/discovery";
import { zoneTraffic } from "@/lib/metrics";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function TrafficPage() {
    const inv = await discoverAccount();
    const charts = await Promise.all(
        inv.zones.map((z) => zoneTraffic(z.id).then((m) => ({ name: z.name, m }))),
    );

    return (
        <div>
            <PageHeader title="Traffic" subtitle="HTTP requests & bandwidth per zone · 24h" />
            {inv.errors.zones && <SectionError message={`Couldn't list zones: ${inv.errors.zones.error}`} />}
            {inv.zones.length === 0 ? (
                <Empty message="No zones found." />
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(460px, 1fr))", gap: 12 }}>
                    {charts.map(({ name, m }) => (
                        <Panel key={name} title={name}>
                            {m.available ? (
                                <MetricChart
                                    points={m.points}
                                    series={[
                                        { key: "requests", label: "Requests", color: "#4593ff" },
                                        { key: "bytes", label: "Bytes", color: "#22c55e" },
                                    ]}
                                />
                            ) : (
                                <SectionError message={`Zone analytics unavailable: ${m.error}`} />
                            )}
                        </Panel>
                    ))}
                </div>
            )}
        </div>
    );
}
