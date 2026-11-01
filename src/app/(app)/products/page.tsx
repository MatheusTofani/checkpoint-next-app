import type { Metadata } from "next";
import ProductTemplate from "@/src/modules/product/template/ProductTemplate";

export const metadata: Metadata = {
  title: "Produtos | Checkpoint",
};

export default function ProductsPage() {
  return <ProductTemplate />;
}
