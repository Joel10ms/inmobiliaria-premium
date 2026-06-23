import { db }       from "@/lib/db";
import type { Inquiry } from "@/types";

const DB_AVAILABLE = Boolean(process.env.DATABASE_URL);

export interface CreateInquiryInput {
  name:        string;
  email:       string;
  phone?:      string;
  message:     string;
  propertyId?: string;
  source?:     Inquiry["source"];
}

export async function createInquiry(input: CreateInquiryInput): Promise<{ id: string }> {
  if (!DB_AVAILABLE) {
    // Dev: just return a fake id
    console.log("[inquiry] DB not available — would have created:", input);
    return { id: `mock-${Date.now()}` };
  }
  const row = await db.inquiry.create({
    data: {
      name:       input.name,
      email:      input.email,
      phone:      input.phone,
      message:    input.message,
      source:     input.source ?? "WEB",
      status:     "NUEVO",
      ...(input.propertyId ? { property: { connect: { id: input.propertyId } } } : {}),
    },
    select: { id: true },
  });
  return { id: row.id };
}

/** Admin: all inquiries with related data */
export async function getInquiries() {
  if (!DB_AVAILABLE) return [];
  try {
    return await db.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        property: { select: { id: true, title: true, slug: true } },
        agent:    { select: { id: true, name: true, lastName: true } },
        notes:    { orderBy: { createdAt: "asc" } },
      },
    });
  } catch {
    return [];
  }
}

export async function updateInquiryStatus(id: string, status: Inquiry["status"]): Promise<void> {
  if (!DB_AVAILABLE) return;
  await db.inquiry.update({ where: { id }, data: { status } });
}

export async function addInquiryNote(
  inquiryId: string,
  text: string
): Promise<{ id: string; text: string; createdAt: Date }> {
  if (!DB_AVAILABLE) {
    const mock = { id: `note-${Date.now()}`, text, createdAt: new Date() };
    console.log("[inquiryNote] DB not available — mock note:", mock);
    return mock;
  }
  const row = await db.inquiryNote.create({
    data:   { inquiryId, content: text },
    select: { id: true, content: true, createdAt: true },
  });
  return { id: row.id, text: row.content, createdAt: row.createdAt };
}
