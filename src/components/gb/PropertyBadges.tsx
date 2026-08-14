import { BadgeCheck, Sparkles, ShieldCheck } from "lucide-react";
import type { PropertyFlag, VerificationStatus } from "@/lib/gb/types";

const verificationLabel: Record<VerificationStatus, string | null> = {
  "owner-verified": "Owner Verified",
  verified: "Verified",
  unverified: null,
};

/** Badges are driven purely by backend status — nothing is assumed verified. */
export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const label = verificationLabel[status];
  if (!label) return null;
  const Icon = status === "owner-verified" ? ShieldCheck : BadgeCheck;
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-background/85 px-2 py-1 text-[11px] font-semibold text-success backdrop-blur">
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}

const flagLabel: Record<PropertyFlag, string> = {
  new: "New",
  featured: "Featured",
  premium: "Premium",
};

export function FlagBadge({ flag }: { flag: PropertyFlag }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-primary/15 px-2 py-1 text-[11px] font-semibold text-primary">
      {flag === "premium" && <Sparkles className="size-3" aria-hidden="true" />}
      {flagLabel[flag]}
    </span>
  );
}
