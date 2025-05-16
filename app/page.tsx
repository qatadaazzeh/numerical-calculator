import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="space-y-3 pb-4">
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-700 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent leading-tight">
              Numerical Methods <br className="hidden sm:inline" /> Calculator
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-lg">
              Advanced numerical analysis tools for engineering and science with interactive visualizations
            </p>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-base sm:text-lg border-l-4 border-blue-500 dark:border-blue-700 pl-4 py-1">
            Welcome to the Numerical Methods Calculator. This application provides tools for solving various
            numerical problems, including interpolation and root finding.
          </p>
        </div>          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          <Card className="transition-all duration-300 hover:shadow-lg border-l-4 border-l-blue-500 dark:border-l-blue-600">
            <CardHeader className="pb-2">
              <CardTitle>Divided Difference Interpolation</CardTitle>
              <CardDescription>Newton's divided difference interpolation method</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base">
                The divided difference method is used for polynomial interpolation. It creates a polynomial
                that passes through a set of data points using Newton's divided difference formula.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full sm:w-auto">
                <Link href="/divided-difference">Try Divided Difference</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-lg border-l-4 border-l-green-500 dark:border-l-green-600">
            <CardHeader className="pb-2">
              <CardTitle>Bisection Method</CardTitle>
              <CardDescription>Root finding using interval halving</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base">
                The bisection method is a simple and robust root-finding algorithm. It repeatedly bisects
                an interval and selects the subinterval where the root must lie for further processing.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full sm:w-auto">
                <Link href="/bisection">Try Bisection Method</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card className="transition-all duration-300 mt-6 border-t-4 border-t-purple-500 dark:border-t-purple-600">
          <CardHeader>
            <CardTitle>About us</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              <div>
                <p className="text-sm sm:text-base">
                  We are Qatada Azzeh and Mohammad Alnaser, second-year Computer Science students with a strong passion for programming and problem solving. From building practical projects to tackling challenging algorithmic problems, we thrive on turning ideas into real-world solutions.
                </p>
                <p className="mt-4 text-sm sm:text-base">
                  Our journey in computer science has been driven by curiosity, continuous learning, and a shared goal of mastering the art of coding.
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
