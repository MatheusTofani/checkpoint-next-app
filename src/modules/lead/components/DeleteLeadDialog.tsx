"use client";

import type { LeadResponse } from "@/src/api/routes/lead/leadModels";
import { useLeadApi } from "@/src/api/routes/lead/useLeadApi";
import { ConfirmDeleteDialog } from "@/src/modules/common/components/ConfirmDeleteDialog";

interface DeleteLeadDialogProps {
  lead: LeadResponse;
}

export function DeleteLeadDialog({ lead }: DeleteLeadDialogProps) {
  const { DeleteLead } = useLeadApi();

  return (
    <ConfirmDeleteDialog
      id={lead.id}
      mutation={DeleteLead()}
      title="Excluir lead?"
      description={
        <>
          O lead <strong>{lead.name}</strong> será removido. Essa ação não pode
          ser desfeita.
        </>
      }
      label={`Excluir ${lead.name}`}
      errorMessage="Não foi possível excluir o lead"
    />
  );
}
