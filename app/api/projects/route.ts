import { collectionRoutes } from "@/lib/crud-routes";

export const dynamic = "force-dynamic";

const routes = collectionRoutes("projects", { orderBy: "created_at" });
export const GET = routes.GET;
export const POST = routes.POST;
