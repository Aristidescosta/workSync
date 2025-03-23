import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { WorkSyncIcon } from '@/react-icons'
import { WorkSyncModal } from '@/src/components/modals'
import React, { useState } from 'react'

export const TasksPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)



    return (
        <div>
            <h1 className='text-xl font-semibold'>Tarefas</h1>
            <div className='flex flex-col'>
                <Button variant={"secondary"} onClick={() => setIsModalOpen(true)}>
                    <WorkSyncIcon
                        package="feather"
                        name="FiPlusSquare"
                        color="#fff"
                        size={16}
                    />
                    Adicionar Tarefa
                </Button>
            </div>
            <WorkSyncModal
                title='Adicionar tarefa'
                subtitle='Edite os detalhes da tarefa.'
                isOpen
                onClose={() => setIsModalOpen(false)}
            >
                <div className='grid grid-cols-1 gap-4'>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="task">Tarefa</Label>
                        <Input type="text" id="task" placeholder="Informe a tarefa" />
                    </div>
                    <div className='flex gap-2'>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="task">Tarefa</Label>
                            <Input type="text" id="task" placeholder="Informe a tarefa" />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="task">Tarefa</Label>
                            <Input type="text" id="task" placeholder="Informe a tarefa" />
                        </div>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="task">Tarefa</Label>
                        <Input type="text" id="task" placeholder="Informe a tarefa" />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="task">Tarefa</Label>
                        <Input type="text" id="task" placeholder="Informe a tarefa" />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="task">Tarefa</Label>
                        <Input type="text" id="task" placeholder="Informe a tarefa" />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="task">Tarefa</Label>
                        <Input type="text" id="task" placeholder="Informe a tarefa" />
                    </div>
                </div>
            </WorkSyncModal>
        </div >
    )
}
