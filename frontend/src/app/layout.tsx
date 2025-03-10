"use client";

import type { Metadata } from "next";
import { Lato } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { QueryClientProvider } from "@/components/providers/query-client-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Provider, useSelector } from "react-redux";
import store from "@/lib/store/store";
import { ApolloProvider } from "@apollo/client";
import { createApolloClient } from "@/lib/apollo/apollo-client";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const ApolloWrapper = ({ children }: { children: React.ReactNode }) => {
  const accessToken = useSelector((state: any) => state?.auth?.accessToken || ""); // <-- Prevents error
  
  const client = createApolloClient(() => accessToken);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lato.className}`} suppressHydrationWarning>
      <body className={"overflow-hidden"}>
        <NextTopLoader showSpinner={false} />
        <NuqsAdapter>
          <Provider store={store}>
            {/* Now Redux is available before useSelector is called */}
            <ApolloWrapper>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="light"
                  enableSystem
                  disableTransitionOnChange
                >
                  <QueryClientProvider>
               
                      <Toaster
                        richColors
                        position="bottom-center"
                        duration={2000}
                      />
                      <TooltipProvider delayDuration={200}>
                        {children}
                      </TooltipProvider>
    
                  </QueryClientProvider>
                </ThemeProvider>
            </ApolloWrapper>
          </Provider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
