/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { JetBrains_Mono } from "next/font/google";
import { dracula, oneDark  } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";

const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"] });

interface MessageFormatterProps {
	content: string;
}

const MessageFormatter: React.FC<MessageFormatterProps> = ({ content }) => {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			rehypePlugins={[rehypeRaw]}
			components={{
				h1: ({ node, ...props }) => (
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold my-2 sm:my-4" {...props} />
                ),
                h2: ({ node, ...props }) => (
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold my-2 sm:my-3" {...props} />
                ),
                h3: ({ node, ...props }) => (
                    <h3 className="text-base sm:text-lg md:text-xl font-bold my-1 sm:my-2" {...props} />
                ),
                h4: ({ node, ...props }) => (
                    <h4 className="text-sm sm:text-base md:text-lg font-semibold my-1 sm:my-2" {...props} />
                ),
                h5: ({ node, ...props }) => (
                    <h5 className="text-xs sm:text-sm md:text-base font-semibold my-1" {...props} />
                ),
                h6: ({ node, ...props }) => (
                    <h6 className="text-xs font-semibold my-1" {...props} />
                ),
                p: ({ node, ...props }) => (
                    <p className="text-sm sm:text-base leading-relaxed my-1 sm:my-2" {...props} />
                ),
                a: ({ node, ...props }) => (
                    <a className="text-primary hover:underline break-all" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                    <blockquote
                        className="border-l-4 border-primary pl-2 sm:pl-4 italic text-gray-600 my-2 sm:my-4 text-sm sm:text-base"
                        {...props}
                    />
                ),
                ul: ({ node, ...props }) => (
                    <ul className="list-disc pl-4 sm:pl-6 my-1 sm:my-2 text-sm sm:text-base" {...props} />
                ),
                ol: ({ node, ...props }) => (
                    <ol className="list-decimal pl-4 sm:pl-6 my-1 sm:my-2 text-sm sm:text-base" {...props} />
                ),
                code: ({ className, style, ...props }) => {
                    let language;
                    if (className) {
                        language =
                            className.replace("language-", "") || "plainText";
                    }
                    const isInline = className === undefined;
                    return isInline ? (
                        <code
                            className={
                                "text-xs sm:text-sm text-primary p-0.5 bg-foreground/5 rounded-sm"
                            }
                        >
                            {props.children}
                        </code>
                    ) : (
                        <div
                            className={`${jetBrainsMono.className} text-xs sm:text-sm px-1 relative group`}
                        >
                            <div className="flex justify-between gap-2 items-center">
                                <span className="text-xs sm:text-sm text-foreground/80">
                                    {language}
                                </span>
                                <button className="p-2 flex sm:hidden text-xs">Copier le code</button>
                            </div>
                            <Button
                                variant={"outline"}
                                size={"icon"}
                                className="absolute hidden sm:flex top-9 right-3 opacity-0 group-hover:opacity-100 transition-all scale-100 active:scale-95 w-8 h-8"
                                onClick={() => {
                                    navigator.clipboard.writeText(String(props.children));
                                    toast.success(
                                        "Contenu ajouté dans le presse-papiers"
                                    );
                                }}
                            >
                                <Copy size={15} />
                            </Button>
                            <div className="overflow-x-auto rounded-md">
                                <SyntaxHighlighter
                                    language={language}
                                    style={oneDark}
                                    className={`${jetBrainsMono.className} antialiased max-w-full code-content`}
                                >
                                    {String(props.children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    );
                },
                pre: ({ node, ...props }) => (
                    <pre
                        className={`bg-foreground/5 text-foreground p-2 sm:p-4 rounded-lg overscroll-auto text-xs sm:text-sm`}
                        {...props}
                    />
                ),
                hr: ({ node, ...props }) => (
                    <hr
                        className="border-t border-foreground/10 my-2 sm:my-4"
                        {...props}
                    />
                ),
                strong: ({ node, ...props }) => (
                    <strong className="font-semibold" {...props} />
                ),
                em: ({ node, ...props }) => (
                    <em className="italic" {...props} />
                ),
                del: ({ node, ...props }) => (
                    <del className="line-through text-gray-500" {...props} />
                ),
                table: ({ node, ...props }) => (
                    <Table className="w-full border border-foreground/10 my-2 sm:my-4 text-xs sm:text-sm" {...props} />
                ),
                thead: ({ node, ...props }) => (
                    <thead className="bg-background/5 sr-only" {...props} />
                ),
                tbody: ({ node, ...props }) => (
                    <TableBody {...props} />
                ),
                tr: ({ node, ...props }) => (
                    <TableRow className="bg-background/10" {...props} />
                ),
                th: ({ node, ...props }) => (
                    <TableHead
                        className="px-2 sm:px-4 py-1 sm:py-2 text-left font-semibold"
                        {...props}
                    />
                ),
                td: ({ node, ...props }) => (
                    <TableCell className="px-2 sm:px-4 py-1 sm:py-2" {...props} />
                ),
			}}
		>
			{content}
		</ReactMarkdown>
	);
};

export default MessageFormatter;