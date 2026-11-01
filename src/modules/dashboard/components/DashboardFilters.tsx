"use client";

import { XIcon } from "lucide-react";
import type { LeadResponse } from "@/src/api/routes/lead/leadModels";
import type { ProductResponse } from "@/src/api/routes/product/productModels";
import { Button } from "@/src/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/src/components/ui/native-select";
import { ToggleGroup, ToggleGroupItem } from "@/src/components/ui/toggle-group";
import { todayInputValue } from "@/src/lib/format";
import { DateRangeFilter } from "@/src/modules/common/components/DateRangeFilter";
import type { DashboardFiltersValue } from "../useDashboardData";

const presets = [
  { value: "30", label: "30 dias" },
  { value: "90", label: "90 dias" },
  { value: "365", label: "12 meses" },
  { value: "all", label: "Tudo" },
];

function daysAgo(days: number) {
  const date = new Date(`${todayInputValue()}T12:00:00`);
  date.setDate(date.getDate() - days + 1);
  return date.toISOString().slice(0, 10);
}

interface DashboardFiltersProps {
  value: DashboardFiltersValue;
  onChange: (value: DashboardFiltersValue) => void;
  preset: string;
  onPresetChange: (preset: string) => void;
  leads: LeadResponse[];
  products: ProductResponse[];
}

export function DashboardFilters({
  value,
  onChange,
  preset,
  onPresetChange,
  leads,
  products,
}: DashboardFiltersProps) {
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))].sort();
  const visibleProducts = value.category
    ? products.filter((p) => p.category === value.category)
    : products;
  const hasFilters = !!(value.leadId || value.productId || value.category);

  const applyPreset = (selected: string) => {
    onPresetChange(selected);
    // Datas calculadas no clique, não no render (prerender com cacheComponents)
    const range =
      selected === "all"
        ? { from: "", to: "" }
        : { from: daysAgo(Number(selected)), to: todayInputValue() };
    onChange({ ...value, ...range });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ToggleGroup
        variant="outline"
        size="sm"
        value={preset ? [preset] : []}
        onValueChange={(selected) => selected[0] && applyPreset(selected[0])}
        aria-label="Período"
      >
        {presets.map((item) => (
          <ToggleGroupItem key={item.value} value={item.value}>
            {item.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <DateRangeFilter
        from={value.from}
        to={value.to}
        onChange={(range) => {
          onPresetChange("");
          onChange({ ...value, ...range });
        }}
      />

      <NativeSelect
        aria-label="Filtrar por cliente"
        title="O filtro de cliente vale só para as vendas"
        value={value.leadId}
        onChange={(event) => onChange({ ...value, leadId: event.target.value })}
      >
        <NativeSelectOption value="">Todos os clientes</NativeSelectOption>
        {leads.map((lead) => (
          <NativeSelectOption key={lead.id} value={lead.id}>
            {lead.name}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      <NativeSelect
        aria-label="Filtrar por categoria"
        value={value.category}
        onChange={(event) => {
          const category = event.target.value;
          const product = products.find((p) => p.id === value.productId);
          // Limpa o produto se ele não pertence à nova categoria
          const productId = !category || product?.category === category ? value.productId : "";
          onChange({ ...value, category, productId });
        }}
      >
        <NativeSelectOption value="">Todas as categorias</NativeSelectOption>
        {categories.map((category) => (
          <NativeSelectOption key={category} value={category}>
            {category}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      <NativeSelect
        aria-label="Filtrar por produto"
        value={value.productId}
        onChange={(event) => onChange({ ...value, productId: event.target.value })}
      >
        <NativeSelectOption value="">Todos os produtos</NativeSelectOption>
        {visibleProducts.map((product) => (
          <NativeSelectOption key={product.id} value={product.id}>
            {product.name}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange({ ...value, leadId: "", productId: "", category: "" })}
        >
          <XIcon data-icon="inline-start" />
          Limpar filtros
        </Button>
      )}
    </div>
  );
}
