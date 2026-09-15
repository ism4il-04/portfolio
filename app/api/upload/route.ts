import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";

// Folders are an allow-list rather than caller-supplied text: the signature
// authorises whatever folder it is signed with, so a free-form value would let
// a signed request write anywhere in the account.
const Body = z.object({
  folder: z.enum(["portfolio/profile", "portfolio/projects"]),
  resourceType: z.enum(["image", "raw"]),
});

export async function POST(request: Request) {
  // The middleware matcher excludes /api, so this route guards itself.
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!apiKey || !apiSecret || !cloudName) {
    return NextResponse.json(
      { error: "Cloudinary is not configured" },
      { status: 500 },
    );
  }

  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = parsed.data.folder;

  // Every parameter the browser sends must also be signed, or Cloudinary
  // rejects the upload.
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    apiSecret,
  );

  return NextResponse.json({
    cloudName,
    apiKey,
    timestamp,
    signature,
    folder,
    resourceType: parsed.data.resourceType,
  });
}
