import { AppSidebar } from "@/components/chat/app-sidebar";
import { SiteHeader } from "@/components/chat/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getUserChatList } from "@/data/chat";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function ChatLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session) {
		redirect("/login");
	}
	const chatList = await getUserChatList(session.user.id);
	return (
		<SidebarProvider>
			<AppSidebar chatList={chatList} />
			<SidebarInset>
				<SiteHeader />
				<div className="flex flex-1 flex-col">
					<div className="@container/main flex flex-1 flex-col gap-2">
						<div className="flex flex-col gap-4 py-16 md:gap-6 md:py-20 px-3 md:px-6">
							{children}
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
