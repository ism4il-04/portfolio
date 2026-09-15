import { DeleteButton, SubmitButton } from "@/components/admin/Buttons";
import { Empty, PageHeading, Row } from "@/components/admin/Panel";
import { getMessages } from "@/lib/queries";
import { deleteMessage, setRead } from "./actions";

export default async function MessagesAdminPage() {
  const messages = await getMessages();
  const unread = messages.filter((message) => !message.isRead).length;

  return (
    <>
      <PageHeading
        title="Messages"
        description={`${messages.length} total · ${unread} unread`}
      />

      <div className="flex flex-col gap-3">
        {messages.length === 0 && <Empty>No messages yet.</Empty>}

        {messages.map((message) => (
          <Row
            key={message.id}
            title={`${message.isRead ? "" : "● "}${message.name}${
              message.subject ? ` — ${message.subject}` : ""
            }`}
            meta={message.createdAt?.toLocaleDateString("en-GB") ?? ""}
          >
            <dl className="mb-5 grid gap-x-6 gap-y-2 font-mono text-xs sm:grid-cols-[auto_1fr]">
              <dt className="text-line-2">from</dt>
              <dd>
                <a
                  href={`mailto:${message.email}`}
                  className="text-muted transition-colors hover:text-accent"
                >
                  {message.email}
                </a>
              </dd>
              <dt className="text-line-2">locale</dt>
              <dd className="text-muted">{message.locale}</dd>
              <dt className="text-line-2">received</dt>
              <dd className="text-muted">
                {message.createdAt?.toISOString().replace("T", " ").slice(0, 16)}
              </dd>
            </dl>

            {/*
              Rendered as a text node, never as HTML. This is visitor-supplied
              content displayed inside an authenticated session — interpolating
              it as markup would be stored XSS against the admin.
            */}
            <p className="rounded-lg border border-line bg-panel-2/40 p-4 text-sm leading-relaxed whitespace-pre-wrap text-muted">
              {message.body}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-5">
              <form action={setRead}>
                <input type="hidden" name="id" value={message.id} />
                <input
                  type="hidden"
                  name="isRead"
                  value={message.isRead ? "off" : "on"}
                />
                <SubmitButton>
                  {message.isRead ? "Mark unread" : "Mark read"}
                </SubmitButton>
              </form>

              <a
                href={`mailto:${message.email}?subject=${encodeURIComponent(
                  `Re: ${message.subject || "your message"}`,
                )}`}
                className="rounded-lg border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-accent/50 hover:text-fg"
              >
                Reply
              </a>

              <form action={deleteMessage} className="ml-auto">
                <input type="hidden" name="id" value={message.id} />
                <DeleteButton />
              </form>
            </div>
          </Row>
        ))}
      </div>
    </>
  );
}
