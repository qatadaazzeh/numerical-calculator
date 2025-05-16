"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import * as math from 'mathjs';

interface BisectionStep {
    iteration: number;
    a: number;
    b: number;
    c: number;
    fa: number;
    fb: number;
    fc: number;
    error: number;
}

export default function BisectionPage() {
    const [equation, setEquation] = useState("x^2-4");
    const [a, setA] = useState("0");
    const [b, setB] = useState("3");
    const [tolerance, setTolerance] = useState("0.0001");
    const [maxIterations, setMaxIterations] = useState("100");
    const [result, setResult] = useState<number | null>(null);
    const [steps, setSteps] = useState<BisectionStep[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Function to evaluate mathematical expressions using mathjs
    const evaluateExpression = (expr: string, x: number): number => {
        try {
            // Create a scope with the x value
            const scope = { x: x };
            // Evaluate the expression with mathjs
            return math.evaluate(expr, scope);
        } catch (error) {
            throw new Error("Invalid equation format");
        }
    };

    const calculateBisection = () => {
        try {
            const aVal = parseFloat(a);
            const bVal = parseFloat(b);
            const tolVal = parseFloat(tolerance);
            const maxIter = parseInt(maxIterations);

            if (isNaN(aVal) || isNaN(bVal) || isNaN(tolVal) || isNaN(maxIter)) {
                setErrorMessage("Please enter valid numeric values");
                return;
            }

            const fa = evaluateExpression(equation, aVal);
            const fb = evaluateExpression(equation, bVal);

            if (fa * fb >= 0) {
                setErrorMessage("Function must have opposite signs at a and b");
                return;
            }

            setErrorMessage(null);

            let left = aVal;
            let right = bVal;
            let mid: number;
            let error = Math.abs(right - left);
            let iter = 0;

            const bisectionSteps: BisectionStep[] = [];

            while (error > tolVal && iter < maxIter) {
                mid = (left + right) / 2;
                const fLeft = evaluateExpression(equation, left);
                const fRight = evaluateExpression(equation, right);
                const fMid = evaluateExpression(equation, mid);

                bisectionSteps.push({
                    iteration: iter,
                    a: left,
                    b: right,
                    c: mid,
                    fa: fLeft,
                    fb: fRight,
                    fc: fMid,
                    error: error
                });

                if (fMid === 0) {
                    break; // Found exact solution
                }

                if (fLeft * fMid < 0) {
                    right = mid;
                } else {
                    left = mid;
                }

                error = Math.abs(right - left);
                iter++;
            }

            // Final iteration
            mid = (left + right) / 2;
            const fLeft = evaluateExpression(equation, left);
            const fRight = evaluateExpression(equation, right);
            const fMid = evaluateExpression(equation, mid);

            bisectionSteps.push({
                iteration: iter,
                a: left,
                b: right,
                c: mid,
                fa: fLeft,
                fb: fRight,
                fc: fMid,
                error: error
            });

            setResult(mid);
            setSteps(bisectionSteps);

        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("An unknown error occurred");
            }
        }
    }; return (
        <MainLayout>
            <div className="flex flex-col gap-6">
                <div className="space-y-2 pb-2">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                        Bisection Method
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Root finding algorithm using interval halving technique
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Input Parameters</CardTitle>
                        <CardDescription>Enter the equation and interval</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="equation">Equation (in terms of x):</label>
                                <Input
                                    id="equation"
                                    value={equation}
                                    onChange={(e) => setEquation(e.target.value)}
                                    placeholder="e.g., x^2-4"
                                />                                <p className="text-sm text-muted-foreground">
                                    Use x as variable. Powered by Math.js - supports functions like sin(x), cos(x), sqrt(x), etc.
                                </p>

                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label htmlFor="a">Lower bound (a):</label>
                                    <Input
                                        id="a"
                                        type="number"
                                        value={a}
                                        onChange={(e) => setA(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="b">Upper bound (b):</label>
                                    <Input
                                        id="b"
                                        type="number"
                                        value={b}
                                        onChange={(e) => setB(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label htmlFor="tolerance">Tolerance:</label>
                                    <Input
                                        id="tolerance"
                                        type="number"
                                        value={tolerance}
                                        onChange={(e) => setTolerance(e.target.value)}
                                        step="0.0001"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="maxIterations">Max Iterations:</label>
                                    <Input
                                        id="maxIterations"
                                        type="number"
                                        value={maxIterations}
                                        onChange={(e) => setMaxIterations(e.target.value)}
                                    />
                                </div>
                            </div>                            <Button
                                onClick={calculateBisection}
                                className="mt-2 w-full sm:w-auto relative overflow-hidden group"
                            >
                                <span className="mr-1">→</span> Calculate
                                <span className="absolute inset-0 flex items-center justify-center bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Calculate Root
                                </span>
                            </Button>

                            {errorMessage && (
                                <div className="p-3 border border-red-300 bg-red-50 dark:bg-red-900/20 rounded-md mt-2 text-red-800 dark:text-red-200">
                                    {errorMessage}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {result !== null && (<Card>
                    <CardHeader>
                        <CardTitle>Result</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2 sm:grid-cols-2">
                            <div className="p-3 rounded-md bg-muted/30">
                                <div className="text-sm text-muted-foreground">Root:</div>
                                <div className="font-bold text-lg break-all">{result}</div>
                            </div>
                            <div className="p-3 rounded-md bg-muted/30">
                                <div className="text-sm text-muted-foreground">Function value:</div>
                                <div className="font-bold break-all">{evaluateExpression(equation, result).toFixed(10)}</div>
                            </div>
                            <div className="p-3 rounded-md bg-muted/30">
                                <div className="text-sm text-muted-foreground">Final error:</div>
                                <div className="font-bold break-all">{steps[steps.length - 1].error.toFixed(10)}</div>
                            </div>
                            <div className="p-3 rounded-md bg-muted/30">
                                <div className="text-sm text-muted-foreground">Iterations:</div>
                                <div className="font-bold">{steps.length - 1}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                )}

                {steps.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Iteration Steps</CardTitle>
                        </CardHeader>
                        <CardContent>                            <div className="overflow-x-auto rounded-md border">
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr className="bg-muted/50">
                                        <th className="border p-2 text-xs sm:text-sm">Iter</th>
                                        <th className="border p-2 text-xs sm:text-sm">a</th>
                                        <th className="border p-2 text-xs sm:text-sm">b</th>
                                        <th className="border p-2 text-xs sm:text-sm">c</th>
                                        <th className="border p-2 text-xs sm:text-sm">f(a)</th>
                                        <th className="border p-2 text-xs sm:text-sm">f(b)</th>
                                        <th className="border p-2 text-xs sm:text-sm">f(c)</th>
                                        <th className="border p-2 text-xs sm:text-sm">Error</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {steps.map((step, index) => (
                                        <tr key={step.iteration} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                                            <td className="border p-2 text-xs sm:text-sm">{step.iteration}</td>
                                            <td className="border p-2 text-xs sm:text-sm">{step.a.toFixed(6)}</td>
                                            <td className="border p-2 text-xs sm:text-sm">{step.b.toFixed(6)}</td>
                                            <td className="border p-2 text-xs sm:text-sm">{step.c.toFixed(6)}</td>
                                            <td className="border p-2 text-xs sm:text-sm">{step.fa.toFixed(6)}</td>
                                            <td className="border p-2 text-xs sm:text-sm">{step.fb.toFixed(6)}</td>
                                            <td className="border p-2 text-xs sm:text-sm">{step.fc.toFixed(6)}</td>
                                            <td className="border p-2 text-xs sm:text-sm">{step.error.toFixed(6)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </MainLayout>
    );
}
