import { lazy } from "react";

export const publicRoutes = [
  {
    name: "BridgeOrdinals",
    path: `/bridge`,
    component: lazy(() => import("../pages/bridgeOrdinals")),
  },
  {
    name: "Borrowing",
    path: "/borrowing",
    component: lazy(() => import("../pages/borrowing")),
  },
  {
    name: "Page 404",
    path: "*",
    component: lazy(() => import("../pages/404")),
  },
];
