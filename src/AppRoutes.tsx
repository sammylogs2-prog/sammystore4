import { ReactNode } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/features/dashboard/layout/DashboardLayout';
import { PublicLayout } from '@/features/marketplace/layout/PublicLayout';
import { AdminLayout } from '@/features/admin/layout/AdminLayout';
import { useRouteLayout } from '@/config/useRouteLayout';
import { ALL_ROUTES, AllRouteConfig } from '@/config/routes';
import { useAuth } from '@/lib/auth';

/**
 * Determines which layout wrapper to use based on route type and current path
 */
function getLayoutWrapper(component: ReactNode, layoutType: string): ReactNode {
  if (layoutType === 'dashboard') {
    return <DashboardLayout>{component}</DashboardLayout>;
  }
  if (layoutType === 'admin') {
    return <AdminLayout>{component}</AdminLayout>;
  }
  // marketplace is default
  return <PublicLayout>{component}</PublicLayout>;
}

/**
 * Type guard to check if a route requires authentication
 */
function requiresAuth(route: AllRouteConfig): boolean {
  return (route as any).requiresAuth === true;
}

/**
 * Type guard to check if a route requires admin role
 */
function requiresAdmin(route: AllRouteConfig): boolean {
  return (route as any).requiresAdmin === true;
}

export default function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, isAdmin } = useAuth();
  const layoutType = useRouteLayout(location.pathname);

  return (
    <Routes>
      {ALL_ROUTES.map((route) => {
        // Handle protected routes
        if (requiresAdmin(route)) {
          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                loading ? null : !user ? (
                  getLayoutWrapper(
                    <div className="flex items-center justify-center min-h-screen">Please log in</div>,
                    'marketplace'
                  )
                ) : !isAdmin ? (
                  getLayoutWrapper(
                    <div className="flex items-center justify-center min-h-screen">Admin access required</div>,
                    'marketplace'
                  )
                ) : (
                  getLayoutWrapper(route.component, layoutType)
                )
              }
            />
          );
        }

        if (requiresAuth(route)) {
          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                loading ? null : !user ? (
                  getLayoutWrapper(
                    <div className="flex items-center justify-center min-h-screen">Please log in</div>,
                    'marketplace'
                  )
                ) : (
                  getLayoutWrapper(route.component, layoutType)
                )
              }
            />
          );
        }

        // Public routes
        return (
          <Route
            key={route.path}
            path={route.path}
            element={getLayoutWrapper(route.component, layoutType)}
          />
        );
      })}

      {/* 404 fallback */}
      <Route
        path="*"
        element={
          <PublicLayout>
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-brand-navy mb-2">404</h1>
                <p className="text-muted-foreground mb-4">Page not found</p>
              </div>
            </div>
          </PublicLayout>
        }
      />
    </Routes>
  );
}
