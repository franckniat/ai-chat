/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeRaw from 'rehype-raw'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table'
import { Artifact } from './artifact'
import { parseArtifacts, hasArtifacts } from '@/lib/artifact-parser'
import { customVscDarkPlus } from '@/lib/syntax-theme'

interface MessageFormatterProps {
    content: string
}

const MessageFormatter: React.FC<MessageFormatterProps> = memo(({ content }) => {
    const { artifacts, cleanText } = hasArtifacts(content)
        ? parseArtifacts(content)
        : { artifacts: [], cleanText: content }

    return (
        <div>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeRaw, rehypeKatex]}
                components={{
                    p: ({ node, ...props }) => (
                        <p
                            className="text-sm sm:text-base leading-normal my-1 sm:my-2"
                            {...props}
                        />
                    ),
                    a: ({ node, ...props }) => (
                        <a className="text-primary hover:underline break-all inline-block" {...props} />
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
                            <div className="">
                                <div className="flex items-center justify-between p-2">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        {language || 'code'}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 px-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigator.clipboard.writeText(String(props.children));
                                            toast.success("Code copié dans le presse-papiers");
                                        }}
                                    >
                                        <Copy size={12} className="mr-1" />
                                        <span className="text-xs">Copier</span>
                                    </Button>
                                </div>
                                <div className="overflow-x-auto">
                                    <SyntaxHighlighter
                                        language={language}
                                        style={customVscDarkPlus}
                                        className="antialiased text-sm tracking-wide [&_code]:!font-mono"
                                        customStyle={{
                                            fontFamily: 'var(--font-jetbrains-mono), "JetBrains Mono", "Fira Code", Consolas, monospace !important',
                                            fontSize: '0.875rem',
                                            lineHeight: '1.5',
                                            margin: 0,
                                            padding: '1rem',
                                            background: 'transparent',
                                        }}
                                        codeTagProps={{
                                            style: {
                                                fontFamily: 'var(--font-jetbrains-mono), "JetBrains Mono", "Fira Code", Consolas, monospace !important',
                                            }
                                        }}
                                        showLineNumbers={false}
                                        wrapLines={true}
                                        wrapLongLines={true}
                                    >
                                        {String(props.children).replace(/\n$/, "")}
                                    </SyntaxHighlighter>
                                </div>
                            </div>
                        );
                    },
                    table: ({ node, ...props }) => (
                        <Table
                            className="w-full border border-foreground/10 my-2 sm:my-4 text-xs sm:text-sm"
                            {...props}
                        />
                    ),
                    thead: ({ node, ...props }) => (
                        <thead className="bg-background/5 sr-only" {...props} />
                    ),
                    tbody: ({ node, ...props }) => <TableBody {...props} />,
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
                {cleanText}
            </ReactMarkdown>

            {artifacts.map((artifact) => (
                <Artifact
                    key={artifact.id}
                    id={artifact.id}
                    type={artifact.type}
                    language={artifact.language}
                    title={artifact.title}
                    content={artifact.content}
                />
            ))}
        </div>
    )
})

MessageFormatter.displayName = 'MessageFormatter'

export default MessageFormatter
