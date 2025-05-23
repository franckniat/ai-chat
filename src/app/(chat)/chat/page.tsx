import { redirect } from "next/navigation";
//import { createChat } from "@/lib/chat-store";
import MessagesContent from "@/components/chat/messages";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        redirect("/login?next=/chat");
    }
    return (
        <>
            <MessagesContent />
        </>
    );
}
