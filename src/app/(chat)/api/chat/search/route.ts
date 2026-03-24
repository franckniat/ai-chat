import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() ?? "";

    if (!query) {
        return NextResponse.json({ items: [] });
    }

    const chats = await prisma.chat.findMany({
        where: {
            userId: session.user.id,
            deleted: false,
            OR: [
                {
                    title: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
                {
                    messages: {
                        some: {
                            deleted: false,
                            content: {
                                contains: query,
                                mode: "insensitive",
                            },
                        },
                    },
                },
            ],
        },
        select: {
            id: true,
            title: true,
            updatedAt: true,
        },
        orderBy: {
            updatedAt: "desc",
        },
        take: 20,
    });

    return NextResponse.json({ items: chats });
}
