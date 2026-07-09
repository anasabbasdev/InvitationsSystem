import { createSupabaseAdminClient } from "@/lib/supabase/create-admin-client";

/** Generic result shape returned by the Postgres RPC functions (jsonb). */
export type RpcResult<T extends Record<string, unknown> = Record<string, unknown>> =
  | ({ ok: true } & T)
  | { ok: false; code: string; message: string; [key: string]: unknown };

export async function callRpc<T extends Record<string, unknown> = Record<string, unknown>>(
  fn: string,
  args: Record<string, unknown>
): Promise<RpcResult<T>> {
  const { data, error } = await createSupabaseAdminClient().rpc(fn, args);
  if (error) throw error;
  return data as RpcResult<T>;
}

export class RpcError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "RpcError";
  }
}

/** Throws RpcError when the RPC returned ok:false — call sites can catch by `.code`. */
export function unwrapRpc<T extends Record<string, unknown>>(
  result: RpcResult<T>
): T {
  if (!result.ok) {
    throw new RpcError(result.message, result.code, result);
  }
  return result as T;
}
