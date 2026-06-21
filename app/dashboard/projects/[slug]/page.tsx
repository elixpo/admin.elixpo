import { Empty, PageHeader } from "@/components/ui";
import { discoverAccount, pagesProjectDetail } from "@/lib/discovery";
import { metaFor } from "@/lib/enrich";
import {
    d1Metrics,
    hostTraffic,
    kvMetrics,
    lastHours,
    zoneBreakdown,
} from "@/lib/metrics";
import { Box } from "@mui/material";
import ProjectDetailView, { type BindingMetric } from "./project-detail-view";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
    params,
}: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const [inv, detail] = await Promise.all([
        discoverAccount(),
        pagesProjectDetail(slug),
    ]);

    if (!detail) {
        return (
            <Box>
                <PageHeader title={slug} subtitle="Project" />
                <Empty message="Project not found, or its bindings couldn't be read." />
            </Box>
        );
    }

    const meta = metaFor(slug);
    const zone = inv.zones.find((z) => z.name === "elixpo.com") || inv.zones[0];
    const domain =
        detail.productionDomain &&
        !detail.productionDomain.endsWith(".pages.dev")
            ? detail.productionDomain
            : undefined;
    const w = lastHours(24);

    const [traffic, breakdown, d1, kv] = await Promise.all([
        zone && domain
            ? hostTraffic(zone.id, domain, w)
            : Promise.resolve(null),
        zone && domain
            ? zoneBreakdown(zone.id, w, domain)
            : Promise.resolve(null),
        Promise.all(
            detail.d1.map(async (b): Promise<BindingMetric> => {
                const db = inv.d1.find((d) => d.uuid === b.id);
                return {
                    binding: b.binding,
                    id: b.id,
                    name: db?.name || b.id,
                    metrics: await d1Metrics(b.id, w),
                };
            }),
        ),
        Promise.all(
            detail.kv.map(async (b): Promise<BindingMetric> => {
                const ns = inv.kv.find((n) => n.id === b.id);
                return {
                    binding: b.binding,
                    id: b.id,
                    name: ns?.title || b.id,
                    metrics: await kvMetrics(b.id, w),
                };
            }),
        ),
    ]);

    return (
        <ProjectDetailView
            label={meta.label}
            detail={detail}
            traffic={traffic}
            breakdown={breakdown}
            d1={d1}
            kv={kv}
        />
    );
}
