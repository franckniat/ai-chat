import { Card, CardContent, CardHeader, CardTitle } from "./card";

export default function FaqItem({ question, answer }: { question: string, answer: string }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle asChild className="text-lg">
                    <h3>{question}</h3>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{answer}</p>
            </CardContent>
        </Card>
    )
}