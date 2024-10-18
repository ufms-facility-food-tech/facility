import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { eq } from "drizzle-orm";
import { lucia, auth } from "~/.server/auth";
import { db } from "~/.server/db/connection";
import { userTable } from "~/.server/db/schema";

export async function action({ request }: ActionFunctionArgs) {
  const { user, session } = await auth(request);

  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    return redirect("/login", {
      headers: {
        "Set-Cookie": sessionCookie.serialize(),
      },
    });
  }

  await lucia.invalidateUserSessions(user.id);
  await db.delete(userTable).where(eq(userTable.id, user.id));

  const sessionCookie = lucia.createBlankSessionCookie();
  return redirect("/", {
    headers: {
      "Set-Cookie": sessionCookie.serialize(),
    },
  });
}
