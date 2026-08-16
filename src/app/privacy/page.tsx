import type { Metadata } from "next";
import { PageChrome } from "@/components/PageChrome";

export const metadata: Metadata = {
  title: "Privacy",
  description: "ShiftPay Calc runs in your browser. Pay numbers are not sent to a server.",
};

export default function PrivacyPage() {
  return (
    <PageChrome
      active="privacy"
      kicker="Privacy"
      title="Your hours stay on this device."
      lede="The calculators run entirely in your browser. We do not collect names, Social Security numbers, or pay stubs."
    >
      <article className="max-w-3xl space-y-4 text-paper/80">
        <p>
          Inputs never leave your device for the calculation itself. If we later
          add privacy-respecting analytics or ads, this page will name the
          vendor and the data. We do not sell personal information.
        </p>
        <p>
          Hosting logs may include a standard IP address and user-agent. We do
          not use those logs to rebuild your pay.
        </p>
      </article>
    </PageChrome>
  );
}
