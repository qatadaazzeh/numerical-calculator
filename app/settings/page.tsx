"use client";

import { useTheme } from "next-themes";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/context/settings-context";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const { decimalPlaces, setDecimalPlaces, showIterationSteps, setShowIterationSteps } = useSettings(); return (
        <MainLayout>
            <div className="flex flex-col gap-6">
                <div className="space-y-2 pb-2">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 dark:from-purple-400 dark:to-orange-400 bg-clip-text text-transparent">
                        Settings
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Customize the application appearance and behavior
                    </p>
                </div>

                <Card className="transition-all duration-300 border-l-4 border-l-purple-500 dark:border-l-purple-600">
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>Customize the application appearance</CardDescription>
                    </CardHeader>                    <CardContent className="grid gap-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <Label htmlFor="theme" className="text-base">Theme</Label>
                                <p className="text-sm text-muted-foreground">
                                    Select your preferred theme mode
                                </p>
                            </div>
                            <Select
                                value={theme || "system"}
                                onValueChange={(value) => setTheme(value)}
                            >
                                <SelectTrigger id="theme" className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Select theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="light">Light</SelectItem>
                                        <SelectItem value="dark">Dark</SelectItem>
                                        <SelectItem value="system">System</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <Separator />                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <Label htmlFor="decimalPlaces" className="text-base">Decimal Places</Label>
                                <p className="text-sm text-muted-foreground">
                                    Number of decimal places to display in results
                                </p>
                            </div>
                            <Select
                                value={decimalPlaces.toString()}
                                onValueChange={(value) => setDecimalPlaces(parseInt(value, 10))}
                            >
                                <SelectTrigger id="decimalPlaces" className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Select precision" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="2">2 places</SelectItem>
                                        <SelectItem value="4">4 places</SelectItem>
                                        <SelectItem value="6">6 places</SelectItem>
                                        <SelectItem value="8">8 places</SelectItem>
                                        <SelectItem value="10">10 places</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <div className="text-sm text-muted-foreground mt-1 ml-auto">
                                Example: {(Math.PI).toFixed(decimalPlaces)}
                            </div>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="showSteps" className="text-base">Show Iteration Steps</Label>
                                <p className="text-sm text-muted-foreground">
                                    Display intermediate steps in calculations
                                </p>
                            </div>
                            <Switch
                                id="showSteps"
                                checked={showIterationSteps}
                                onCheckedChange={setShowIterationSteps}
                            />
                        </div>
                    </CardContent>
                </Card>                <Card className="transition-all duration-300 border-l-4 border-l-green-500 dark:border-l-green-600">
                    <CardHeader>
                        <CardTitle>Method Selection</CardTitle>
                        <CardDescription>Choose your preferred numerical methods</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="interpolation-method" className="text-base">Interpolation Method</Label>
                                <p className="text-sm text-muted-foreground">
                                    Select your preferred interpolation technique
                                </p>
                            </div>
                            <Select
                                value="divided-difference"
                                onValueChange={() => { }}
                            >
                                <SelectTrigger id="interpolation-method" className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="divided-difference">Divided Difference</SelectItem>
                                        <SelectItem value="lagrange" disabled>Lagrange (Coming soon)</SelectItem>

                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="root-method" className="text-base">Root Finding Method</Label>
                                <p className="text-sm text-muted-foreground">
                                    Select your preferred root-finding technique
                                </p>
                            </div>
                            <Select
                                value="bisection"
                                onValueChange={() => { }}
                            >
                                <SelectTrigger id="root-method" className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="bisection">Bisection</SelectItem>
                                        <SelectItem value="newton" disabled>Newton-Raphson (Coming soon)</SelectItem>
                                        <SelectItem value="secant" disabled>Secant (Coming soon)</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
                <Card className="transition-all duration-300 border-l-4 border-l-blue-500 dark:border-l-blue-600">
                    <CardHeader>
                        <CardTitle>About</CardTitle>
                        <CardDescription>Information about this application</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                            <div>
                                <p className="font-semibold text-lg">
                                    Numerical Methods Calculator
                                </p>
                                <div className="bg-muted/40 text-xs inline-block px-2 py-1 rounded mt-1">Version 1.0.0</div>
                                <p className="mt-3 text-sm">
                                    Created for educational purposes to demonstrate numerical methods in action.
                                    This application provides interactive tools for divided difference interpolation
                                    and the bisection method for finding roots of equations.
                                </p>
                            </div>
                            <div className="bg-muted/30 p-4 rounded-lg">
                                <h3 className="font-semibold mb-3">Contact Information:</h3>
                                <ul className="space-y-3">
                                    <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                        <div className="font-medium">Qatada Azzeh</div>
                                        <div className="text-sm text-muted-foreground break-all">202311042@students.asu.edu.jo</div>
                                    </li>
                                    <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                        <div className="font-medium">Mohammad Alnaser</div>
                                        <div className="text-sm text-muted-foreground break-all">202311319@students.asu.edu.jo</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
