import AdminAppDetailPageContent from "./AdminAppDetailPageContent";

interface PageProps {
  params: Promise<{ appId: string }>;
}

const AdminAppDetailPage = async ({ params }: PageProps) => {
  const { appId } = await params;
  return <AdminAppDetailPageContent appId={appId} />;
};

export default AdminAppDetailPage;
