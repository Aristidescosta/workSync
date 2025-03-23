import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { projectSchema } from "@/src/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { MemberComboBox } from "./MemberSelect "
import { useProject } from "@/src/hooks"
import { Loader2 } from "lucide-react"
import generateId from "@/src/services/UUID"
import { ProjectType } from "@/src/types"


interface ICreateProjectProps {
    isOpen: boolean,
    onToggleModal: () => void
    handleCreateProject: (data: ProjectType) => void
}

export const CreateProject = ({ isOpen, onToggleModal, handleCreateProject }: ICreateProjectProps) => {

    const loadingProjects = useProject(state => state.loadingProjects)

    const form = useForm<z.infer<typeof projectSchema>>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            description: "",
            endDate: "",
            members: [],
            startDate: "",
            title: "",
            id: generateId()
        },
    })

    function onSubmit(data: z.infer<typeof projectSchema>) {
        handleCreateProject(data)
    }

    return (
        <Dialog open={isOpen} modal onOpenChange={loadingProjects ? undefined : onToggleModal}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Criar projeto</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6 text-xs">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Título</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="text" placeholder="Insira o título do projeto" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descrição</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="text" placeholder="Insira a descrição do projeto" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data de Início</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="date" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data de Conclusão</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="date" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <MemberComboBox name="members" control={form.control} />

                            <Button disabled={loadingProjects} variant={"secondary"} type="submit">
                                {
                                    loadingProjects ? (
                                        <>
                                            <Loader2 className="animate-spin" />
                                            Criando...
                                        </>
                                    )
                                        :
                                        <span>Criar</span>
                                }
                            </Button>
                            <Button disabled={loadingProjects} onClick={onToggleModal} variant={"outline"} type="button">
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
