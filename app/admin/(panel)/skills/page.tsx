import { DeleteButton, SubmitButton } from "@/components/admin/Buttons";
import { Number_, Select, Text } from "@/components/admin/Fields";
import { Actions, Card, Empty, PageHeading, Row } from "@/components/admin/Panel";
import { Saved } from "@/components/admin/Saved";
import { getSkills } from "@/lib/queries";
import { createSkill, deleteSkill, updateSkill } from "./actions";

const CATEGORIES = ["languages", "frameworks", "databases", "tools"];

export default async function SkillsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [grouped, params] = await Promise.all([getSkills(), searchParams]);
  const all = [...grouped.values()].flat().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <>
      <PageHeading
        title="Skills"
        description="Not translated — technology names stay as they are."
      />
      <Saved show={params.saved === "1"} />

      <Card>
        <form action={createSkill}>
          <div className="grid items-end gap-4 sm:grid-cols-[1fr_1fr_auto_auto]">
            <Text name="name" label="Name" required placeholder="Kubernetes" />
            <Select name="category" label="Category" options={CATEGORIES} />
            <Number_ name="order" label="Order" defaultValue={all.length} />
            <SubmitButton>Add</SubmitButton>
          </div>
        </form>
      </Card>

      <div className="mt-6 flex flex-col gap-3">
        {all.length === 0 && <Empty>No skills yet.</Empty>}

        {all.map((skill) => (
          <Row key={skill.id} title={skill.name} meta={skill.category}>
            <form action={updateSkill}>
              <input type="hidden" name="id" value={skill.id} />
              <div className="grid items-end gap-4 sm:grid-cols-[1fr_1fr_auto]">
                <Text name="name" label="Name" required defaultValue={skill.name} />
                <Select
                  name="category"
                  label="Category"
                  options={CATEGORIES}
                  defaultValue={skill.category}
                />
                <Number_ name="order" label="Order" defaultValue={skill.order} />
              </div>
              <Actions>
                <SubmitButton />
              </Actions>
            </form>

            <form action={deleteSkill} className="mt-3">
              <input type="hidden" name="id" value={skill.id} />
              <DeleteButton />
            </form>
          </Row>
        ))}
      </div>
    </>
  );
}
