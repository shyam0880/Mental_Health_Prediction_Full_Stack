import { Brain } from "lucide-react";

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export default function Loading({ message = "Loading...", fullScreen = true }: LoadingProps) {
  const wrapper = fullScreen
    ? "min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800"
    : "min-h-64 bg-transparent";

  return (
    <div className={`${wrapper} flex items-center justify-center transition-colors duration-200`}>
      <div className="text-center">
        {/* Pulsing brain logo */}
        <div className="relative mx-auto mb-6 w-20 h-20">
          <div className="absolute inset-0 bg-blue-400 dark:bg-blue-600 rounded-full animate-ping opacity-20" />
          <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Brain className="h-10 w-10 text-white" />
          </div>
        </div>

        {/* Bouncing dots */}
        <div className="flex gap-1.5 justify-center mb-4">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>

        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}
