import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "worker" | "owner";
}

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const basePath = role === "owner" ? "/owner/dashboard" : "/worker/dashboard";
  const showBack = location.pathname !== basePath;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role={role} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border/50 bg-card px-4 sticky top-0 z-10">
            <SidebarTrigger className="mr-4" />
            {showBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="mr-2 gap-1 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            <span className="text-sm text-muted-foreground">
              {role === "owner" ? "Owner Panel" : "Worker Panel"}
            </span>
          </header>
          <main className="flex-1 overflow-auto bg-surface relative">
            <div className="max-w-7xl mx-auto px-6 py-6 w-full h-full relative">
              <PageTransition>
                {children}
              </PageTransition>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
