import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ProjectType } from "../types"

interface IProjectCardProps {
    project: ProjectType
}

export function ProjectCard({ project }: IProjectCardProps) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.startDate} | {project.endDate}</CardDescription>
            </CardHeader>
            <CardContent>
                <Label htmlFor="framework">
                    {project.description}
                </Label>
            </CardContent>
            <CardFooter className="flex justify-between">
                {/* <Button variant="outline">Cancel</Button>
                <Button>Deploy</Button> */}
            </CardFooter>
        </Card>
    )
}
