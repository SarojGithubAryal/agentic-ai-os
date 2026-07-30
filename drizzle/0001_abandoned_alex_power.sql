ALTER TABLE "documents" ADD COLUMN "application_id" uuid;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "content_hash" varchar(64);--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "source" varchar(50) DEFAULT 'manual' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "documents" ADD CONSTRAINT "documents_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
