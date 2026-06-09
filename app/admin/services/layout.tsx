import ProtectedRoute from "@/components/protected-route";
import AdminSidebar from "@/components/admin-sidebar";
import AdminHeader from "@/components/admin-header";

export default function AdminServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-50">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <div className="w-full">
            <AdminHeader />
            <main className="flex-1 p-8">{children}</main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
