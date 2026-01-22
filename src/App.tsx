import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import MarketWatch from "./pages/MarketWatch";
import Stocks from "./pages/Stocks";
import CryptoPage from "./pages/Crypto";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

// Public route wrapper (redirects to dashboard if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

import { PublicLayout } from "@/components/layout/PublicLayout";
import { PublicAssetBrowser } from "@/components/market/PublicAssetBrowser";
import NewsPage from "./pages/News";

// ... existing imports

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={
        <PublicRoute>
          <Auth />
        </PublicRoute>
      }
      />

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

      <Route path="/news" element={<NewsPage />} />

      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Index />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/market"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MarketWatch />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/stocks"
        element={
          <ProtectedRoute>
            <Stocks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/crypto"
        element={
          <ProtectedRoute>
            <CryptoPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/alerts"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Alerts />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

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
