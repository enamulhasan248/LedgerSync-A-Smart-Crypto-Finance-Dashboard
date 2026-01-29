import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Contexts & Layouts
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PublicLayout } from "@/components/layout/PublicLayout";

// Components & Pages
import { PublicAssetBrowser } from "@/components/market/PublicAssetBrowser";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import MarketWatch from "./pages/MarketWatch";
import Stocks from "./pages/Stocks";
import CryptoPage from "./pages/Crypto";
import NewsPage from "./pages/News";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// --- 1. Route Wrappers ---

// Protected: Only accessible if logged in
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

// Public: Only accessible if NOT logged in (e.g., Login page)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

// --- 2. Utilities ---

function PageTitleUpdater() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = "LedgerSync";

    if (path === "/") title = "LedgerSync - Home";
    else if (path === "/auth") title = "LedgerSync - Login";
    else if (path === "/stocks") title = "LedgerSync - Stocks";
    else if (path === "/crypto") title = "LedgerSync - Crypto";
    else if (path === "/news") title = "LedgerSync - News";
    else if (path === "/dashboard") title = "LedgerSync - Dashboard";
    else if (path === "/dashboard/market") title = "LedgerSync - Market Watch";
    else if (path === "/dashboard/stocks") title = "LedgerSync - My Stocks";
    else if (path === "/dashboard/crypto") title = "LedgerSync - My Crypto";
    else if (path === "/dashboard/alerts") title = "LedgerSync - Alerts";
    else if (path === "/dashboard/settings") title = "LedgerSync - Settings";

    document.title = title;
  }, [location]);

  return null;
}

// --- 3. Main Routes ---

function AppRoutes() {
  return (
    <>
      <PageTitleUpdater />
      <Routes>
        {/* === Public Pages === */}
        <Route path="/" element={<Landing />} />

        <Route path="/auth" element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        } />

        <Route path="/stocks" element={
          <PublicLayout>
            <PublicAssetBrowser type="STOCKS" title="Stock Market" />
          </PublicLayout>
        } />

        <Route path="/crypto" element={
          <PublicLayout>
            <PublicAssetBrowser type="CRYPTO" title="Crypto Market" />
          </PublicLayout>
        } />

        <Route path="/news" element={
          <PublicLayout>
            <NewsPage />
          </PublicLayout>
        } />

        {/* === Protected Dashboard Pages === */}
        {/* Note: All these pages are wrapped in DashboardLayout to keep the sidebar visible */}

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Index />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/dashboard/market" element={
          <ProtectedRoute>
            <DashboardLayout>
              <MarketWatch />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/dashboard/stocks" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Stocks />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/dashboard/crypto" element={
          <ProtectedRoute>
            <DashboardLayout>
              <CryptoPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/dashboard/alerts" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Alerts />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/dashboard/settings" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

// --- 4. App Entry Point ---

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;