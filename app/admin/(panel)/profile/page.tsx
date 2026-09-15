import { SubmitButton } from "@/components/admin/Buttons";
import {
  LocalizedLines,
  LocalizedText,
  Text,
} from "@/components/admin/Fields";
import { Actions, Card, PageHeading } from "@/components/admin/Panel";
import { UploadField } from "@/components/admin/UploadField";
import { Saved } from "@/components/admin/Saved";
import { getProfile } from "@/lib/queries";
import { saveProfile } from "./actions";

export default async function ProfileAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [profile, params] = await Promise.all([getProfile(), searchParams]);

  return (
    <>
      <PageHeading
        title="Profile"
        description="Hero, about text, contact details and resume links."
      />
      <Saved show={params.saved === "1"} />

      <form action={saveProfile}>
        <input type="hidden" name="id" value={profile?.id ?? ""} />

        <div className="flex flex-col gap-6">
          <Card>
            <div className="flex flex-col gap-5">
              <Text
                name="name"
                label="Name"
                required
                defaultValue={profile?.name}
              />
              <LocalizedText
                name="title"
                label="Title"
                value={profile?.title}
                required
              />
              <LocalizedText
                name="tagline"
                label="Tagline"
                value={profile?.tagline}
              />
              <LocalizedText
                name="availability"
                label="Availability badge"
                value={profile?.availability}
              />
            </div>
          </Card>

          <Card>
            <LocalizedLines
              name="aboutSummary"
              label="About paragraphs"
              value={profile?.aboutSummary}
              rows={8}
            />
          </Card>

          <Card>
            <div className="grid gap-5 sm:grid-cols-2">
              <Text
                name="location"
                label="Location"
                defaultValue={profile?.location}
              />
              <Text
                name="email"
                label="Email"
                type="email"
                defaultValue={profile?.email}
              />
              <Text name="phone" label="Phone" defaultValue={profile?.phone} />
              <Text
                name="githubUrl"
                label="GitHub URL"
                defaultValue={profile?.githubUrl}
              />
            </div>
          </Card>

          <Card>
            <div className="flex flex-col gap-6">
              <UploadField
                name="avatarUrl"
                label="Photo"
                hint="upload, or paste an image URL"
                folder="portfolio/profile"
                defaultValue={profile?.avatarUrl}
              />
              <div className="grid gap-6 sm:grid-cols-2">
                <UploadField
                  name="resumeUrlFr"
                  label="CV (FR)"
                  folder="portfolio/profile"
                  resourceType="raw"
                  accept="application/pdf"
                  preview={false}
                  defaultValue={profile?.resumeUrlFr}
                />
                <UploadField
                  name="resumeUrlEn"
                  label="CV (EN)"
                  folder="portfolio/profile"
                  resourceType="raw"
                  accept="application/pdf"
                  preview={false}
                  defaultValue={profile?.resumeUrlEn}
                />
              </div>
            </div>
          </Card>
        </div>

        <Actions>
          <SubmitButton />
        </Actions>
      </form>
    </>
  );
}
