import { PackageOpenIcon } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/src/components/ui/empty";

interface ProductEmptyProps {
  search?: string;
}

export function ProductEmpty({ search }: ProductEmptyProps) {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageOpenIcon />
        </EmptyMedia>
        <EmptyTitle>Nenhum produto encontrado</EmptyTitle>
        <EmptyDescription>
          {search
            ? `Nenhum resultado para "${search}". Tente outro nome.`
            : "Cadastre o primeiro produto pelo botão \"Novo produto\"."}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
