/**
 * Auto-discovery engine — the heart of the dashboard.
 *
 * Enumerates EVERY resource type in the account live from the Cloudflare REST
 * API, in parallel, with per-type error capture (a missing scope or unentitled
 * product degrades that one section instead of breaking the page). Nothing is
 * hardcoded: a newly-created D1/Queue/Worker/Workflow/Container/DO/zone shows up
 * automatically on the next refresh. Result is cached in `admin-cache` KV.
 */

import { acctPath, cfList, cfRest, safe } from "./cloudflare-api";
import { cacheGet, cacheSet } from "./kv";

const CACHE_KEY = "discovery:account";
const CACHE_TTL = 60; // seconds

export interface PagesProject {
    name: string;
    subdomain?: string;
    domains?: string[];
    latest_deployment?: {
        id?: string;
        created_on?: string;
        environment?: string;
    };
    created_on?: string;
}

export interface WorkerScript {
    id: string;
    created_on?: string;
    modified_on?: string;
    // schedules attached separately when available
}

export interface D1Database {
    uuid: string;
    name: string;
    version?: string;
    num_tables?: number;
    file_size?: number;
    created_at?: string;
}

export interface KvNamespace {
    id: string;
    title: string;
    supports_url_encoding?: boolean;
}

export interface QueueInfo {
    queue_id: string;
    queue_name: string;
    created_on?: string;
    modified_on?: string;
    producers_total_count?: number;
    consumers_total_count?: number;
    producers?: unknown[];
    consumers?: unknown[];
}

export interface DurableObjectNamespace {
    id: string;
    name?: string;
    script?: string;
    class?: string;
    use_sqlite?: boolean;
}

export interface ContainerApp {
    id?: string;
    name?: string;
    [k: string]: unknown;
}

export interface WorkflowInfo {
    name: string;
    id?: string;
    class_name?: string;
    script_name?: string;
    created_on?: string;
    [k: string]: unknown;
}

export interface ZoneInfo {
    id: string;
    name: string;
    status?: string;
}

export interface LogpushJob {
    id: number;
    name?: string;
    dataset?: string;
    enabled?: boolean;
    [k: string]: unknown;
}

export type SectionError = { error: string; status?: number } | null;

export interface Inventory {
    accountId: string;
    fetchedAt: number;
    pages: PagesProject[];
    workers: WorkerScript[];
    d1: D1Database[];
    kv: KvNamespace[];
    queues: QueueInfo[];
    durableObjects: DurableObjectNamespace[];
    containers: ContainerApp[];
    workflows: WorkflowInfo[];
    zones: ZoneInfo[];
    logpush: LogpushJob[];
    errors: Record<string, SectionError>;
}

async function listAcct<T>(
    suffix: string,
    opts?: { perPage?: number },
): Promise<T[]> {
    return cfList<T>(await acctPath(suffix), opts);
}

/** Discover the whole account. Set `force` to bypass the KV cache. */
export async function discoverAccount(force = false): Promise<Inventory> {
    if (!force) {
        const cached = await cacheGet<Inventory>(CACHE_KEY).catch(() => null);
        if (cached) return cached;
    }

    const { getAccountId } = await import("./cloudflare-api");
    const accountId = await getAccountId();

    const [
        pages,
        workers,
        d1,
        kv,
        queues,
        durableObjects,
        containers,
        workflows,
        zones,
        logpush,
    ] = await Promise.all([
        safe(() => listAcct<PagesProject>("/pages/projects")),
        safe(() => listAcct<WorkerScript>("/workers/scripts")),
        safe(() => listAcct<D1Database>("/d1/database")),
        safe(() => listAcct<KvNamespace>("/storage/kv/namespaces")),
        safe(() => listAcct<QueueInfo>("/queues")),
        safe(() =>
            listAcct<DurableObjectNamespace>(
                "/workers/durable_objects/namespaces",
            ),
        ),
        safe(() => listAcct<ContainerApp>("/containers/applications")),
        safe(() => listAcct<WorkflowInfo>("/workflows")),
        safe(() => cfList<ZoneInfo>(`/zones?account.id=${accountId}`)),
        safe(() => listAcct<LogpushJob>("/logpush/jobs")),
    ]);

    const errors: Record<string, SectionError> = {};
    const pick = <T>(
        name: string,
        r:
            | { ok: true; data: T }
            | { ok: false; error: string; status?: number },
        fallback: T,
    ): T => {
        if (r.ok) {
            errors[name] = null;
            return r.data;
        }
        errors[name] = { error: r.error, status: r.status };
        return fallback;
    };

    const inv: Inventory = {
        accountId,
        fetchedAt: Date.now(),
        pages: pick("pages", pages, []),
        workers: pick("workers", workers, []),
        d1: pick("d1", d1, []),
        kv: pick("kv", kv, []),
        queues: pick("queues", queues, []),
        durableObjects: pick("durableObjects", durableObjects, []),
        containers: pick("containers", containers, []),
        workflows: pick("workflows", workflows, []),
        zones: pick("zones", zones, []),
        logpush: pick("logpush", logpush, []),
        errors,
    };

    await cacheSet(CACHE_KEY, inv, CACHE_TTL).catch(() => {
        // cache is best-effort; never fail discovery on a KV hiccup
    });
    return inv;
}

/** Fetch cron schedules for a single Worker script (best-effort). */
export async function workerSchedules(scriptName: string): Promise<string[]> {
    const r = await safe(async () => {
        const env = await cfRest<{ schedules?: { cron: string }[] }>(
            await acctPath(`/workers/scripts/${scriptName}/schedules`),
        );
        return (env.result?.schedules || []).map((s) => s.cron);
    });
    return r.ok ? r.data : [];
}

/** Recent deployments for a Pages project (best-effort). */
export async function pagesDeployments(
    project: string,
    max = 10,
): Promise<any[]> {
    const r = await safe(() =>
        listAcct<any>(`/pages/projects/${project}/deployments`, {
            perPage: max,
        }),
    );
    return r.ok ? r.data.slice(0, max) : [];
}
