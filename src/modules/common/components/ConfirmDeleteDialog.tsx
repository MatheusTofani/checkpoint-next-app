"use client";

import { useState, type ReactNode } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { getApiErrorMessage } from "@/src/api/api";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";
import { Spinner } from "@/src/components/ui/spinner";

interface ConfirmDeleteDialogProps {
  id: string;
  /** Mutation de exclusão do módulo, ex.: DeleteProduct(). */
  mutation: UseMutationResult<unknown, Error, string>;
  title: string;
  description: ReactNode;
  /** Texto do aria-label do botão, ex.: "Excluir Camiseta". */
  label: string;
  errorMessage: string;
}

export function ConfirmDeleteDialog({
  id,
  mutation,
  title,
  description,
  label,
  errorMessage,
}: ConfirmDeleteDialogProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) mutation.reset();
  };

  const handleDelete = () => {
    mutation.mutate(id, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            className="text-muted-foreground hover:text-destructive"
          />
        }
      >
        <Trash2Icon />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        {mutation.isError && (
          <Alert variant="destructive">
            <AlertDescription>
              {getApiErrorMessage(mutation.error, errorMessage)}
            </AlertDescription>
          </Alert>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Spinner />}
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
