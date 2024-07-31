import { lazy } from "react";

export const publicRoutes = [
  {
    name: "BridgeOrdinals",
    path: `/bridge`,
    component: lazy(() => import("../pages/bridgeOrdinals")),
  },
  {
    name: "Page 404",
    path: "*",
    component: lazy(() => import("../pages/404")),
  },
];
