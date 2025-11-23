import { Card, CardContent, CardHeader, CardTitle } from "./card";

export default function FaqItem({ question, answer }: { question: string, answer: string }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">{question}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{answer}</p>
            </CardContent>
        </Card>
    )
}