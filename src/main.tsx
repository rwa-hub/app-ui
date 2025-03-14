
import { ThemeProvider } from "@/providers/ThemeProvider"
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { config } from "./wagmi"
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
