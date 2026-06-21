import { discoverAccount } from "@/lib/discovery";
import { metaFor } from "@/lib/enrich";
import { hostTraffic, lastHours } from "@/lib/metrics";
import ProjectsView, { type ProjItem } from "./projects-view";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
    const inv = await discoverAccount();
    const w = lastHours(24);
    const zone = inv.zones.find((z) => z.name === "elixpo.com") || inv.zones[0];

    const projects: ProjItem[] = await Promise.all(
        inv.pages.map(async (p) => {
            const meta = metaFor(p.name);
            const domain = p.domains?.find((d) => !d.endsWith(".pages.dev")) || p.domains?.[0];
            const traffic = zone && domain && !domain.endsWith(".pages.dev") ? await hostTraffic(zone.id, domain, w) : null;
            const spark = traffic?.points.map((pt) => Number(pt.requests) || 0) || [];
            return {
                name: p.name,
                label: meta.label,
                domain,
                available: !!traffic?.available,
                requests: traffic?.totals.requests || 0,
                spark,
            };
        }),
    );

    return <ProjectsView projects={projects} />;
}
