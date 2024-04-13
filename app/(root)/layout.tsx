import { StreamVideoProvider } from "@/providers/StreamClientProvider";
import React, { ReactElement } from "react";

function RootLayout({ children }: { children: ReactElement }) {
  return (
    <main>
      <StreamVideoProvider> {children}</StreamVideoProvider>
    </main>
  );
}

export default RootLayout;
