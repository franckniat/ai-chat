"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomeError({
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
		<div className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
			<h2 className="text-xl font-semibold">Something went wrong</h2>
			<p className="text-muted-foreground text-sm">
				This page failed to load. Please try again.
			</p>
			<div className="flex gap-2">
				<Button onClick={reset}>Try again</Button>
				<Button variant="outline" asChild>
					<Link href="/">Back home</Link>
				</Button>
			</div>
		</div>
	);
}
