"use client";

import FormChat from "./form-chat";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSession } from "@/lib/auth-client";
import { useChat } from "@ai-sdk/react";
import MessageFormatter from "./message-formatter";
import { useEffect, memo, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useRouter } from "next/navigation";
import { type Message as AIMessage } from "@ai-sdk/react";
import { Bot, Loader2 } from "lucide-react";
import { ChatSDKError } from "@/lib/errors";
import { toast } from "sonner";
import { useMessages } from "@/hooks/use-messages";
import { Session } from "@/lib/auth";

// Composant mémorisé pour chaque message
const MessageItem = memo(({ message, session }: { message: AIMessage; session: Session }) => (
	<div
		key={message.id}
		className="flex flex-col sm:flex-row gap-2 py-6 relative"
	>
		{message.role === "user" ? (
			<Avatar className="border-2 border-foreground/60 pointer-events-none cursor-pointer">
				{session?.user.image ? (
					<AvatarImage src={session?.user.image} />
				) : (
					<AvatarFallback>
						{session?.user.name
							?.charAt(0)
							.toUpperCase()}
					</AvatarFallback>
				)}
			</Avatar>
		) : (
			<Avatar className="border-2 border-primary cursor-pointer pointer-events-none flex items-center justify-center">
				<Bot size={20} />
			</Avatar>
		)}
		<div className="flex-1 space-y-2 group">
			<p className="font-bold group-hover:text-primary">
				{message.role == "user"
					? session?.user?.name
					: "niato ai 🏄"}
			</p>
			<div className="result-ai text-foreground/90">
				<MessageFormatter content={message.content} />
			</div>
			<div className="absolute -bottom-2 right-2 group-hover:block hidden">
				<p className="text-sm text-foreground/40">
					{message.createdAt &&
						message.createdAt.toLocaleTimeString(
							"fr-FR",
							{
								hour: "2-digit",
								minute: "2-digit",
							}
						)}
				</p>
			</div>
		</div>
	</div>
));

MessageItem.displayName = 'MessageItem';

export default function MessagesContent({
	id,
	initialMessages = [],
}: {
	id?: string;
	initialMessages?: AIMessage[];
}) {
	const { data: session } = useSession();
	const router = useRouter();
	const [isCreatingChat, setIsCreatingChat] = useState(false);
	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		status,
		stop,
		error,
		reload,
		setMessages,
	} = useChat({
		api: `/api/chat/${id as string}`,
		initialMessages: initialMessages,
		onError: (error) => {
			if (error instanceof ChatSDKError) {
				toast.error(error.message);
			}
		},
	});

	const handleFirstSubmit = async (e?: React.FormEvent) => {
		if (e && typeof e.preventDefault === 'function') {
			e.preventDefault();
		}

		setIsCreatingChat(true);

		try {
			const res = await fetch("/api/chat/new", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ message: input }),
			});

			if (!res.ok) {
				console.error("Error creating chat:", res.statusText);
				toast.error("Erreur lors de la création du chat");
				return;
			}

			const { chatId } = await res.json();
			// Redirection simple, la réponse IA est déjà générée
			router.push(`/chat/${chatId}`);
		} catch (error) {
			console.error("Error creating chat:", error);
			toast.error("Erreur lors de la création du chat");
		} finally {
			setIsCreatingChat(false);
		}
	};	const {
		containerRef,
		endRef,
		isAtBottom,
		scrollToBottom,
		onViewportEnter,
		onViewportLeave,
		hasSentMessage,
	} = useMessages({
		chatId: id || '',
		status,
	});

	useEffect(() => {
		if (id && initialMessages.length > 0) {
			setMessages(initialMessages);
		} else if (!id) {
			setMessages([]);
		}
	}, [id, initialMessages, setMessages]);

	// Gestion automatique du défilement avec Intersection Observer
	useEffect(() => {
		const endElement = endRef.current;
		if (!endElement) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					onViewportEnter();
				} else {
					onViewportLeave();
				}
			},
			{
				threshold: 0.1,
				rootMargin: '0px 0px -100px 0px',
			}
		);

		observer.observe(endElement);

		return () => {
			observer.disconnect();
		};
	}, [onViewportEnter, onViewportLeave, endRef]);

	// Défilement automatique lors de nouveaux messages si l'utilisateur est en bas
	useEffect(() => {
		if (hasSentMessage && (isAtBottom || status === 'streaming')) {
			// Debounce le scroll pour éviter les appels excessifs
			const timer = setTimeout(() => {
				scrollToBottom('smooth');
			}, 50);
			return () => clearTimeout(timer);
		}
	}, [messages.length, hasSentMessage, isAtBottom, status, scrollToBottom]);

	const examples = useMemo(() => [
		{
			title: "Write an email",
			content: "Write an email to my boss.",
		},
		{
			title: "Learn React",
			content: "What is React?",
		},
		{
			title: "Write a poem",
			content: "Write a poem about the sea.",
		},
		{
			title: "Tell a joke",
			content: "Tell me a joke about cats.",
		},
	], []);

	return (
		<div className="relative pb-24">
			<div
				ref={containerRef}
				className="space-y-3 md:space-y-5 max-w-[800px] mx-auto px-3"
			>
				{!id && (
					<div className="space-y-3 flex flex-col items-center">
						<h1 className="text-2xl font-bold text-center">
							niato ai 🏄
						</h1>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
							{examples.map((example) => (
								<Card
									key={example.title}
									className="cursor-pointer hover:bg-foreground/5"
								>
									<CardContent>
										<p className="text-base font-bold">
											{example.title}
										</p>
										<p className="text-sm">
											{example.content}
										</p>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				)}
				{messages.map((m) => (
					<MessageItem key={m.id} message={m} session={session as Session} />
				))}
				{(status === 'submitted' || isCreatingChat) && (
					<div className="flex flex-col sm:flex-row gap-2 py-6 relative">
						<Avatar className="border-2 border-primary cursor-pointer pointer-events-none flex items-center justify-center">
							<Bot size={20} />
						</Avatar>
						<div className="flex-1 space-y-2 group">
							<p className="font-bold group-hover:text-primary">
								niato ai 🏄
							</p>
							<div className="result-ai text-foreground/90">
								<div className="flex items-center space-x-2">
									<Loader2 className="w-4 h-4 animate-spin text-primary" />
									<span className="text-sm text-foreground/60">
										{isCreatingChat ? 'Création de la conversation...' : 'Réflexion en cours...'}
									</span>
								</div>
							</div>
						</div>
					</div>
				)}
				{error && (
					<div className="space-y-2">
						<div className="text-red-500">Une erreur s&apos;est produite.</div>
						<Button type="button" onClick={() => reload()} variant="outline" size="sm">
							Réessayer
						</Button>
					</div>
				)}
				<div
					ref={endRef}
					className="h-1"
				/>
			</div>
			<FormChat
				name="prompt"
				input={input}
				handleInputChange={handleInputChange}
				handleSubmit={id ? handleSubmit : handleFirstSubmit}
				isLoading={status === "streaming" || status === "submitted" || isCreatingChat}
				stop={stop}
			/>
		</div>
	);
}
