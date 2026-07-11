import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { AuthProvider } from "@/components/providers/AuthProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Sidebar for desktop */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main content area */}
        <div className="flex w-0 flex-1 flex-col overflow-hidden">
          <Topbar />

          <main className="relative flex-1 overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
