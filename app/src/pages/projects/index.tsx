import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { WorkSyncIcon } from "@/react-icons"
import { useToastMessage } from "@/react-toastify"
import { ProjectCard } from "@/src/components/ProjectCard"
import { CreateProject } from "@/src/components/modals"
import { useProject, useUserSessionStore } from "@/src/hooks"
import generateId from "@/src/services/UUID"
import { ProjectType } from "@/src/types"
import { useEffect, useState } from "react"

export const Projects = () => {

  const [openModaCreateProject, setOpenModalCreateProject] = useState(false)
  const createProject = useProject(state => state.createProject)
  const infoMessage = useProject(state => state.infoMessage)
  const user = useUserSessionStore(state => state.user)
  const errorProject = useProject(state => state.errorProject)
  const observingAllProjects = useProject(state => state.observingAllProjects)
  const { toastMessage, ToastStatus } = useToastMessage()
  const onToggleModalCreateProject = () => {
    setOpenModalCreateProject(prev => !prev)
  }

  const [projects, setProjects] = useState<ProjectType[]>([])

  const onCreateProject = (data: Omit<ProjectType, "owner">) => {
    const owner = {
      name: user?.session.displayName ?? "",
      id: user?.session.id ?? ""
    }
    createProject({ ...data, id: generateId(), owner })
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

  useEffect(() => {

    if (user?.session) {
      const unsubscribe = observingAllProjects(user.session.id, (project, isRemoving) => {
        if (project) {
          setProjects(state => [...state, project])
        }
      })

      return () => {
        setProjects([])
        unsubscribe()
      }
    }

  }, [user?.session])

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {
            projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          }
        </div>
      </div>
    </>
  )
}
