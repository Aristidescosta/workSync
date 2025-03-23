import { Card, CardContent } from '@/components/ui/card'
import { TeamType } from '@/src/types/TeamType'
import React from 'react'

interface ICardTeamProps {
    team: TeamType
}

export const CardTeam = ({ team }: ICardTeamProps) => {
    return (
        <Card className="shadow-xl cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out transform hover:bg-gray-100">
            <CardContent className='flex flex-col gap-4'>
                <img className='rounded-2xl w-full h-48 bg-cover' src={team.teamImage} alt={"Imagem do team " + team.teamName} />
                <h2 className='text-center font-semibold text-2xl'>{team.teamName}</h2>
            </CardContent>
        </Card>
    )
}
