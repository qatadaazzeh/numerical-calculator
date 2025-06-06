"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettings } from "@/context/settings-context";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

export default function DividedDifferencePage() {
    const { decimalPlaces } = useSettings();
    const [points, setPoints] = useState([
        { x: 0, y: 0 },
        { x: 1, y: 0 },
    ]); const [xValue, setXValue] = useState("");
    const [result, setResult] = useState<number | null>(null);
    const [dividedDifferenceTable, setDividedDifferenceTable] = useState<number[][]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const formatNumber = (num: number): string => {
        return num.toFixed(decimalPlaces);
    };


    const generateInterpolatedPoints = () => {
        if (dividedDifferenceTable.length === 0) return [];

        const xValues = points.map(p => p.x).sort((a, b) => a - b);
        const minX = Math.min(...xValues) - 1;
        const maxX = Math.max(...xValues) + 1;
        const step = (maxX - minX) / 100;

        const interpolatedPoints = [];

        for (let x = minX; x <= maxX; x += step) {
            let interpolatedValue = dividedDifferenceTable[0][0];
            let term = 1;

            for (let i = 1; i < points.length; i++) {
                term *= (x - points[i - 1].x);
                interpolatedValue += term * dividedDifferenceTable[0][i];
            }

            interpolatedPoints.push({ x: x, y: interpolatedValue });
        }

        return interpolatedPoints;
    };

    const addPoint = () => {
        setPoints([...points, { x: 0, y: 0 }]);
    };

    const removePoint = (index: number) => {
        if (points.length > 2) {
            const newPoints = [...points];
            newPoints.splice(index, 1);
            setPoints(newPoints);
        }
    };

    const handlePointChange = (index: number, field: "x" | "y", value: string) => {
        const newValue = value === "" ? 0 : parseFloat(value);
        const newPoints = [...points];
        newPoints[index][field] = newValue;
        setPoints(newPoints);
    }; const calculateDividedDifference = () => {
        try {

            if (points.length < 2) {
                setErrorMessage("At least 2 points are required for interpolation");
                return;
            }


            const xValues = points.map(p => p.x);
            const uniqueXValues = new Set(xValues);
            if (uniqueXValues.size !== xValues.length) {
                setErrorMessage("Duplicate x values are not allowed");
                return;
            }


            for (let i = 0; i < points.length; i++) {
                if (isNaN(points[i].x) || isNaN(points[i].y)) {
                    setErrorMessage(`Invalid values at point ${i + 1}. Please enter valid numbers.`);
                    return;
                }
            }


            if (xValue !== "" && isNaN(parseFloat(xValue))) {
                setErrorMessage("Please enter a valid x value for interpolation");
                return;
            }

            setErrorMessage(null);

            const n = points.length;
            const table: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));


            for (let i = 0; i < n; i++) {
                table[i][0] = points[i].y;
            }


            for (let j = 1; j < n; j++) {
                for (let i = 0; i < n - j; i++) {
                    const denominator = points[i + j].x - points[i].x;
                    if (denominator === 0) {
                        setErrorMessage(`Division by zero: points ${i} and ${i + j} have the same x value`);
                        return;
                    }
                    table[i][j] = (table[i + 1][j - 1] - table[i][j - 1]) / denominator;
                }
            }

            setDividedDifferenceTable(table);


            if (xValue !== "") {
                const x = parseFloat(xValue);
                let interpolatedValue = table[0][0];
                let term = 1;

                for (let i = 1; i < n; i++) {
                    term *= (x - points[i - 1].x);
                    interpolatedValue += term * table[0][i];
                }

                setResult(interpolatedValue);
            }
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("An unexpected error occurred during calculation");
            }
        }
    }; return (
        <MainLayout>
            <div className="flex flex-col gap-6">
                <div className="space-y-2 pb-2">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                        Divided Difference Interpolation
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Polynomial interpolation using Newton's divided difference method
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Input Data Points</CardTitle>
                        <CardDescription>Enter the x and y values for your data points</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">                            <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-1 border rounded-md p-3">
                            {points.map((point, index) => (
                                <div key={index} className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="w-6 text-sm">x<sub>{index}</sub>:</span>
                                        <Input
                                            type="number"
                                            value={point.x}
                                            onChange={(e) => handlePointChange(index, "x", e.target.value)}
                                            className="w-20 sm:w-24 text-sm"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-6 text-sm">y<sub>{index}</sub>:</span>
                                        <Input
                                            type="number"
                                            value={point.y}
                                            onChange={(e) => handlePointChange(index, "y", e.target.value)}
                                            className="w-20 sm:w-24 text-sm"
                                        />
                                    </div>
                                    {points.length > 2 && (
                                        <Button variant="ghost" size="icon" onClick={() => removePoint(index)} className="h-8 w-8">
                                            ×
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                <Button onClick={addPoint} className="w-full sm:w-auto">
                                    <span className="mr-1">+</span> Add Point
                                </Button>
                                <Button variant="outline" onClick={() => setPoints([{ x: 0, y: 0 }, { x: 1, y: 0 }])} className="w-full sm:w-auto">
                                    <span className="mr-1">↺</span> Reset Points
                                </Button>
                            </div>


                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Calculate</CardTitle>
                        <CardDescription>Enter a value of x to interpolate</CardDescription>
                    </CardHeader>
                    <CardContent>                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-sm sm:text-base">x:</span>
                            <Input
                                type="number"
                                value={xValue}
                                onChange={(e) => setXValue(e.target.value)}
                                className="w-full sm:w-40"
                                placeholder="Value to interpolate"
                            />
                        </div>                            <Button
                            onClick={calculateDividedDifference}
                            className="w-full sm:w-auto relative overflow-hidden group"
                        >
                            <span className="mr-1">→</span> Calculate Interpolation
                            <span className="absolute inset-0 flex items-center justify-center bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Calculate Value
                            </span>                        </Button>
                    </div>

                        {errorMessage && (
                            <div className="mt-4 p-4 border border-red-300 rounded-lg bg-red-50 dark:bg-red-950/20 dark:border-red-800">
                                <div className="text-sm text-red-600 dark:text-red-400">{errorMessage}</div>
                            </div>
                        )}

                        {result !== null && (
                            <div className="mt-4 p-4 border rounded-lg bg-muted/30">
                                <div className="text-sm text-muted-foreground mb-1">Interpolated value:</div>
                                <p className="font-bold text-lg break-all">{formatNumber(result)}</p>
                            </div>
                        )}

                        {dividedDifferenceTable.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-2">Divided Difference Table</h3>                                <div className="overflow-x-auto rounded-md border">
                                    <table className="min-w-full border-collapse">
                                        <thead>
                                            <tr className="bg-muted/50">
                                                <th className="border p-2 text-xs sm:text-sm">i</th>
                                                <th className="border p-2 text-xs sm:text-sm">x</th>
                                                <th className="border p-2 text-xs sm:text-sm">f[x]</th>
                                                {Array.from({ length: points.length - 1 }, (_, i) => (
                                                    <th key={i} className="border p-2 text-xs sm:text-sm whitespace-nowrap">
                                                        f[x<sub>i</sub>,...,x<sub>i+{i + 1}</sub>]
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {points.map((point, i) => (
                                                <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                                                    <td className="border p-2 text-xs sm:text-sm">{i}</td>
                                                    <td className="border p-2 text-xs sm:text-sm">{point.x}</td>
                                                    {Array.from({ length: Math.min(i + 1, points.length) }, (_, j) => (<td key={j} className="border p-2 text-xs sm:text-sm">
                                                        {j < dividedDifferenceTable[i]?.length ?
                                                            formatNumber(dividedDifferenceTable[i][j]) : ""}
                                                    </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>                            </div>
                        )}

                        {dividedDifferenceTable.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-2">Interpolation Graph</h3>
                                <div className="h-96 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                type="number"
                                                dataKey="x"
                                                domain={['dataMin - 1', 'dataMax + 1']}
                                                tickFormatter={(value) => value.toFixed(1)}
                                            />
                                            <YAxis
                                                domain={['dataMin - 1', 'dataMax + 1']}
                                                tickFormatter={(value) => value.toFixed(1)}
                                            />
                                            <Tooltip
                                                formatter={(value: number) => [formatNumber(value), "Interpolated"]}
                                                labelFormatter={(value) => `x = ${formatNumber(value)}`}
                                            />

                                            <Line
                                                data={generateInterpolatedPoints()}
                                                type="monotone"
                                                dataKey="y"
                                                stroke="#8884d8"
                                                strokeWidth={2}
                                                dot={false}
                                                name="Interpolated Polynomial"
                                            />
                                            <Line
                                                data={points}
                                                type="monotone"
                                                dataKey="y"
                                                stroke="#82ca9d"
                                                strokeWidth={0}
                                                dot={{ fill: '#82ca9d', strokeWidth: 2, r: 6 }}
                                                connectNulls={false}
                                                name="Data Points"
                                            />
                                            {result !== null && xValue !== "" && (
                                                <Line
                                                    data={[{ x: parseFloat(xValue), y: result }]}
                                                    type="monotone"
                                                    dataKey="y"
                                                    stroke="#ff7300"
                                                    strokeWidth={0}
                                                    dot={{ fill: '#ff7300', strokeWidth: 2, r: 8 }}
                                                    connectNulls={false}
                                                    name="Interpolated Point"
                                                />
                                            )}
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
