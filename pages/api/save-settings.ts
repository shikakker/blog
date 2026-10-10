import prisma from "@/lib/prisma";
import { HttpMethod } from "@/types";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { canUpdateUserSettings } from "@/lib/settings-auth.mjs";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function SaveSiteSettings(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== HttpMethod.POST) {
    res.setHeader("Allow", [HttpMethod.POST]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const session = await getServerSession({ req, res }, authOptions);
  if (!session?.user?.id) return res.status(401).json({ error: "Unauthorized" });

  let data: { id?: string; name?: string | null; image?: string | null };
  try {
    data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  if (!canUpdateUserSettings({ sessionUserId: session.user.id, targetUserId: data?.id })) {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (data.name != null && (typeof data.name !== "string" || data.name.length > 120)) {
    return res.status(400).json({ error: "Invalid name" });
  }

  if (data.image != null && (typeof data.image !== "string" || data.image.length > 2048)) {
    return res.status(400).json({ error: "Invalid image URL" });
  }

  try {
    const response = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        image: data.image,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error("Failed to save user settings", error);
    return res.status(500).json({ error: "Failed to save settings" });
  }
}
