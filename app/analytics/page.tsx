import { MainLayout } from "@/components/layout/main-layout";

export default function AnalyticsPage() {
    return (
        <MainLayout>
            <div className="flex flex-col gap-6">
                <h1 className="text-3xl font-bold">Analytics</h1>
                <p>This is the analytics page. You can add your analytics charts and data here.</p>
            </div>
        </MainLayout>
    );
}
