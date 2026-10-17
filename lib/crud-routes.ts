import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { create, getById, list, remove, update, type TableName } from "@/lib/supabase/api";

const fail = (e: unknown, fallback: string) =>
  NextResponse.json({ error: e instanceof Error ? e.message : fallback }, { status: 400 });

export function collectionRoutes(table: TableName, options?: { orderBy?: string; ascending?: boolean }) {
  return {
    GET: async () => NextResponse.json(await list(table, options)),
    POST: async (request: Request) => {
      const denied = await requireAdmin();
      if (denied) return denied;
      try {
        return NextResponse.json(await create(table, await request.json()));
      } catch (e) {
        return fail(e, "Create failed");
      }
    },
  };
}

export function itemRoutes(table: TableName) {
  return {
    GET: async (_: Request, { params }: { params: Promise<{ id: string }> }) =>
      NextResponse.json(await getById(table, (await params).id)),
    PUT: async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
      const denied = await requireAdmin();
      if (denied) return denied;
      try {
        return NextResponse.json(await update(table, (await params).id, await request.json()));
      } catch (e) {
        return fail(e, "Update failed");
      }
    },
    DELETE: async (_: Request, { params }: { params: Promise<{ id: string }> }) => {
      const denied = await requireAdmin();
      if (denied) return denied;
      await remove(table, (await params).id);
      return NextResponse.json({ ok: true });
    },
  };
}
