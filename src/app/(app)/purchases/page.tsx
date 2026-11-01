import type { Metadata } from "next";
import PurchaseTemplate from "@/src/modules/purchase/template/PurchaseTemplate";

export const metadata: Metadata = {
  title: "Compras | Checkpoint",
};

export default function PurchasesPage() {
  return <PurchaseTemplate />;
}
