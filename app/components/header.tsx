import { Form, NavLink } from "@remix-run/react";
import type { User } from "lucia";
import { memo, useCallback } from "react";
import { useMemo } from "react";
import { TbLogin, TbLogout, TbUserCircle, TbUserPlus } from "react-icons/tb";

export const Header = memo(function Header({ user }: { user: Pick<User, "displayName"> | null }) {
  const getNavClassName = useCallback(
    ({ isActive }: { isActive: boolean }) =>
      `${isActive ? "underline" : ""} p-3 underline-offset-4 hover:underline`,
    [],
  );

  const navLinks = useMemo(
    () => (
      <>
        <li>
          <NavLink prefetch="intent" to="/" className={getNavClassName}>
            Início
          </NavLink>
        </li>
        <li>
          <NavLink
            prefetch="intent"
            to="/banco-de-dados"
            className={getNavClassName}
          >
            Banco de Dados
          </NavLink>
        </li>
        <li>
          <NavLink prefetch="intent" to="/pesquisa" className={getNavClassName}>
            Pesquisar
          </NavLink>
        </li>
        <li>
          <NavLink
            prefetch="intent"
            to="/glossario"
            className={getNavClassName}
          >
            Glossário
          </NavLink>
        </li>
        <li>
          <NavLink prefetch="intent" to="/fotos" className={getNavClassName}>
            Fotos
          </NavLink>
        </li>
        <li>
          <NavLink
            prefetch="intent"
            to="/descobertas-lppfb"
            className={getNavClassName}
          >
            Descobertas do LPPFB
          </NavLink>
        </li>
        <li>
          <NavLink
            prefetch="intent"
            to="/casos-de-sucesso"
            className={getNavClassName}
          >
            Casos de Sucesso
          </NavLink>
        </li>
        <li>
          <NavLink prefetch="intent" to="/sobre" className={getNavClassName}>
            Sobre
          </NavLink>
        </li>
      </>
    ),
    [getNavClassName],
  );

  const userSection = useMemo(
    () =>
      user ? (
        <div className="my-6 flex flex-wrap justify-end gap-3">
          <NavLink
            prefetch="intent"
            to="/perfil"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-600 to-cyan-500 px-6 py-2 text-lg font-bold text-white"
          >
            {user.displayName} <TbUserCircle size="2rem" />
          </NavLink>
          <Form method="post" action="/logout">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-full bg-gradient-to-l from-neutral-200 to-neutral-100 py-2 pl-5 pr-4 text-lg font-bold"
            >
              Sair <TbLogout size="2rem" />
            </button>
          </Form>
        </div>
      ) : (
        <div className="my-6 flex flex-wrap justify-end gap-3">
          <NavLink
            prefetch="intent"
            to="/login"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-600 to-cyan-500 py-2 pl-5 pr-4 text-lg font-bold text-white"
          >
            Entrar <TbLogin size="2rem" />
          </NavLink>
          <NavLink
            prefetch="intent"
            to="/register"
            className="flex items-center gap-2 rounded-full bg-gradient-to-l from-neutral-200 to-neutral-100 py-2 pl-5 pr-4 text-lg font-bold"
          >
            Cadastrar <TbUserPlus size="2rem" />
          </NavLink>
        </div>
      ),
    [user],
  );

  return (
    <header>
      <div className="min-h-26 flex items-center justify-between bg-white px-4">
        <a
          href="https://lppfb.ufms.br/"
          title="Retornar ao site principal do LPPFB"
        >
          <img
            className="my-2 h-24 max-w-md text-balance text-center"
            src="/images/static/lppfb-logo.jpg"
            alt="UFMS - Laboratório de Purificação de Proteínas e Suas Funções Biológicas"
          />
        </a>
        {userSection}
      </div>
      <nav className="bg-neutral-100 py-3">
        <ul className="flex flex-wrap items-center justify-evenly gap-2 text-lg font-bold sm:mx-8 sm:justify-normal">
          {navLinks}
        </ul>
      </nav>
    </header>
  );
})
