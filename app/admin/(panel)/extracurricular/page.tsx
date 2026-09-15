import { DeleteButton, SubmitButton } from "@/components/admin/Buttons";
import {
  LocalizedText,
  Number_,
  Select,
  Text,
} from "@/components/admin/Fields";
import { Actions, Card, Empty, PageHeading, Row } from "@/components/admin/Panel";
import { Saved } from "@/components/admin/Saved";
import { pick } from "@/lib/localized";
import { getExtracurricular } from "@/lib/queries";
import {
  createExtracurricular,
  deleteExtracurricular,
  updateExtracurricular,
} from "./actions";

type Entry = Awaited<ReturnType<typeof getExtracurricular>>[number];

const TYPES = ["leadership", "project", "committee"];

function Fields({ entry, order }: { entry?: Entry; order: number }) {
  return (
    <div className="flex flex-col gap-5">
      <LocalizedText name="role" label="Role" value={entry?.role} required />
      <Text
        name="organization"
        label="Organization"
        defaultValue={entry?.organization}
      />
      <LocalizedText name="period" label="Period" value={entry?.period} />
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

export default async function ExtracurricularAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [entries, params] = await Promise.all([
    getExtracurricular(),
    searchParams,
  ]);

  return (
    <>
      <PageHeading
        title="Extracurricular"
        description="Clubs, committees and volunteer roles."
      />
      <Saved show={params.saved === "1"} />

      <Card>
        <form action={createExtracurricular}>
          <p className="mb-5 font-mono text-xs text-accent">New entry</p>
          <Fields order={entries.length} />
          <Actions>
            <SubmitButton>Add</SubmitButton>
          </Actions>
        </form>
      </Card>

      <div className="mt-6 flex flex-col gap-3">
        {entries.length === 0 && <Empty>No entries yet.</Empty>}

        {entries.map((entry) => (
          <Row
            key={entry.id}
            title={pick(entry.role, "fr")}
            meta={entry.organization ?? ""}
          >
            <form action={updateExtracurricular}>
              <input type="hidden" name="id" value={entry.id} />
              <Fields entry={entry} order={entry.order ?? 0} />
              <Actions>
                <SubmitButton />
              </Actions>
            </form>

            <form action={deleteExtracurricular} className="mt-3">
              <input type="hidden" name="id" value={entry.id} />
              <DeleteButton />
            </form>
          </Row>
        ))}
      </div>
    </>
  );
}
