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
import { useMemo, useCallback, memo, type ReactNode } from "react";

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
  const icons = useMemo(
    () => ({
      search: <TbDatabaseSearch />,
      insert: <TbDatabasePlus />,
      users: <TbUsersGroup />,
      photos: <TbLibraryPhoto />,
      glossary: <TbBook />,
    }),
    [],
  );

  return (
    <Container title="Área Administrativa">
      <div className="flex h-full">
        <aside className="mr-4 w-1/4 pr-1">
          <nav>
            <ul className="flex flex-col gap-3">
              <AdminNavItem
                label="Listar registros"
                route="listar"
                icon={icons.search}
              />
              <AdminNavItem
                label="Inserir registro"
                route="inserir"
                icon={icons.insert}
              />
              <AdminNavItem
                label="Usuários"
                route="usuarios"
                icon={icons.users}
              />
              <AdminNavItem label="Fotos" route="fotos" icon={icons.photos} />
              <AdminNavItem
                label="Glossário"
                route="glossario"
                icon={icons.glossary}
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

const AdminNavItem = memo(function AdminNavItem({
  label,
  route,
  icon,
}: {
  label: string;
  route: string;
  icon: ReactNode;
}) {
  const iconContextValue = useMemo(() => ({ size: "2rem" }), []);
  
  const getClassName = useCallback(
    ({ isActive }: { isActive: boolean }) =>
      `${
        isActive
          ? "bg-gradient-to-r from-cyan-600 to-cyan-500 text-white"
          : "bg-neutral-100 text-cyan-600"
      } flex items-center gap-2 rounded-2xl px-5 py-1 text-center font-bold underline-offset-4 hover:underline`,
    []
  );

  return (
    <IconContext.Provider value={iconContextValue}>
      <li>
        <NavLink
          prefetch="intent"
          className={getClassName}
          to={route}
        >
          {icon}
          {label}
        </NavLink>
      </li>
    </IconContext.Provider>
  );
});
