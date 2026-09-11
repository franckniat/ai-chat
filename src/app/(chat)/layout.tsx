import { Suspense } from "react";
import { AppSidebar } from "@/components/chat/app-sidebar";
import { SettingsDialog } from "@/components/settings/settings-dialog";
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
	const chatList = await getUserChatList();
	return (
		<SidebarProvider>
			<AppSidebar chatList={chatList} />
			{/*
				`h-svh` + `overflow-hidden` fixent la hauteur de la coquille :
				seule la liste de messages defile (voir message-list.tsx).
				L'ancienne version empilait trois conteneurs scrollables — la
				coquille, le wrapper `overflow-y-auto` et la conversation — d'ou
				les deux barres de defilement superposees.
			*/}
			<SidebarInset className="h-svh overflow-hidden">
				<SiteHeader />
				<div className="@container/main flex min-h-0 flex-1 flex-col">
					{children}
				</div>
			</SidebarInset>

			{/*
				Monte une seule fois pour tout /chat. Son ouverture est portee par
				`?settings=` : `useSearchParams` impose une frontiere Suspense.
			*/}
			<Suspense fallback={null}>
				<SettingsDialog />
			</Suspense>
		</SidebarProvider>
	);
}
