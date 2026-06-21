import { Box, Typography } from "@mui/material";
import { PageHeader, Panel, StatusChip } from "@/components/ui";
import { discoverAccount } from "@/lib/discovery";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const SECTION_LABELS: Record<string, string> = {
    pages: "Pages",
    workers: "Workers",
    d1: "D1",
    kv: "KV",
    queues: "Queues",
    durableObjects: "Durable Objects",
    containers: "Containers",
    workflows: "Workflows",
    zones: "Zones",
    logpush: "Logpush / Logs",
};

export default async function SettingsPage() {
    const inv = await discoverAccount();

    return (
        <Box>
            <PageHeader title="Settings" subtitle="Token scopes & discovery health" />

            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 2 }}>
                <Panel title="Account">
                    <Row label="Account ID" value={inv.accountId} mono />
                    <Row label="Discovery cached at" value={new Date(inv.fetchedAt).toLocaleString()} />
                </Panel>

                <Panel title="Discovery / token scope health">
                    <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", mb: 1.5 }}>
                        A failing section usually means the CF_API_TOKEN is missing that scope, or the product
                        isn't enabled on the account.
                    </Typography>
                    {Object.entries(SECTION_LABELS).map(([key, label]) => {
                        const err = inv.errors[key];
                        return (
                            <Box
                                key={key}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    py: 0.9,
                                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                                }}
                            >
                                <Typography sx={{ color: "#f5f5f4", fontSize: "0.85rem" }}>{label}</Typography>
                                {err ? <StatusChip label="unavailable" tone="warning" /> : <StatusChip label="ok" tone="success" />}
                            </Box>
                        );
                    })}
                </Panel>
            </Box>
        </Box>
    );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.9, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.82rem" }}>{label}</Typography>
            <Typography sx={{ color: "#f5f5f4", fontSize: "0.82rem", fontFamily: mono ? "var(--font-geist-mono), monospace" : undefined }}>
                {value}
            </Typography>
        </Box>
    );
}
