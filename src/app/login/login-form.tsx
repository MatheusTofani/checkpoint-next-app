"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/src/app/actions/auth";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { Spinner } from "@/src/components/ui/spinner";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <form action={action}>
      <FieldGroup>
        {state.error && (
          <Alert variant="destructive">
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        <Field data-invalid={!!state.fieldErrors?.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="voce@empresa.com"
            defaultValue={state.email}
            aria-invalid={!!state.fieldErrors?.email}
            required
          />
          <FieldError>{state.fieldErrors?.email}</FieldError>
        </Field>

        <Field data-invalid={!!state.fieldErrors?.password}>
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!state.fieldErrors?.password}
            required
          />
          <FieldError>{state.fieldErrors?.password}</FieldError>
        </Field>

        <Button type="submit" disabled={pending}>
          {pending && <Spinner />}
          Entrar
        </Button>
      </FieldGroup>
    </form>
  );
}
