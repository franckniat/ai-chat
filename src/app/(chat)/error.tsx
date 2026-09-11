"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ChatError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="mx-auto flex min-h-[50vh] w-full max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
			<h2 className="text-xl font-semibold">Something went wrong</h2>
			<p className="text-muted-foreground text-sm">
				This conversation could not be loaded. You can retry, or go back to your
				chat list.
			</p>
			<div className="flex gap-2">
				<Button onClick={reset}>Try again</Button>
				<Button variant="outline" onClick={() => window.location.assign("/chat")}>
					Back to chats
				</Button>
			</div>
		</div>
	);
}
