// Remove @remix-run/node
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  const announcements = await prisma.announcement.findMany({
    where: { shop: session.shop },
    orderBy: { createdAt: 'desc' },
    include: { history: true }
  });
  return Response.json(announcements);
}

export async function action({ request }) {
  const { session } = await authenticate.admin(request);
  const method = request.method;

  if (method === "POST") {
    const data = await request.json();
    const announcement = await prisma.announcement.create({
      data: {
        shop: session.shop,
        name: data.name || "Untitled Banner",
        status: data.status || "Draft",
        position: data.position || "Top",
        configuration: data.configuration || {},
        targetPages: data.targetPages || [],
        planUsed: data.planUsed || "Free"
      }
    });

    if (data.status === "Published" || data.status === "Scheduled") {
      await prisma.publishingHistory.create({
        data: {
          announcementId: announcement.id,
          status: data.status
        }
      });
    }

    return Response.json(announcement);
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
