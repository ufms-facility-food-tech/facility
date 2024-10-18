import type { LoaderFunctionArgs } from "@remix-run/node";
import { NavLink, Outlet, redirect } from "@remix-run/react";
import { IconContext } from "react-icons";
import {
  TbBook,
  TbDatabasePlus,
  TbDatabaseSearch,
  TbLibraryPhoto,
  TbUsersGroup,
} from "react-icons/tb";
import { auth, lucia } from "~/.server/auth";
import { Container } from "~/components/container";

export async function loader({ request }: LoaderFunctionArgs) {
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

  return null;
}

export default function Admin() {
  return (
    <Container title="Área Administrativa">
      <div className="flex h-full">
        <aside className="mr-4 w-1/4 pr-1">
          <nav>
            <ul className="flex flex-col gap-3">
              <AdminNavItem
                label="Listar registros"
                route="listar"
                icon={<TbDatabaseSearch />}
              />
              <AdminNavItem
                label="Inserir registro"
                route="inserir"
                icon={<TbDatabasePlus />}
              />
              <AdminNavItem
                label="Usuários"
                route="usuarios"
                icon={<TbUsersGroup />}
              />
              <AdminNavItem
                label="Fotos"
                route="fotos"
                icon={<TbLibraryPhoto />}
              />
              <AdminNavItem
                label="Glossário"
                route="glossario"
                icon={<TbBook />}
              />
            </ul>
          </nav>
        </aside>
        <main className="w-3/4">
          <Outlet />
        </main>
      </div>
    </Container>
  );
}

function AdminNavItem({
  label,
  route,
  icon,
}: {
  label: string;
  route: string;
  icon: React.ReactNode;
}) {
  return (
    <IconContext.Provider value={{ size: "2rem" }}>
      <li>
        <NavLink
          prefetch="intent"
          className={({ isActive }) =>
            `${
              isActive
                ? "bg-gradient-to-r from-cyan-600 to-cyan-500 text-white"
                : "bg-neutral-100 text-cyan-600"
            } flex items-center gap-2 rounded-2xl px-5 py-1 text-center font-bold underline-offset-4 hover:underline`
          }
          to={route}
        >
          {icon}
          {label}
        </NavLink>
      </li>
    </IconContext.Provider>
  );
}
