import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";
import { pick } from "@/lib/localized";
import { getProfile } from "@/lib/queries";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Portfolio";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const profile = await getProfile();

  const name = profile?.name ?? "Portfolio";
  const title = pick(profile?.title, locale);
  const availability = pick(profile?.availability, locale);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#070a10",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 6,
            background: "linear-gradient(90deg, #38bdf8 0%, #a78bfa 100%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#4ade80",
            }}
          />
          <div style={{ fontSize: 26, color: "#8497ad" }}>~/ismail</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 82,
              fontWeight: 700,
              color: "#e3ebf4",
              letterSpacing: -2,
            }}
          >
            {name}
          </div>
          {title && (
            <div style={{ fontSize: 40, color: "#38bdf8", marginTop: 14 }}>
              {title}
            </div>
          )}
        </div>

        {availability && (
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              fontSize: 26,
              color: "#4ade80",
              border: "1px solid rgba(74, 222, 128, 0.35)",
              borderRadius: 999,
              padding: "12px 26px",
            }}
          >
            {availability}
          </div>
        )}
      </div>
    ),
    size,
  );
}
