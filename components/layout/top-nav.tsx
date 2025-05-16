"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Icons
import { Settings, User, LogOut } from "lucide-react";

export function TopNav() {
    return (
        <header className="sticky top-0 z-10 w-full border-b bg-background px-3 sm:px-4 py-2 sm:py-3 transition-colors duration-300">
            <div className="flex h-10 items-center justify-between max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2 lg:hidden">
                    <Link href="/" className="hover:opacity-80 transition-opacity">
                        <h2 className="text-base sm:text-xl font-bold">Numerical Methods</h2>
                    </Link>
                </div>                <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
                    <nav className="flex items-center gap-1">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                                    <User className="h-4 w-4" />
                                    <span className="sr-only">User menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Support</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <a href="mailto:202311042@students.asu.edu.jo" className="flex items-center gap-2">
                                        Contact Support
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <a href="https://github.com/qatadaazzeh" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                        GitHub Repository
                                    </a>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="flex items-center mr-2">
                            <Link href="/settings" className="p-2 rounded-md hover:bg-accent transition-colors">
                                <Settings className="h-5 w-5" />
                            </Link>
                        </div>
                        <ThemeToggle />
                    </nav>
                </div>
            </div>
        </header>
    );
}
