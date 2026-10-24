import { Suspense } from "react";
import { logout } from "@/src/app/actions/auth";
import { Button } from "@/src/components/ui/button";
import { Spinner } from "@/src/components/ui/spinner";
import { getCurrentUser } from "@/src/lib/dal";

export default function HomePage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-4">
      <Suspense fallback={<Spinner />}>
        <Welcome />
      </Suspense>
    </main>
  );
}

async function Welcome() {
  const user = await getCurrentUser();

  return (
    <>
      <h1 className="text-2xl font-semibold">Olá, {user.name}</h1>
      <p className="text-muted-foreground">{user.email}</p>
      <form action={logout}>
        <Button type="submit" variant="outline">
          Sair
        </Button>
      </form>
    </>
  );
}
