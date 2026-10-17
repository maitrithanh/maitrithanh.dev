import { itemRoutes } from "@/lib/crud-routes";

export const dynamic = "force-dynamic";

const routes = itemRoutes("blog_posts");
export const GET = routes.GET;
export const PUT = routes.PUT;
export const DELETE = routes.DELETE;
