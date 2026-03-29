import { useConvexAuth } from "convex/react";
import { AuthScreen } from "./components/AuthScreen";
import { KanbanApp } from "./components/KanbanApp";

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center">
        <div className="border-4 border-black p-8 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-4 border-black border-t-transparent animate-spin" />
            <span className="font-mono text-xl uppercase tracking-widest">LOADING...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return <KanbanApp />;
}
