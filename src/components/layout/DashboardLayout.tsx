import { AppSidebar } from './AppSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function DashboardLayout({ children, fullWidth = false }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 overflow-auto flex flex-col">
        <div className={fullWidth ? "flex-1 h-full" : "p-6 lg:p-8"}>
          {children}
        </div>
      </main>
    </div>
  );
}
