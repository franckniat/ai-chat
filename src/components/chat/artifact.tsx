import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { JetBrains_Mono } from 'next/font/google'
import { Button } from '@/components/ui/button'
import { Copy, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'] })

interface ArtifactProps {
    id: string
    type: 'code' | 'html' | 'markdown' | 'text'
    language?: string
    title: string
    content: string
}

export const Artifact: React.FC<ArtifactProps> = ({
    id,
    type,
    language = 'javascript',
    title,
    content,
}) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(content)
        toast.success('Contenu copié dans le presse-papiers')
    }

    const renderContent = () => {
        switch (type) {
            case 'code':
                return (
                    <div className="relative group">
                        <div className="overflow-x-auto">
                            <SyntaxHighlighter
                                language={language}
                                style={oneDark}
                                className="!m-0 !bg-transparent"
                                customStyle={{
                                    margin: 0,
                                    padding: '1rem',
                                    background: 'transparent',
                                    fontSize: '0.875rem',
                                    lineHeight: '1.5',
                                    fontFamily:
                                        'var(--font-jetbrains-mono), "JetBrains Mono", "Fira Code", Consolas, monospace',
                                }}
                                showLineNumbers={false}
                                wrapLines={true}
                                wrapLongLines={true}
                            >
                                {content}
                            </SyntaxHighlighter>
                        </div>
                    </div>
                )
            case 'html':
                return (
                    <div className="relative">
                        <div className="flex justify-between items-center mb-2 p-2 bg-muted rounded-t-md">
                            <span className="text-sm font-medium">Aperçu HTML</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCopy}
                                className="h-7"
                            >
                                <Copy size={14} className="mr-1" />
                                Copier
                            </Button>
                        </div>
                        <iframe
                            srcDoc={content}
                            className="w-full h-96 border rounded-b-md bg-white"
                            sandbox="allow-scripts allow-same-origin"
                            title={title}
                        />
                    </div>
                )
            case 'markdown':
                return (
                    <div className="relative group">
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all scale-100 active:scale-95 w-8 h-8 z-10"
                            onClick={handleCopy}
                        >
                            <Copy size={15} />
                        </Button>
                        <div className="overflow-x-auto rounded-md bg-muted p-4">
                            <pre
                                className={`${jetBrainsMono.className} text-sm whitespace-pre-wrap`}
                            >
                                {content}
                            </pre>
                        </div>
                    </div>
                )
            default:
                return (
                    <div className="relative group">
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all scale-100 active:scale-95 w-8 h-8 z-10"
                            onClick={handleCopy}
                        >
                            <Copy size={15} />
                        </Button>
                        <div className="overflow-x-auto rounded-md bg-muted p-4">
                            <pre className="whitespace-pre-wrap text-sm">{content}</pre>
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className="my-6 rounded-lg border border-border/50 bg-card shadow-sm overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 bg-muted/50 border-b border-border/30">
                <div className="flex items-center gap-3">
                    <ExternalLink size={16} className="text-muted-foreground" />
                    <div className="flex flex-col">
                        <h3 className="font-medium text-sm text-foreground">{title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground px-2 py-0.5 bg-background rounded uppercase tracking-wide">
                                {type}
                            </span>
                            {language && (
                                <span className="text-xs text-muted-foreground px-2 py-0.5 bg-background rounded uppercase tracking-wide">
                                    {language}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 px-3 text-xs">
                    <Copy size={12} className="mr-1.5" />
                    Copier
                </Button>
            </div>
            <div className="bg-muted/30">{renderContent()}</div>
        </div>
    )
}
