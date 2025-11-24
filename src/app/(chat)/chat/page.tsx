import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ChatInitializer from "@/components/chat/chat-initializer";
import MessageList from "@/components/chat/message-list";

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        redirect("/login?next=/chat");
    }
    return (
        <>
            <ChatInitializer id={null} initialMessages={[]} />
            <MessageList />
        </>
    );
}
