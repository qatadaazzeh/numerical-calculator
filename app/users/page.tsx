import { MainLayout } from "@/components/layout/main-layout";

export default function UsersPage() {
    return (
        <MainLayout>
            <div className="flex flex-col gap-6">
                <h1 className="text-3xl font-bold">Users</h1>
                <p>This is the users page. You can add your user management interface here.</p>
            </div>
        </MainLayout>
    );
}
