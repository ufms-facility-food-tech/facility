import { type ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { eq } from "drizzle-orm";
import { lucia, auth } from "~/.server/auth";
import { db } from "~/.server/db/connection";
import { userTable } from "~/.server/db/schema";

export async function action({ params, request }: ActionFunctionArgs) {
  const { session, user } = await auth(request);

  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    return redirect("/login", {
      headers: {
        "Set-Cookie": sessionCookie.serialize(),
      },
    });
  }

  if (session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    return redirect(request.url, {
      headers: {
        "Set-Cookie": sessionCookie.serialize(),
      },
    });
  }

  if (!user.isAdmin || !user.emailVerified) {
    return redirect("/");
  }

  const id = params.id;
  if (!id) {
    return json({ message: "Id inválido", ok: false });
  }

  if (user.id === id) {
    return json({ message: "Operação inválida", ok: false });
  }

  const item = await db.query.userTable.findFirst({
    where: eq(userTable.id, id),
  });

  if (!item) {
    return json({ message: "Usuário não encontrado", ok: false });
  }

  await db.delete(userTable).where(eq(userTable.id, item.id));

  return redirect("/admin/usuarios");
}

export async function loader() {
  return redirect("/");
}
