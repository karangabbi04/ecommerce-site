import AdminSidebarLayout from "@/components/admin/layout";


export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminSidebarLayout />
      {children}
    </>
  );
}