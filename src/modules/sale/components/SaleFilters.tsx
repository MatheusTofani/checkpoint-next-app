"use client";

import type { PaymentMethodKey, SaleLocationKey } from "@/src/api/routes/sale/saleModels";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/src/components/ui/native-select";
import { DateRangeFilter } from "@/src/modules/common/components/DateRangeFilter";
import { locationOptions, paymentMethodOptions } from "../saleOptions";

export interface SaleFiltersValue {
  from: string;
  to: string;
  paymentMethod: PaymentMethodKey | "";
  location: SaleLocationKey | "";
}

interface SaleFiltersProps {
  value: SaleFiltersValue;
  onChange: (value: SaleFiltersValue) => void;
}

export function SaleFilters({ value, onChange }: SaleFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <DateRangeFilter
        from={value.from}
        to={value.to}
        onChange={(range) => onChange({ ...value, ...range })}
      />
      <NativeSelect
        aria-label="Filtrar por pagamento"
        value={value.paymentMethod}
        onChange={(event) =>
          onChange({ ...value, paymentMethod: event.target.value as SaleFiltersValue["paymentMethod"] })
        }
      >
        <NativeSelectOption value="">Todos os pagamentos</NativeSelectOption>
        {paymentMethodOptions.map((option) => (
          <NativeSelectOption key={option.value} value={option.value}>
            {option.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      <NativeSelect
        aria-label="Filtrar por local"
        value={value.location}
        onChange={(event) =>
          onChange({ ...value, location: event.target.value as SaleFiltersValue["location"] })
        }
      >
        <NativeSelectOption value="">Todos os locais</NativeSelectOption>
        {locationOptions.map((option) => (
          <NativeSelectOption key={option.value} value={option.value}>
            {option.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  );
}
