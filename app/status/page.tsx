/**
 * PUBLIC status page (non-gated) — live health of every Elixpo product, derived
 * from Cloudflare edge analytics (per-host status codes). No third-party uptime
 * tool needed; this is Cloudflare-native.
 */

import { discoverAccount } from "@/lib/discovery";
import { metaFor } from "@/lib/enrich";
import { lastHours, zoneBreakdown } from "@/lib/metrics";
import type { Metadata } from "next";
import StatusView, { type Health, type ProductStatus } from "./status-view";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Status — Elixpo",
    description:
        "Live operational status and request health (2xx/3xx/4xx/5xx) for every Elixpo service.",
    robots: { index: true, follow: true },
    openGraph: {
        title: "Elixpo Status",
        description: "Live operational status for every Elixpo service.",
        images: ["/og-image.png"],
        url: "https://admin.elixpo.com/status",
    },
};

function classify(status: { label: string; count: number }[]): {
    total: number;
    fivexx: number;
} {
    let total = 0;
    let fivexx = 0;
    for (const s of status) {
        const n = Number(s.label);
        total += s.count;
        if (n >= 500) fivexx += s.count;
    }
    return { total, fivexx };
}

function health(total: number, fivexx: number): Health {
    if (total === 0) return "idle";
    const ratio = fivexx / total;
    if (ratio < 0.02) return "operational";
    if (ratio < 0.1) return "degraded";
    return "outage";
}

export default async function StatusPage() {
    const inv = await discoverAccount();
    const w = lastHours(24);
    const zone = inv.zones.find((z) => z.name === "elixpo.com") || inv.zones[0];

    const products: ProductStatus[] = zone
        ? await Promise.all(
              inv.pages
                  .map((p) => ({
                      p,
                      domain: p.domains?.find((d) => !d.endsWith(".pages.dev")),
                  }))
                  .filter((x) => !!x.domain)
                  .map(async ({ p, domain }) => {
                      const b = await zoneBreakdown(zone.id, w, domain);
                      const { total, fivexx } = classify(b.status);
                      return {
                          label: metaFor(p.name).label,
                          domain,
                          total,
                          fivexx,
                          availability:
                              total > 0
                                  ? ((total - fivexx) / total) * 100
                                  : 100,
                          health: health(total, fivexx),
                          status: b.status,
                      } as ProductStatus & { fivexx: number };
                  }),
          )
        : [];

    // Show the busiest first.
    products.sort((a, b) => b.total - a.total);

    return <StatusView products={products} fetchedAt={inv.fetchedAt} />;
}
