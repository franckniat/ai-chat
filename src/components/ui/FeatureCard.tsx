import { Card, CardContent, CardHeader, CardTitle } from "./card";

export default function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <Card className="border-none shadow-none bg-background/50 hover:bg-background/80 transition-colors ">
            <CardHeader className="flex items-center flex-col">
                <div className="mb-4 p-3 bg-primary/10 w-fit rounded-xl ">
                    {icon}
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center" >
                <p className="text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </CardContent>
        </Card>
    )
}