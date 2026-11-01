import { Suspense } from "react";
import { Spinner } from "@/src/components/ui/spinner";
import { getCurrentUser } from "@/src/lib/dal";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
      <Suspense fallback={<Spinner />}>
        <Welcome />
      </Suspense>
    </div>
  );
}

async function Welcome() {
  const user = await getCurrentUser();

  return (
    <>
      <h1 className="text-2xl font-semibold">Olá, {user.name}</h1>
      <p className="text-muted-foreground">{user.email}</p>
    </>
  );
}
