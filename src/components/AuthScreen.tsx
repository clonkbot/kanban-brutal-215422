import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      await signIn("password", formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnonymous = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signIn("anonymous");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to continue as guest");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col">
      {/* Brutalist Header */}
      <header className="border-b-8 border-black bg-[#ffff00] p-4 md:p-6">
        <h1 className="font-mono text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter">
          KANBAN<span className="text-[#ff0000]">_</span>BRUTAL
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          {/* Auth Card */}
          <div className="border-8 border-black bg-white shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
            {/* Card Header */}
            <div className="border-b-8 border-black bg-[#0000ff] p-4 md:p-6">
              <h2 className="font-mono text-2xl md:text-3xl font-black text-white uppercase">
                {flow === "signIn" ? "ENTER_SYSTEM" : "NEW_USER"}
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6">
              <div>
                <label className="block font-mono text-sm uppercase tracking-wider mb-2 font-bold">
                  EMAIL_ADDRESS
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full border-4 border-black p-3 md:p-4 font-mono text-lg focus:outline-none focus:ring-4 focus:ring-[#ffff00] bg-[#f5f5f0]"
                  placeholder="user@domain.com"
                />
              </div>

              <div>
                <label className="block font-mono text-sm uppercase tracking-wider mb-2 font-bold">
                  PASSWORD
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full border-4 border-black p-3 md:p-4 font-mono text-lg focus:outline-none focus:ring-4 focus:ring-[#ffff00] bg-[#f5f5f0]"
                  placeholder="••••••••"
                />
              </div>

              <input name="flow" type="hidden" value={flow} />

              {error && (
                <div className="border-4 border-[#ff0000] bg-[#ff0000]/10 p-3 md:p-4">
                  <p className="font-mono text-sm text-[#ff0000] uppercase">[ERROR] {error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full border-4 border-black bg-[#00ff00] p-3 md:p-4 font-mono text-lg md:text-xl font-black uppercase tracking-wider hover:bg-[#ffff00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
              >
                {isSubmitting ? "PROCESSING..." : flow === "signIn" ? "LOGIN →" : "REGISTER →"}
              </button>

              <div className="border-t-4 border-black pt-4 md:pt-6">
                <button
                  type="button"
                  onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
                  className="w-full border-4 border-black bg-white p-3 md:p-4 font-mono text-base md:text-lg uppercase tracking-wider hover:bg-[#f5f5f0] transition-colors"
                >
                  {flow === "signIn" ? "→ CREATE ACCOUNT" : "→ EXISTING USER"}
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-4 border-black border-dashed" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 font-mono text-sm uppercase">OR</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAnonymous}
                disabled={isSubmitting}
                className="w-full border-4 border-black bg-[#808080] p-3 md:p-4 font-mono text-base md:text-lg text-white uppercase tracking-wider hover:bg-[#666666] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                CONTINUE AS GUEST
              </button>
            </form>
          </div>

          {/* Decorative Elements */}
          <div className="mt-8 flex justify-between">
            <div className="w-16 h-16 md:w-24 md:h-24 border-8 border-black bg-[#ff0000] rotate-12" />
            <div className="w-16 h-16 md:w-24 md:h-24 border-8 border-black bg-[#0000ff] -rotate-6" />
            <div className="w-16 h-16 md:w-24 md:h-24 border-8 border-black bg-[#ffff00] rotate-3" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white p-4 text-center">
        <p className="font-mono text-xs text-gray-500">
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>
    </div>
  );
}
