import { DeleteButton, SubmitButton } from "@/components/admin/Buttons";
import {
  LocalizedLines,
  LocalizedText,
  Number_,
  Text,
} from "@/components/admin/Fields";
import { Actions, Card, Empty, PageHeading, Row } from "@/components/admin/Panel";
import { Saved } from "@/components/admin/Saved";
import { pick } from "@/lib/localized";
import { getEducation } from "@/lib/queries";
import type { LocalizedList } from "@/lib/schema";
import { createEducation, deleteEducation, updateEducation } from "./actions";

type Entry = Awaited<ReturnType<typeof getEducation>>[number];

function achievementsValue(entry: Entry): LocalizedList {
  return {
    fr: entry.achievements.map((a) => a.achievement.fr),
    en: entry.achievements.map((a) => a.achievement.en),
  };
}

function Fields({
  entry,
  order,
}: {
  entry?: Entry;
  order: number;
}) {
  return (
    <div className="flex flex-col gap-5">
      <LocalizedText
        name="degree"
        label="Degree"
        value={entry?.degree}
        required
      />
      <LocalizedText name="field" label="Field" value={entry?.field} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Text
          name="institution"
          label="Institution"
          defaultValue={entry?.institution}
        />
        <Text name="location" label="Location" defaultValue={entry?.location} />
      </div>
      <LocalizedText name="period" label="Period" value={entry?.period} />
      <LocalizedLines
        name="achievements"
        label="Achievements"
        value={entry ? achievementsValue(entry) : null}
      />
      <Number_ name="order" label="Order" defaultValue={entry?.order ?? order} />
    </div>
  );
}

export default async function EducationAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [entries, params] = await Promise.all([getEducation(), searchParams]);

  return (
    <>
      <PageHeading title="Education" description="Degrees and achievements." />
      <Saved show={params.saved === "1"} />

      <Card>
        <form action={createEducation}>
          <p className="mb-5 font-mono text-xs text-accent">New entry</p>
          <Fields order={entries.length} />
          <Actions>
            <SubmitButton>Add</SubmitButton>
          </Actions>
        </form>
      </Card>

      <div className="mt-6 flex flex-col gap-3">
        {entries.length === 0 && <Empty>No education entries yet.</Empty>}

        {entries.map((entry) => (
          <Row
            key={entry.id}
            title={pick(entry.degree, "fr")}
            meta={pick(entry.period, "fr")}
          >
            <form action={updateEducation}>
              <input type="hidden" name="id" value={entry.id} />
              <Fields entry={entry} order={entry.order ?? 0} />
              <Actions>
                <SubmitButton />
              </Actions>
            </form>

            <form action={deleteEducation} className="mt-3">
              <input type="hidden" name="id" value={entry.id} />
              <DeleteButton />
            </form>
          </Row>
        ))}
      </div>
    </>
  );
}
