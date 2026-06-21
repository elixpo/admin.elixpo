import { discoverAccount } from "@/lib/discovery";
import { lastHours, zoneBreakdown, zoneTraffic } from "@/lib/metrics";
import TrafficView, { type ZoneData } from "./traffic-view";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function TrafficPage() {
    const inv = await discoverAccount();
    const w = lastHours(24);
    const zones: ZoneData[] = await Promise.all(
        inv.zones.map(async (z) => {
            const [traffic, breakdown] = await Promise.all([
                zoneTraffic(z.id, w),
                zoneBreakdown(z.id, w),
            ]);
            return { name: z.name, id: z.id, traffic, breakdown };
        }),
    );
    return <TrafficView zones={zones} />;
}
