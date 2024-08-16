import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { eq } from "drizzle-orm";
import { SubmitButton, TextInput } from "~/components/form";
import { db } from "~/db.server/connection";
import { imageMetadataTable } from "~/db.server/schema";

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;

  const image = await db.query.imageMetadataTable.findFirst({
    where: eq(imageMetadataTable.id, Number(id)),
  });
  if (!image) {
    return redirect("/admin/fotos");
  }

  return image;
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const alt = formData.get("alt");
  const id = params.id;

  await db
    .update(imageMetadataTable)
    .set({ alt: alt?.toString().trim() })
    .where(eq(imageMetadataTable.id, Number(id)));

  return json({ message: "Legenda alterada com sucesso", ok: true });
}

export default function EditFoto() {
  const foto = useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();
  const navigate = useNavigate();

  return (
    <div className="mb-4 flex flex-col items-center justify-center gap-2">
      <Form
        method="post"
        encType="multipart/form-data"
        className="w-full lg:w-4/5"
      >
        <img
          src={`/images/upload/${foto.fileName}`}
          alt={foto.alt || ""}
          className="m-auto mb-4 h-auto w-4/5"
        />
        <TextInput
          label="Descrição da imagem"
          type="text"
          name="alt"
          defaultValue={foto.alt ?? ""}
        />
        <div className="m-4 flex items-center justify-center gap-2">
          <SubmitButton>Enviar</SubmitButton>
          <button
            type="button"
            className="rounded-full bg-neutral-200 px-6 py-2 text-lg font-bold"
            onClick={() => navigate(-1)}
          >
            Voltar
          </button>
        </div>
        {data ? (
          <p
            className={`${data.ok ? "bg-cyan-100 text-cyan-700" : "bg-red-50 text-red-800"} rounded-xl px-4 py-2 text-base`}
          >
            {data.message}
          </p>
        ) : null}
      </Form>
    </div>
  );
}
