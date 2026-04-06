import { Link } from "wouter";
import { Brain, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4 transition-colors duration-200">
      <div className="text-center max-w-lg">

        {/* Animated 404 */}
        <div className="relative mb-8">
          <p className="text-[10rem] font-black text-slate-200 dark:text-slate-700 leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
              <Brain className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          Looks like this page doesn't exist or was moved. 
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Home className="h-4 w-4" />
              Go to Home
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()}
            className="gap-2 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>

        <p className="mt-8 text-xs text-slate-400 dark:text-slate-600">
          MHealthCheck · Mental Health Platform
        </p>
      </div>
    </div>
  );
}
