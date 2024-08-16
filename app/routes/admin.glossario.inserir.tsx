import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { getValibotConstraint, parseWithValibot } from "conform-to-valibot";
import { object, string } from "valibot";
import { FormErrorMessage, SubmitButton, TextInput } from "~/components/form";
import { db } from "~/db.server/connection";
import { glossarioTable } from "~/db.server/schema";

const schema = object({
  name: string(),
  definition: string(),
  example: string(),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithValibot(formData, { schema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await db.insert(glossarioTable).values(submission.value).onConflictDoUpdate({
    target: glossarioTable.name,
    set: submission.value,
  });

  return submission.reply();
}

export default function GlossarioInserir() {
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    constraint: getValibotConstraint(schema),
    onValidate({ formData }) {
      return parseWithValibot(formData, { schema });
    },
  });
  const navigate = useNavigate();

  return (
    <>
      <Form
        method="post"
        {...getFormProps(form)}
        className="flex w-full flex-col gap-2"
      >
        <TextInput
          label="Nome"
          {...getInputProps(fields.name, { type: "text" })}
        />
        <FormErrorMessage errors={fields.name.errors} />
        <TextInput
          label="Definição"
          {...getInputProps(fields.definition, { type: "text" })}
        />
        <FormErrorMessage errors={fields.definition.errors} />
        <TextInput
          label="Exemplo"
          {...getInputProps(fields.example, { type: "text" })}
        />
        <FormErrorMessage errors={fields.example.errors} />
        <div className="m-4 flex items-center justify-center gap-2">
          <SubmitButton>Enviar</SubmitButton>
          <button
            type="button"
            className="rounded-full bg-neutral-200 px-6 py-2 text-lg font-bold"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
        </div>
      </Form>
      {lastResult?.status === "success" ? (
        <p
          className={
            "my-4 rounded-xl bg-cyan-100 px-4 py-2 text-base text-cyan-700"
          }
        >
          Definição inserida com sucesso.
        </p>
      ) : null}
    </>
  );
}