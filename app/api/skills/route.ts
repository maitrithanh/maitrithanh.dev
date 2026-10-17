import { collectionRoutes } from "@/lib/crud-routes";

export const dynamic = "force-dynamic";

const routes = collectionRoutes("skills", { orderBy: "created_at", ascending: true });
export const GET = routes.GET;
export const POST = routes.POST;
