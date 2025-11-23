import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Card, CardContent } from "./card";

export function TestimonialCard({ name, role, content, initials }: { name: string, role: string, content: string, initials: string }) {
    return (
        <Card className="h-full">
            <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                    <p className="text-muted-foreground italic">"{content}"</p>
                    <div className="flex items-center gap-3 mt-4">
                        <Avatar>
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-sm">{name}</p>
                            <p className="text-xs text-muted-foreground">{role}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}