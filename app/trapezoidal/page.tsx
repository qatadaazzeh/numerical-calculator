"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import * as math from 'mathjs';
import { useSettings } from "@/context/settings-context";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface TrapezoidalStep {
    n: number;
    h: number;
    approximation: number;
    error: number;
}

export default function TrapezoidalPage() {
    const { decimalPlaces, showIterationSteps } = useSettings();
    const [equation, setEquation] = useState("x^2");
    const [a, setA] = useState("0");
    const [b, setB] = useState("2");
    const [n, setN] = useState("4");
    const [result, setResult] = useState<number | null>(null);
    const [steps, setSteps] = useState<TrapezoidalStep[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [exactValue, setExactValue] = useState<number | null>(null);



    const formatNumber = (num: number): string => {
        return num.toFixed(decimalPlaces);
    }; const calculateH = (a: number, b: number, n: number): number => {
        return (b - a) / n;
    }

    const calculateTrapezoidalRule = (a: number, b: number, n: number): number => {
        const h = calculateH(a, b, n);
        let sum = 0;


        sum += evaluateExpression(equation, a);
        sum += evaluateExpression(equation, b);


        for (let i = 1; i < n; i++) {
            const x = a + i * h;
            sum += 2 * evaluateExpression(equation, x);
        }

        return (h / 2) * sum;
    }

    const getTrapezoidalPoints = (): { x: number; y: number }[] => {
        if (!equation || isNaN(parseFloat(a)) || isNaN(parseFloat(b)) || isNaN(parseInt(n))) {
            return [];
        }

        const aVal = parseFloat(a);
        const bVal = parseFloat(b);
        const nVal = parseInt(n);
        const h = calculateH(aVal, bVal, nVal);
        const points = [];

        for (let i = 0; i <= nVal; i++) {
            const x = aVal + i * h;
            const y = evaluateExpression(equation, x);
            points.push({ x, y });
        }

        return points;
    }


    const generateFunctionPoints = () => {
        if (!equation) return [];

        try {
            const aVal = parseFloat(a) || -10;
            const bVal = parseFloat(b) || 10;
            const range = Math.abs(bVal - aVal);
            const minX = Math.min(aVal, bVal) - range * 0.5;
            const maxX = Math.max(aVal, bVal) + range * 0.5;
            const step = (maxX - minX) / 200;

            const functionPoints = [];

            for (let x = minX; x <= maxX; x += step) {
                try {
                    const y = evaluateExpression(equation, x);
                    if (isFinite(y)) {
                        functionPoints.push({ x: x, y: y });
                    }
                } catch {

                }
            }

            return functionPoints;
        } catch {
            return [];
        }
    }; const evaluateExpression = (expr: string, x: number): number => {
        try {
            const scope = { x: x };
            return math.evaluate(expr, scope);
        } catch (error) {
            throw new Error("Invalid equation format");
        }
    };

    const calculateExactIntegral = (expr: string, a: number, b: number): number => {

        const cleanExpr = expr.replace(/\s/g, '').toLowerCase();
        if (cleanExpr === 'x') {
            return (b * b / 2) - (a * a / 2);
        } else if (cleanExpr === 'x^2') {
            return (b * b * b / 3) - (a * a * a / 3);
        } else if (cleanExpr === 'x^3') {
            return (b * b * b * b / 4) - (a * a * a * a / 4);
        } else if (cleanExpr === '1' || cleanExpr === '') {
            return b - a;
        } else if (cleanExpr.match(/^\d+$/)) {
            const constant = parseFloat(cleanExpr);
            return constant * (b - a);
        } else if (cleanExpr.match(/^\d*x$/)) {
            const coefficient = cleanExpr === 'x' ? 1 : parseFloat(cleanExpr.replace('x', ''));
            return coefficient * (b * b / 2 - a * a / 2);
        } else if (cleanExpr.match(/^\d*x\^2$/)) {
            const coefficient = parseFloat(cleanExpr.replace('x^2', '') || '1');
            return coefficient * (b * b * b / 3 - a * a * a / 3);
        }


        throw new Error("Cannot compute exact integral for this function");
    }; const calculateTrapezoidal = () => {
        try {
            const aVal = parseFloat(a);
            const bVal = parseFloat(b);
            const nVal = parseInt(n);

            if (isNaN(aVal) || isNaN(bVal) || isNaN(nVal)) {
                setErrorMessage("Please enter valid numeric values");
                return;
            }

            if (nVal <= 0) {
                setErrorMessage("Number of intervals must be positive");
                return;
            }

            if (aVal >= bVal) {
                setErrorMessage("Lower bound must be less than upper bound");
                return;
            }

            setErrorMessage(null);

            const trapezoidalSteps: TrapezoidalStep[] = [];
            let previousApproximation = 0;


            for (let currentN = 2; currentN <= nVal; currentN += 2) {
                const approximation = calculateTrapezoidalRule(aVal, bVal, currentN);
                const error = currentN > 2 ? Math.abs(approximation - previousApproximation) : 0;
                const h = calculateH(aVal, bVal, currentN);

                trapezoidalSteps.push({
                    n: currentN,
                    h: h,
                    approximation: approximation,
                    error: error
                });

                previousApproximation = approximation;
            }


            if (nVal % 2 !== 0 || !trapezoidalSteps.find(step => step.n === nVal)) {
                const approximation = calculateTrapezoidalRule(aVal, bVal, nVal);
                const error = trapezoidalSteps.length > 0 ?
                    Math.abs(approximation - trapezoidalSteps[trapezoidalSteps.length - 1].approximation) : 0;
                const h = calculateH(aVal, bVal, nVal);

                trapezoidalSteps.push({
                    n: nVal,
                    h: h,
                    approximation: approximation,
                    error: error
                });
            }

            setResult(trapezoidalSteps[trapezoidalSteps.length - 1].approximation);
            setSteps(trapezoidalSteps);
            try {
                const exactVal = calculateExactIntegral(equation, aVal, bVal);
                setExactValue(exactVal);
            } catch {
                setExactValue(null);
            }

        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("An unknown error occurred");
            }
        }
    }; return (
        <MainLayout>
            <div className="flex flex-col gap-6">                <div className="space-y-2 pb-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    Trapezoidal Rule
                </h1>
                <p className="text-muted-foreground text-sm">
                    Numerical integration using trapezoidal approximation
                </p>
            </div>

                <Card>                    <CardHeader>
                    <CardTitle>Input Parameters</CardTitle>
                    <CardDescription>Enter the function and integration bounds</CardDescription>
                </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">                            <div className="grid gap-2">
                            <label htmlFor="equation">Function f(x):</label>
                            <Input
                                id="equation"
                                value={equation}
                                onChange={(e) => setEquation(e.target.value)}
                                placeholder="e.g., x^2"
                            />
                            <p className="text-sm text-muted-foreground">
                                Use x as variable. Powered by Math.js - supports functions like sin(x), cos(x), sqrt(x), etc.
                            </p>
                        </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                                <div className="grid gap-2">
                                    <label htmlFor="n">Number of intervals (n):</label>
                                    <Input
                                        id="n"
                                        type="number"
                                        value={n}
                                        onChange={(e) => setN(e.target.value)}
                                        min="1"
                                    />
                                </div>
                            </div>                            <Button
                                onClick={calculateTrapezoidal}
                                className="mt-2 w-full sm:w-auto relative overflow-hidden group"
                            >
                                <span className="mr-1">∫</span> Calculate Integral
                                <span className="absolute inset-0 flex items-center justify-center bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Calculate Integral
                                </span>
                            </Button>

                            {errorMessage && (
                                <div className="p-3 border border-red-300 bg-red-50 dark:bg-red-900/20 rounded-md mt-2 text-red-800 dark:text-red-200">
                                    {errorMessage}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>                {result !== null && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Result</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="p-3 rounded-md bg-muted/30">
                                    <div className="text-sm text-muted-foreground">Approximation:</div>
                                    <div className="font-bold text-lg break-all">{formatNumber(result)}</div>
                                </div>
                                <div className="p-3 rounded-md bg-muted/30">
                                    <div className="text-sm text-muted-foreground">Step size (h):</div>
                                    <div className="font-bold break-all">{formatNumber(calculateH(parseFloat(a), parseFloat(b), parseInt(n)))}</div>
                                </div>
                                {exactValue !== null && (
                                    <>
                                        <div className="p-3 rounded-md bg-muted/30">
                                            <div className="text-sm text-muted-foreground">Exact value:</div>
                                            <div className="font-bold break-all">{formatNumber(exactValue)}</div>
                                        </div>
                                        <div className="p-3 rounded-md bg-muted/30">
                                            <div className="text-sm text-muted-foreground">Absolute error:</div>
                                            <div className="font-bold break-all">{formatNumber(Math.abs(result - exactValue))}</div>
                                        </div>
                                    </>
                                )}
                                {exactValue === null && (
                                    <div className="p-3 rounded-md bg-muted/30">
                                        <div className="text-sm text-muted-foreground">Intervals:</div>
                                        <div className="font-bold">{n}</div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}                {steps.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Convergence Steps</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto rounded-md border">
                                <table className="min-w-full border-collapse">
                                    <thead>
                                        <tr className="bg-muted/50">
                                            <th className="border p-2 text-xs sm:text-sm">n</th>
                                            <th className="border p-2 text-xs sm:text-sm">h</th>
                                            <th className="border p-2 text-xs sm:text-sm">Approximation</th>
                                            <th className="border p-2 text-xs sm:text-sm">Error</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {steps.map((step, index) => (
                                            <tr key={step.n} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                                                <td className="border p-2 text-xs sm:text-sm">{step.n}</td>
                                                <td className="border p-2 text-xs sm:text-sm">{formatNumber(step.h)}</td>
                                                <td className="border p-2 text-xs sm:text-sm">{formatNumber(step.approximation)}</td>
                                                <td className="border p-2 text-xs sm:text-sm">{index === 0 ? "-" : formatNumber(step.error)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}                {result !== null && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Integration Visualization</CardTitle>
                            <CardDescription>Trapezoidal approximation of the integral</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-96 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            type="number"
                                            dataKey="x"
                                            domain={['dataMin - 0.1', 'dataMax + 0.1']}
                                            tickFormatter={(value) => value.toFixed(1)}
                                        />
                                        <YAxis
                                            domain={['dataMin - 0.5', 'dataMax + 0.5']}
                                            tickFormatter={(value) => value.toFixed(1)}
                                        />
                                        <Tooltip
                                            formatter={(value: number) => [formatNumber(value), "f(x)"]}
                                            labelFormatter={(value) => `x = ${formatNumber(value)}`}
                                        />

                                        <ReferenceLine y={0} stroke="#666" strokeDasharray="2 2" />

                                        <Line
                                            data={generateFunctionPoints()}
                                            type="monotone"
                                            dataKey="y"
                                            stroke="#8884d8"
                                            strokeWidth={2}
                                            dot={false}
                                            name="f(x)"
                                        />
                                        <Line
                                            data={getTrapezoidalPoints()}
                                            type="linear"
                                            dataKey="y"
                                            stroke="#ff7300"
                                            strokeWidth={2}
                                            dot={{ fill: '#ff7300', strokeWidth: 2, r: 4 }}
                                            name="Trapezoidal Approximation"
                                        />
                                        <Line
                                            data={[
                                                { x: parseFloat(a), y: 0 },
                                                { x: parseFloat(b), y: 0 }
                                            ]}
                                            type="monotone"
                                            dataKey="y"
                                            stroke="#82ca9d"
                                            strokeWidth={0}
                                            dot={{ fill: '#82ca9d', strokeWidth: 2, r: 6 }}
                                            connectNulls={false}
                                            name="Integration Bounds"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 text-sm text-muted-foreground">
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-0.5 bg-[#8884d8]"></div>
                                        <span>Original function f(x)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-0.5 bg-[#ff7300]"></div>
                                        <span>Trapezoidal approximation</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#82ca9d]"></div>
                                        <span>Integration bounds [a, b]</span>
                                    </div>
                                </div>
                                <p className="mt-2">
                                    ∫<sub>{a}</sub><sup>{b}</sup> {equation} dx ≈ {formatNumber(result)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </MainLayout>
    );
}
