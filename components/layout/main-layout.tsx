"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";

interface MainLayoutProps {
    children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col transition-colors duration-300 ease-in-out">
            <div className="flex flex-1">
                <Sidebar />
                <div className="flex flex-1 flex-col">
                    <TopNav />
                    <main className="flex-1 p-3 sm:p-4 md:p-6 transition-colors duration-300 ease-in-out overflow-x-auto">
                        <div className="max-w-7xl mx-auto w-full">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
