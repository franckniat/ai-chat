import { Skeleton } from "@/components/ui/skeleton";

/**
 * Le layout chat attend `getUserChatList()` avant de rendre quoi que ce soit.
 * Sans ce fichier, la navigation reste figee sur la page precedente.
 */
export default function ChatLoading() {
	return (
		<div className="mx-auto w-full max-w-[800px] space-y-6 px-3 py-8">
			<div className="space-y-3">
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-20 w-full rounded-lg" />
			</div>
			<div className="space-y-3">
				<Skeleton className="h-4 w-32" />
				<Skeleton className="h-32 w-full rounded-lg" />
			</div>
			<span className="sr-only">Loading conversation…</span>
		</div>
	);
}
