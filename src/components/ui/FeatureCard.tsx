import { Card, CardContent, CardHeader, CardTitle } from "./card";

export default function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <Card className="border-none shadow-none bg-background/50 hover:bg-background/80 transition-colors ">
            <CardHeader className="flex items-center flex-col">
                <div className="mb-4 p-3 bg-primary/10 w-fit rounded-xl ">
                    {icon}
                </div>
                {/* `CardTitle` rend un <div> : sans `asChild`/element explicite,
                    ces titres n'apparaissent pas dans la navigation par titres
                    d'un lecteur d'ecran. */}
                <CardTitle asChild className="text-xl">
                    <h3>{title}</h3>
                </CardTitle>
            </CardHeader>
            <CardContent className="text-center" >
                <p className="text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </CardContent>
        </Card>
    )
}