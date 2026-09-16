import { DeleteButton, SubmitButton } from "@/components/admin/Buttons";
import {
  CsvText,
  LocalizedArea,
  Number_,
  Text,
  Toggle,
} from "@/components/admin/Fields";
import { Actions, Card, Empty, PageHeading, Row } from "@/components/admin/Panel";
import {
  UploadField,
  UploadListField,
} from "@/components/admin/UploadField";
import { Saved } from "@/components/admin/Saved";
import { getProjects } from "@/lib/queries";
import { createProject, deleteProject, updateProject } from "./actions";

type Entry = Awaited<ReturnType<typeof getProjects>>[number];

function Fields({ entry, order }: { entry?: Entry; order: number }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Text name="title" label="Title" required defaultValue={entry?.title} />
        <Text
          name="slug"
          label="Slug"
          hint="blank = from title"
          defaultValue={entry?.slug}
        />
      </div>
      <LocalizedArea
        name="description"
        label="Description"
        value={entry?.description}
        rows={5}
      />
      <CsvText
        name="technologies"
        label="Technologies"
        value={entry?.technologies}
        placeholder="Java, Spring Boot, Kafka"
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Text name="demoUrl" label="Demo URL" defaultValue={entry?.demoUrl} />
        <Text name="repoUrl" label="Repo URL" defaultValue={entry?.repoUrl} />
      </div>
      <UploadField
        name="thumbnailUrl"
        label="Thumbnail"
        folder="portfolio/projects"
        defaultValue={entry?.thumbnailUrl}
      />
      <UploadListField
        name="gallery"
        label="Gallery"
        folder="portfolio/projects"
        defaultValue={entry?.gallery}
      />
      <div className="flex flex-wrap items-end gap-8">
        <Toggle name="featured" label="Featured" defaultChecked={entry?.featured} />
        <Number_
          name="order"
          label="Order"
          defaultValue={entry?.order ?? order}
        />
      </div>
    </div>
  );
}

export default async function ProjectsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; invalid?: string }>;
}) {
  const [entries, params] = await Promise.all([getProjects(), searchParams]);

  return (
    <>
      <PageHeading
        title="Projects"
        description="Titles and technology names stay untranslated."
      />
      <Saved show={params.saved === "1"} invalid={params.invalid} />

      <Card>
        <form action={createProject}>
          <p className="mb-5 font-mono text-xs text-accent">New project</p>
          <Fields order={entries.length} />
          <Actions>
            <SubmitButton>Add</SubmitButton>
          </Actions>
        </form>
      </Card>

      <div className="mt-6 flex flex-col gap-3">
        {entries.length === 0 && <Empty>No projects yet.</Empty>}

        {entries.map((entry) => (
          <Row
            key={entry.id}
            title={entry.title}
            meta={entry.featured ? "featured" : entry.slug}
          >
            <form action={updateProject}>
              <input type="hidden" name="id" value={entry.id} />
              <input type="hidden" name="previousSlug" value={entry.slug} />
              <Fields entry={entry} order={entry.order ?? 0} />
              <Actions>
                <SubmitButton />
              </Actions>
            </form>

            <form action={deleteProject} className="mt-3">
              <input type="hidden" name="id" value={entry.id} />
              <input type="hidden" name="slug" value={entry.slug} />
              <DeleteButton />
            </form>
          </Row>
        ))}
      </div>
    </>
  );
}
