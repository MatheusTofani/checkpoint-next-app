import type { Metadata } from "next";
import SaleTemplate from "@/src/modules/sale/template/SaleTemplate";

export const metadata: Metadata = {
  title: "Vendas | Checkpoint",
};

export default function SalesPage() {
  return <SaleTemplate />;
}
