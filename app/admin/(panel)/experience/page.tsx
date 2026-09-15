import { DeleteButton, SubmitButton } from "@/components/admin/Buttons";
import {
  CsvText,
  LocalizedArea,
  LocalizedLines,
  LocalizedText,
  Number_,
  Select,
  Text,
} from "@/components/admin/Fields";
import { Actions, Card, Empty, PageHeading, Row } from "@/components/admin/Panel";
import { Saved } from "@/components/admin/Saved";
import { pick } from "@/lib/localized";
import { getExperience } from "@/lib/queries";
import {
  createExperience,
  deleteExperience,
  updateExperience,
} from "./actions";

type Entry = Awaited<ReturnType<typeof getExperience>>[number];

const TYPES = ["internship", "job"];

function Fields({ entry, order }: { entry?: Entry; order: number }) {
  return (
    <div className="flex flex-col gap-5">
      <LocalizedText
        name="position"
        label="Position"
        value={entry?.position}
        required
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Text name="company" label="Company" defaultValue={entry?.company} />
        <Text name="location" label="Location" defaultValue={entry?.location} />
      </div>
      <LocalizedText name="period" label="Period" value={entry?.period} />
      <LocalizedText name="duration" label="Duration" value={entry?.duration} />
      <LocalizedArea
        name="description"
        label="Description"
        value={entry?.description}
        rows={3}
      />
      <LocalizedLines
        name="responsibilities"
        label="Responsibilities"
        value={entry?.responsibilities}
        rows={6}
      />
      <CsvText
        name="technologies"
        label="Technologies"
        value={entry?.technologies}
        placeholder="Playwright, Git, GitHub"
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          name="type"
          label="Type"
          options={TYPES}
          defaultValue={entry?.type}
        />
        <Number_
          name="order"
          label="Order"
          defaultValue={entry?.order ?? order}
        />
      </div>
    </div>
  );
}

export default async function ExperienceAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [entries, params] = await Promise.all([getExperience(), searchParams]);

  return (
    <>
      <PageHeading title="Experience" description="Internships and jobs." />
      <Saved show={params.saved === "1"} />

      <Card>
        <form action={createExperience}>
          <p className="mb-5 font-mono text-xs text-accent">New entry</p>
          <Fields order={entries.length} />
          <Actions>
            <SubmitButton>Add</SubmitButton>
          </Actions>
        </form>
      </Card>

      <div className="mt-6 flex flex-col gap-3">
        {entries.length === 0 && <Empty>No experience entries yet.</Empty>}

        {entries.map((entry) => (
          <Row
            key={entry.id}
            title={pick(entry.position, "fr")}
            meta={entry.company ?? ""}
          >
            <form action={updateExperience}>
              <input type="hidden" name="id" value={entry.id} />
              <Fields entry={entry} order={entry.order ?? 0} />
              <Actions>
                <SubmitButton />
              </Actions>
            </form>

            <form action={deleteExperience} className="mt-3">
              <input type="hidden" name="id" value={entry.id} />
              <DeleteButton />
            </form>
          </Row>
        ))}
      </div>
    </>
  );
}
