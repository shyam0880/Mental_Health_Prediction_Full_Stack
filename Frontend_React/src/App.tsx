import React, { Suspense } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/lib/theme";
import Loading from "@/components/loading";
import Home from "@/pages/home";
import Checkup from "@/pages/checkup";
import Insights from "@/pages/insights";
import Chat from "@/pages/chat";
import DataUpload from "@/pages/data-upload";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  const isChatPage = location === "/chat";
  const isInsightsPage = location === "/insights";

  return (
    <>
      <Navbar />
      <div
        className={isChatPage ? "flex flex-col" : ""}
        style={isChatPage ? { height: "calc(100vh - 64px)", overflow: "hidden" } : {}}
      >
        <Suspense fallback={<Loading message="Loading page..." />}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/checkup" component={Checkup} />
            <Route path="/insights" component={Insights} />
            <Route path="/chat" component={Chat} />
            <Route path="/upload" component={DataUpload} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </div>
      {/* Footer hidden on chat (full-screen) and insights (full-screen dark) */}
      {!isChatPage && !isInsightsPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
