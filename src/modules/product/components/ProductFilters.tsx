"use client";

import { SearchIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/src/components/ui/input-group";

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function ProductFilters({ search, onSearchChange }: ProductFiltersProps) {
  return (
    <InputGroup className="sm:max-w-xs">
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        placeholder="Buscar por nome"
        aria-label="Buscar produtos por nome"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
    </InputGroup>
  );
}
