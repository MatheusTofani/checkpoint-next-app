"use client";

import { useState, type FormEvent } from "react";
import { PencilIcon, PlusIcon } from "lucide-react";
import { getApiErrorMessage } from "@/src/api/api";
import type { CreateLeadRequest, LeadResponse } from "@/src/api/routes/lead/leadModels";
import { useLeadApi } from "@/src/api/routes/lead/useLeadApi";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { Spinner } from "@/src/components/ui/spinner";

type FieldErrors = Partial<Record<keyof CreateLeadRequest, string>>;

function parseForm(formData: FormData) {
  const optional = (name: string) => String(formData.get(name) ?? "").trim() || undefined;
  const request: CreateLeadRequest = {
    name: String(formData.get("name") ?? "").trim(),
    email: optional("email"),
    phone: optional("phone"),
  };

  const errors: FieldErrors = {};
  if (!request.name) errors.name = "Informe o nome";
  if (request.email && !/^\S+@\S+\.\S+$/.test(request.email)) {
    errors.email = "Informe um email válido";
  }

  return { request, errors };
}

interface LeadFormDialogProps {
  /** Sem lead, o formulário cria um novo; com lead, edita. */
  lead?: LeadResponse;
}

export function LeadFormDialog({ lead }: LeadFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const { CreateLead, UpdateLead } = useLeadApi();
  const createLead = CreateLead();
  const updateLead = UpdateLead();
  const mutation = lead ? updateLead : createLead;

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) {
      setFieldErrors({});
      mutation.reset();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { request, errors } = parseForm(new FormData(event.currentTarget));
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    const options = { onSuccess: () => handleOpenChange(false) };
    if (lead) updateLead.mutate({ id: lead.id, ...request }, options);
    else createLead.mutate(request, options);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {lead ? (
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Editar ${lead.name}`}
              className="text-muted-foreground"
            />
          }
        >
          <PencilIcon />
        </DialogTrigger>
      ) : (
        <DialogTrigger render={<Button />}>
          <PlusIcon data-icon="inline-start" />
          Novo lead
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} noValidate className="grid gap-4">
          <DialogHeader>
            <DialogTitle>{lead ? "Editar lead" : "Novo lead"}</DialogTitle>
            <DialogDescription>
              {lead ? lead.name : "Preencha os dados para cadastrar um lead."}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            {mutation.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {getApiErrorMessage(mutation.error, "Não foi possível salvar o lead")}
                </AlertDescription>
              </Alert>
            )}

            <Field data-invalid={!!fieldErrors.name}>
              <FieldLabel htmlFor="lead-name">Nome</FieldLabel>
              <Input
                id="lead-name"
                name="name"
                defaultValue={lead?.name}
                aria-invalid={!!fieldErrors.name}
              />
              <FieldError>{fieldErrors.name}</FieldError>
            </Field>

            <Field data-invalid={!!fieldErrors.email}>
              <FieldLabel htmlFor="lead-email">Email (opcional)</FieldLabel>
              <Input
                id="lead-email"
                name="email"
                type="email"
                defaultValue={lead?.email ?? ""}
                aria-invalid={!!fieldErrors.email}
              />
              <FieldError>{fieldErrors.email}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="lead-phone">Telefone (opcional)</FieldLabel>
              <Input
                id="lead-phone"
                name="phone"
                type="tel"
                defaultValue={lead?.phone ?? ""}
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Spinner />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
