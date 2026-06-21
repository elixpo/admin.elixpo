import MetricChart from "@/components/metric-chart";
import { Empty, PageHeader, Panel, SectionError } from "@/components/ui";
import { discoverAccount } from "@/lib/discovery";
import { dnsAnalytics } from "@/lib/metrics";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function DnsPage() {
    const inv = await discoverAccount();
    const charts = await Promise.all(
        inv.zones.map((z) => dnsAnalytics(z.id).then((m) => ({ name: z.name, m }))),
    );

    return (
        <div>
            <PageHeader title="DNS analytics" subtitle="DNS queries per zone · 24h" />
            {inv.zones.length === 0 ? (
                <Empty message="No zones found." />
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(460px, 1fr))", gap: 12 }}>
                    {charts.map(({ name, m }) => (
                        <Panel key={name} title={name}>
                            {m.available ? (
                                <MetricChart points={m.points} series={[{ key: "queries", label: "Queries", color: "#4593ff" }]} />
                            ) : (
                                <SectionError message={`DNS analytics unavailable: ${m.error}`} />
                            )}
                        </Panel>
                    ))}
                </div>
            )}
        </div>
    );
}
