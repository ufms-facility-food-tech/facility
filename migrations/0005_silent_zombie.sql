DO $$ BEGIN
 ALTER TABLE "caracteristicas_adicionais" ADD CONSTRAINT "caracteristicas_adicionais_peptideo_id_peptideo_id_fk" FOREIGN KEY ("peptideo_id") REFERENCES "public"."peptideo"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "caso_sucesso" ADD CONSTRAINT "caso_sucesso_peptideo_id_peptideo_id_fk" FOREIGN KEY ("peptideo_id") REFERENCES "public"."peptideo"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "funcao_biologica" ADD CONSTRAINT "funcao_biologica_peptideo_id_peptideo_id_fk" FOREIGN KEY ("peptideo_id") REFERENCES "public"."peptideo"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
