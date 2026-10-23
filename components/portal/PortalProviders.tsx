"use client";

import React from "react";
import { PortalProvider } from "@/lib/portal-context";

export function PortalProviders({ children }: { children: React.ReactNode }) {
  return <PortalProvider>{children}</PortalProvider>;
}
