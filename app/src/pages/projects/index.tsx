import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { WorkSyncIcon } from "@/react-icons"
import { useToastMessage } from "@/react-toastify"
import { CreateProject } from "@/src/components/modals"
import { useProject } from "@/src/hooks"
import generateId from "@/src/services/UUID"
import { ProjectType } from "@/src/types"
import { useState } from "react"

export const Projects = () => {

  const [openModaCreateProject, setOpenModalCreateProject] = useState(false)
  const createProject = useProject(state => state.createProject)
  const infoMessage = useProject(state => state.infoMessage)
  const errorProject = useProject(state => state.errorProject)
  const { toastMessage, ToastStatus } = useToastMessage()
  const onToggleModalCreateProject = () => {
    setOpenModalCreateProject(prev => !prev)
  }

  const onCreateProject = (data: ProjectType) => {
    createProject({ ...data, id: generateId() })
      .then(() => {
        toastMessage({
          title: infoMessage ?? "Projecto Criado com sucesso",
          statusToast: ToastStatus.SUCCESS
        })
        onToggleModalCreateProject()
      })
      .catch(() => {
        toastMessage({
          title: errorProject ?? "",
          statusToast: ToastStatus.ERROR
        })
      })
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col items-center lg:flex-row lg:justify-between">
          <h1 className="text-secondary font-semibold uppercase text-center">Projectos</h1>
          <Button variant={"secondary"} onClick={onToggleModalCreateProject}>
            Criar novo projeto
            <WorkSyncIcon name="FaPlus" package="fontawesome6" color="white" />
          </Button>
          {
            openModaCreateProject &&
            <CreateProject
              isOpen={openModaCreateProject}
              onToggleModal={onToggleModalCreateProject}
              handleCreateProject={onCreateProject}
            />
          }
        </div>
        <Separator className="my-4" />
      </div>
    </>
  )
}
