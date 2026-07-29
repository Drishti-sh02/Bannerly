// Remove @remix-run/node
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export async function action({ request, params }) {
  const { session } = await authenticate.admin(request);
  const method = request.method;
  const { id } = params;

  if (method === "PUT") {
    const data = await request.json();
    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.position !== undefined) updateData.position = data.position;
    if (data.configuration !== undefined) updateData.configuration = data.configuration;
    if (data.targetPages !== undefined) updateData.targetPages = data.targetPages;
    if (data.planUsed !== undefined) updateData.planUsed = data.planUsed;

    if (data.status === "Published") {
      updateData.publishedAt = new Date();
    } else if (data.status === "Scheduled" && data.scheduledAt) {
      updateData.scheduledAt = new Date(data.scheduledAt);
    }

    const announcement = await prisma.announcement.update({
      where: { id, shop: session.shop },
      data: updateData
    });

    if (data.status && data.status !== "Draft") {
      await prisma.publishingHistory.create({
        data: {
          announcementId: announcement.id,
          status: data.status
        }
      });
    }

    return Response.json(announcement);
  }

  if (method === "DELETE") {
    await prisma.announcement.delete({
      where: { id, shop: session.shop }
    });
    return Response.json({ success: true });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
