import { collectionRoutes } from "@/lib/crud-routes";

export const dynamic = "force-dynamic";

const routes = collectionRoutes("experiences", { orderBy: "sort_order", ascending: true });
export const GET = routes.GET;
export const POST = routes.POST;
