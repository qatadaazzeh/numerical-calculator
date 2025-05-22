"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";


import { Menu, Home, LayoutDashboard, Settings, Users, BarChart3 } from "lucide-react";


const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Divided Difference", href: "/divided-difference", icon: LayoutDashboard },
    { name: "Bisection", href: "/bisection", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export function Sidebar({ className }: SidebarNavProps) {
    const [open, setOpen] = useState(false);

    return (
        <>

            <Sheet open={open} onOpenChange={setOpen}>                <SheetTrigger asChild className="lg:hidden fixed left-2 bottom-6 z-50">
                <Button
                    variant="outline"
                    size="icon"
                    className="lg:hidden rounded-full h-12 w-12 shadow-md hover:bg-accent hover:text-accent-foreground transition-all duration-300 border-2"
                >
                    <Menu className="h-5 w-5 transition-transform duration-200 ease-in-out hover:rotate-90" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
                <SheetContent side="left" className="w-[270px] sm:w-[300px] pr-0">
                    <MobileNav setOpen={setOpen} />
                </SheetContent>
            </Sheet>


            <nav
                className={cn(
                    "hidden lg:flex flex-col w-[240px] min-w-[240px] h-screen border-r bg-background px-2 py-4",
                    className
                )}
            >
                <div className="mb-4 px-4">
                    <h2 className="text-xl font-bold">Numerical Methods</h2>
                </div>
                <Separator className="mb-4" />
                <DesktopNav />
            </nav>
        </>
    );
}


function DesktopNav() {
    return (
        <div className="space-y-1 py-2">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",

                        "transparent"
                    )}
                >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                </Link>
            ))}


        </div>
    );
}


function MobileNav({ setOpen }: { setOpen: (open: boolean) => void }) {
    return (
        <div className="flex h-full flex-col">
            <div className="px-6 py-5">
                <h2 className="text-xl font-bold">Numerical Methods</h2>
                <p className="text-sm text-muted-foreground mt-1">Numerical analysis tools</p>
            </div>
            <Separator />
            <ScrollArea className="flex-1">
                <div className="space-y-1 p-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)} className={cn(
                                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",

                                "transparent"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    ))}
                </div>
            </ScrollArea>

        </div>
    );
}
