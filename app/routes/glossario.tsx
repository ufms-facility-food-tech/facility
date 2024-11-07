import { useLoaderData } from "@remix-run/react";
import { db } from "~/.server/db/connection";
import { glossarioTable } from "~/.server/db/schema";
import { Container } from "~/components/container";

export async function loader() {
  const glossary = await db.select().from(glossarioTable);

  return glossary;
}

export default function Faq() {
  const glossary = useLoaderData<typeof loader>();

  return (
    <Container title="Glossário">
      <ul className="flex flex-col gap-6">
        {glossary.map((item) => (
          <GlossaryListItem key={item.id} item={item} />
        ))}
      </ul>
    </Container>
  );
}

function GlossaryListItem({
  item,
}: {
  item: { name: string; definition: string; example: string };
}) {
  return (
    <li>
      <h2 className="text-xl font-bold">{item.name}</h2>
      <p>
        <strong>Definição</strong>: {item.definition}
      </p>
      <p>
        <strong>Exemplo</strong>: {item.example}
      </p>
    </li>
  );
}
