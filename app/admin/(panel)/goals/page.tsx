import { DeleteButton, SubmitButton } from "@/components/admin/Buttons";
import {
  LocalizedText,
  Number_,
  Select,
  Toggle,
} from "@/components/admin/Fields";
import { Actions, Card, Empty, PageHeading, Row } from "@/components/admin/Panel";
import { Saved } from "@/components/admin/Saved";
import { db } from "@/lib/db";
import { pick } from "@/lib/localized";
import { goals as goalsTable } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { createGoal, deleteGoal, updateGoal } from "./actions";

type Entry = typeof goalsTable.$inferSelect;

const TERMS = ["short_term", "long_term"];

function Fields({ entry, order }: { entry?: Entry; order: number }) {
  return (
    <div className="flex flex-col gap-5">
      <LocalizedText name="text" label="Goal" value={entry?.text} required />
      <div className="flex flex-wrap items-end gap-8">
        <Select
          name="term"
          label="Term"
          options={TERMS}
          defaultValue={entry?.term}
        />
        <Toggle
          name="isPublic"
          label="Visible on the site"
          defaultChecked={entry?.isPublic ?? true}
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

export default async function GoalsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  // Reads every goal, including hidden ones the public queries filter out.
  const [entries, params] = await Promise.all([
    db.select().from(goalsTable).orderBy(asc(goalsTable.order)),
    searchParams,
  ]);

  return (
    <>
      <PageHeading
        title="Goals"
        description="Hidden goals stay in the database but never reach the site."
      />
      <Saved show={params.saved === "1"} />

      <Card>
        <form action={createGoal}>
          <p className="mb-5 font-mono text-xs text-accent">New goal</p>
          <Fields order={entries.length} />
          <Actions>
            <SubmitButton>Add</SubmitButton>
          </Actions>
        </form>
      </Card>

      <div className="mt-6 flex flex-col gap-3">
        {entries.length === 0 && <Empty>No goals yet.</Empty>}

        {entries.map((entry) => (
          <Row
            key={entry.id}
            title={pick(entry.text, "fr")}
            meta={`${entry.term}${entry.isPublic ? "" : " · hidden"}`}
          >
            <form action={updateGoal}>
              <input type="hidden" name="id" value={entry.id} />
              <Fields entry={entry} order={entry.order ?? 0} />
              <Actions>
                <SubmitButton />
              </Actions>
            </form>

            <form action={deleteGoal} className="mt-3">
              <input type="hidden" name="id" value={entry.id} />
              <DeleteButton />
            </form>
          </Row>
        ))}
      </div>
    </>
  );
}
