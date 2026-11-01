"use client";

import { useEffect, useId, useMemo, useRef } from "react";
import { ImageUpIcon, XIcon } from "lucide-react";
import {
  PRODUCT_IMAGE_MAX_SIZE,
  PRODUCT_IMAGE_TYPES,
} from "@/src/api/routes/product/productModels";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

export function validateProductImage(file: File) {
  if (!PRODUCT_IMAGE_TYPES.includes(file.type)) {
    return "A imagem deve ser JPG, PNG ou WEBP";
  }
  if (file.size > PRODUCT_IMAGE_MAX_SIZE) {
    return "A imagem deve ter no máximo 5 MB";
  }
  return undefined;
}

interface ProductImageInputProps {
  value: File | null;
  onChange: (file: File | null) => void;
  invalid?: boolean;
  disabled?: boolean;
}

export function ProductImageInput({
  value,
  onChange,
  invalid,
  disabled,
}: ProductImageInputProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = useMemo(() => (value ? URL.createObjectURL(value) : null), [value]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const clear = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      className={cn(
        "relative flex aspect-video w-full overflow-hidden rounded-lg border border-dashed bg-muted/50",
        invalid && "border-destructive",
        disabled && "opacity-50"
      )}
    >
      {previewUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- preview local (blob:) */}
          <img src={previewUrl} alt="Pré-visualização" className="size-full object-cover" />
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            aria-label="Remover imagem"
            className="absolute top-2 right-2"
            onClick={clear}
            disabled={disabled}
          >
            <XIcon />
          </Button>
        </>
      ) : (
        <label
          htmlFor={id}
          className="flex size-full cursor-pointer flex-col items-center justify-center gap-1 text-center text-muted-foreground hover:bg-muted"
        >
          <ImageUpIcon className="size-6" />
          <span className="text-sm font-medium">Escolher imagem</span>
          <span className="text-xs">JPG, PNG ou WEBP até 5 MB</span>
        </label>
      )}
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={PRODUCT_IMAGE_TYPES.join(",")}
        className="sr-only"
        aria-invalid={invalid}
        disabled={disabled}
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
    </div>
  );
}
