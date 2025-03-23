import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TaskType } from '@/src/types/TaskType'
import React from 'react'

interface ITaskCardProps {
    task: TaskType
}

export const TaskCard = ({ task }:ITaskCardProps) => {
    return (
        <Card className="shadow-xl cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out transform hover:bg-gray-100">
            <CardHeader>
                <CardTitle>{task.taskTitle}</CardTitle>
                <Badge>Badge</Badge>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
            {task.updatedAt ? `Actualizada ${task.updatedAt?.convertToString()} | ${task.state} |` : `Criada ${task.createdAt?.convertToString()} | ${task.state} |`}
            </CardContent>
        </Card>
    )
}
