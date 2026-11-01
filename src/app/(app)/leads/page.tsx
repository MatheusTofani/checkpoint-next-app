import type { Metadata } from "next";
import LeadTemplate from "@/src/modules/lead/template/LeadTemplate";

export const metadata: Metadata = {
  title: "Leads | Checkpoint",
};

export default function LeadsPage() {
  return <LeadTemplate />;
}
