import { MainLayout } from "@/components/layout/main-layout";

export default function DashboardPage() {
    return (
        <MainLayout>
            <div className="flex flex-col gap-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p>This is the dashboard page. You can add your dashboard content here.</p>
            </div>
        </MainLayout>
    );
}
