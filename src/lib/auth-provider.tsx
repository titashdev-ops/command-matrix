import type { ReactNode } from "react";

/** Passthrough mount point in the document shell. This app has no auth. */
export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
