import { z } from "zod";
import type {
  CloudBridgeGenerateRequest,
  CloudBridgeGenerateResponse,
  CloudBridgeStatusResponse,
  CloudProviderId,
} from "../../../shared/cloud-bridge-contract";

export interface CloudBridgeEnv {
  APIMART_API_KEY?: string;
  APIMART_BASE_URL?: string;
  APIMART_GENERATE_PATH?: string;
  LAOZHANG_API_KEY?: string;
  LAOZHANG_BASE_URL?: string;
  LAOZHANG_GENERATE_PATH?: string;
  ALLOWED_ORIGIN?: string;
}

const generateRequestSchema = z.object({
  provider: z.enum(["apimart", "laozhang"]),
  scene: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    styleProfileId: z.string().min(1),
    providerMode: z.enum(["none", "local", "cloud"]),
    elementCount: z.number().int().nonnegative(),
  }),
  promptSummary: z.object({
    title: z.string().min(1),
    body: z.string().min(1),
    relationships: z.array(z.string().min(1)),
  }),
  output: z.object({
    format: z.enum(["png", "webp", "gif"]),
    maxBytes: z.number().int().positive().max(50 * 1024 * 1024),
  }),
});

function corsHeaders(env: CloudBridgeEnv) {
  const allowOrigin = env.ALLOWED_ORIGIN?.trim();
  return {
    ...(allowOrigin ? { "access-control-allow-origin": allowOrigin } : {}),
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type",
  };
}

function json(data: unknown, env: CloudBridgeEnv, init?: ResponseInit) {
  return new Response(JSON.stringify(data, null, 2), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...corsHeaders(env),
      ...(init?.headers ?? {}),
    },
  });
}

function configuredProviders(env: CloudBridgeEnv): CloudProviderId[] {
  const providers: CloudProviderId[] = [];
  if (env.APIMART_API_KEY && env.APIMART_BASE_URL) {
    providers.push("apimart");
  }
  if (env.LAOZHANG_API_KEY && env.LAOZHANG_BASE_URL) {
    providers.push("laozhang");
  }
  return providers;
}

function providerConfig(env: CloudBridgeEnv, provider: CloudProviderId) {
  if (provider === "apimart") {
    return env.APIMART_API_KEY && env.APIMART_BASE_URL
      ? {
          apiKey: env.APIMART_API_KEY,
          url: `${env.APIMART_BASE_URL.replace(/\/+$/, "")}${env.APIMART_GENERATE_PATH ?? "/v1/images/generations"}`,
        }
      : null;
  }

  return env.LAOZHANG_API_KEY && env.LAOZHANG_BASE_URL
    ? {
        apiKey: env.LAOZHANG_API_KEY,
        url: `${env.LAOZHANG_BASE_URL.replace(/\/+$/, "")}${env.LAOZHANG_GENERATE_PATH ?? "/v1/images/generations"}`,
      }
    : null;
}

function sanitizeText(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
}

function sanitizeRequest(request: CloudBridgeGenerateRequest): CloudBridgeGenerateRequest {
  return {
    ...request,
    promptSummary: {
      title: sanitizeText(request.promptSummary.title),
      body: sanitizeText(request.promptSummary.body),
      relationships: request.promptSummary.relationships.map(sanitizeText),
    },
  };
}

export function buildStatusResponse(env: CloudBridgeEnv): CloudBridgeStatusResponse {
  const providers = configuredProviders(env);
  const hasOrigin = Boolean(env.ALLOWED_ORIGIN?.trim());
  return {
    mode: "cloud",
    connectionState: providers.length > 0 && hasOrigin ? "ready" : "unavailable",
    configuredProviders: providers,
    message:
      providers.length > 0 && hasOrigin
        ? "Cloud bridge is configured and ready to sanitize generation requests."
        : !hasOrigin
          ? "Cloud bridge is missing ALLOWED_ORIGIN and is not browser-safe yet."
          : "Cloud bridge is live, but no complete upstream provider configuration is present.",
  };
}

async function forwardToUpstreamProvider(
  payload: CloudBridgeGenerateRequest,
  env: CloudBridgeEnv,
): Promise<CloudBridgeGenerateResponse> {
  const config = providerConfig(env, payload.provider);
  if (!config) {
    return {
      status: "unavailable",
      requestId: null,
      assetUrl: null,
      format: payload.output.format,
      estimatedBytes: null,
      message: `Provider ${payload.provider} is not configured in the Cloudflare Worker environment.`,
      warnings: ["Add the provider secret before enabling cloud generation in production."],
    };
  }

  const upstreamResponse = await fetch(config.url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!upstreamResponse.ok) {
    return {
      status: "unavailable",
      requestId: null,
      assetUrl: null,
      format: payload.output.format,
      estimatedBytes: null,
      message: `Upstream provider ${payload.provider} returned ${upstreamResponse.status}.`,
      warnings: ["Inspect the upstream provider response and credentials."],
    };
  }

  const upstreamJson = (await upstreamResponse.json()) as Record<string, unknown>;
  const assetUrl =
    typeof upstreamJson.assetUrl === "string"
      ? upstreamJson.assetUrl
      : typeof upstreamJson.url === "string"
        ? upstreamJson.url
        : Array.isArray(upstreamJson.data) &&
            upstreamJson.data[0] &&
            typeof (upstreamJson.data[0] as Record<string, unknown>).url === "string"
          ? ((upstreamJson.data[0] as Record<string, unknown>).url as string)
          : null;

  return {
    status: "accepted",
    requestId:
      typeof upstreamJson.requestId === "string" ? upstreamJson.requestId : crypto.randomUUID(),
    assetUrl,
    format: payload.output.format,
    estimatedBytes:
      typeof upstreamJson.estimatedBytes === "number" ? upstreamJson.estimatedBytes : null,
    message: `Cloud bridge forwarded the request to ${payload.provider}.`,
    warnings: assetUrl ? [] : ["Upstream provider returned no asset URL in the normalized response."],
  };
}

export async function handleBridgeRequest(request: Request, env: CloudBridgeEnv): Promise<Response> {
  const url = new URL(request.url);

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(env),
    });
  }

  if (request.method === "GET" && url.pathname === "/api/health") {
    const providers = configuredProviders(env);
    const hasOrigin = Boolean(env.ALLOWED_ORIGIN?.trim());
    return json(
      {
        service: "canvasflow-cloud-bridge",
        status: providers.length > 0 && hasOrigin ? "ok" : "degraded",
        configuredProviders: providers,
        message:
          providers.length > 0 && hasOrigin
            ? "Worker is configured for upstream forwarding."
            : !hasOrigin
              ? "Worker is missing ALLOWED_ORIGIN and is not browser-safe."
              : "Worker is running, but no complete upstream provider configuration is present.",
      },
      env,
    );
  }

  if (request.method === "GET" && url.pathname === "/api/providers/status") {
    return json(buildStatusResponse(env), env);
  }

  if (request.method === "POST" && url.pathname === "/api/generate") {
    const payload = generateRequestSchema.parse(await request.json()) as CloudBridgeGenerateRequest;
    const sanitized = sanitizeRequest(payload);
    const result = await forwardToUpstreamProvider(sanitized, env);
    return json(result, env, { status: result.status === "accepted" ? 202 : 503 });
  }

  return json(
    {
      error: "not_found",
      message: "Unsupported route for the Cloudflare Worker bridge.",
    },
    env,
    { status: 404 },
  );
}

export default {
  fetch(request: Request, env: CloudBridgeEnv) {
    return handleBridgeRequest(request, env);
  },
};
