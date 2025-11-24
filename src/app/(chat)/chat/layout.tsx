import ChatProvider from "@/components/chat/chat-provider";

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ChatProvider>
            {children}
        </ChatProvider>
    );
}
