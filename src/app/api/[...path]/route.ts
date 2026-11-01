import { type NextRequest } from "next/server";
import { getSession } from "@/src/lib/session";

// Backend for Frontend: o browser chama /api/* aqui no Next e a gente repassa
// para a NUC API com o token do cookie httpOnly (o JS do cliente não enxerga o
// token) e o X-Profile-Id. De quebra evita CORS, já que tudo fica na mesma origem.
async function forward(request: NextRequest, { params }: RouteContext<"/api/[...path]">) {
  const { path } = await params;
  const session = await getSession();

  const url = new URL(`/api/${path.join("/")}`, process.env.NEXT_PUBLIC_NUC_API_URL);
  url.search = request.nextUrl.search;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);
  headers.set("Accept", request.headers.get("accept") ?? "application/json");

  // Sem sessão a request segue sem token: rotas públicas da API (ex.: POST /api/User)
  // funcionam e as protegidas respondem 401, que o cliente trata mandando para o logout.
  if (session) {
    headers.set("Authorization", `Bearer ${session.token}`);
    if (session.profileId) headers.set("X-Profile-Id", session.profileId);
  }

  const hasBody = !["GET", "HEAD"].includes(request.method);

  try {
    const response = await fetch(url, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: "no-store",
    });

    const responseHeaders = new Headers();
    for (const name of ["content-type", "content-disposition"]) {
      const value = response.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch {
    return Response.json(
      { title: "Não foi possível conectar ao servidor" },
      { status: 502 }
    );
  }
}

export {
  forward as GET,
  forward as POST,
  forward as PUT,
  forward as PATCH,
  forward as DELETE,
};
