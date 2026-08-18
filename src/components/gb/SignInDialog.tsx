import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { authAdapter } from "@/lib/gb/auth";

/**
 * Sign-in entry point. Talks only to `authAdapter`, so swapping the local stub
 * for Supabase phone-OTP auth needs no change here.
 */
export function SignInDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setStep("phone");
    setMessage(null);
    setCode("");
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const requestOtp = async () => {
    setBusy(true);
    const res = await authAdapter.requestOtp(phone);
    setBusy(false);
    setMessage(res.message);
    if (res.sent) setStep("otp");
  };

  const verify = async () => {
    setBusy(true);
    await authAdapter.verifyOtp(phone, code);
    setBusy(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-background/80 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="signin-title"
        className="w-full max-w-sm rounded-lg border border-border bg-surface p-6 shadow-[var(--shadow-lift)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="signin-title" className="text-lg font-semibold text-foreground">
              Sign in to GharBazaar
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Save shortlists, comparisons and property alerts to your account.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sign in"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <form
          className="mt-5 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            void (step === "phone" ? requestOtp() : verify());
          }}
        >
          {step === "phone" ? (
            <label className="block text-sm">
              <span className="text-muted-foreground">Mobile number</span>
              <input
                ref={inputRef}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="numeric"
                placeholder="98765 43210"
                className="mt-1.5 w-full rounded-md border border-border bg-surface-2 px-3 py-2.5 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
          ) : (
            <label className="block text-sm">
              <span className="text-muted-foreground">Enter OTP sent to {phone}</span>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputMode="numeric"
                placeholder="6-digit code"
                className="mt-1.5 w-full rounded-md border border-border bg-surface-2 px-3 py-2.5 tracking-widest text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
          )}

          {message && <p className="text-xs text-muted-foreground">{message}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-soft disabled:opacity-60"
          >
            {busy ? "Please wait…" : step === "phone" ? "Send OTP" : "Verify & continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
