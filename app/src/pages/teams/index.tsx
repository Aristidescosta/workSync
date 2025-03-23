import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { WorkSyncIcon } from "@/react-icons";
import { useToastMessage } from "@/react-toastify";
import { useUserSessionStore } from "@/src/hooks";
import { useTeamStore } from "@/src/hooks/useTeam";
import { UserType } from "@/src/types";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { redirect } from "react-router-dom";
export const TeamPage = () => {
  const [members, setMembers] = useState<UserType[]>([])

  const session = useUserSessionStore(state => state.userSession)
  const user = useUserSessionStore(state => state.user)

  const membersOfTeam = useTeamStore(state => state.membersOfTeam)
  const getAllMembers = useTeamStore(state => state.getAllMembers)
  const team = useTeamStore(state => state.team)
  const removeUserMember = useTeamStore(state => state.removeUserMember)

  const { ToastStatus, toastMessage } = useToastMessage()

  useEffect(() => {
    if (session) {
      if (team?.teamId) {
        const unsubscribe = getAllMembers()
        return () => unsubscribe()
      }
    }
  }, [session, team])

  useEffect(() => {

    if (user && team) {
      console.log("Eu entro aqui")
      const members: UserType[] = []

      for (const user of membersOfTeam) {
        let dataUser: UserType = {
          session: user.value,
          teams: [],
          memberOfTeams: [],
          createdAt: new Date()
        }
        if (team.owner.session.id === user.value.id) {
          dataUser.role = "Proprietário"
          members.push(dataUser)
        } else {
          dataUser!.role = "Colaborador"
          members.push(dataUser)
        }
      }
      console.log(membersOfTeam, "testes")
      setMembers(members)
    }

  }, [membersOfTeam])

  function openNewTeam() {
    if (session) {
      redirect("/auth")
    }
  }

  async function handleUserDelete(user: UserType) {
    try {
      setMembers(state => state.filter(u => u.session.id !== user.session.id))
      return await removeUserMember(user.session.id)
    } catch (error) {
      toastMessage({
        title: error as string,
        statusToast: ToastStatus.INFO,
      })
    }
  }

  return (
    <>
      <h1 className="font-semibold text-2xl md:text-3xl lg:text-4xl mb-4">Membros da equipa</h1>
      <Table className="shadow-2xl bg-secondary-foreground">
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Permissão</TableHead>
            <TableHead>Acções</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.session.id}>
              <TableCell className="flex  items-center gap-4 font-medium" align="left">
                <Avatar>
                  <AvatarImage src={member.session.photoUrl ?? undefined} alt={member.session.displayName} />
                  <AvatarFallback>{member.session.displayName.getInitials()}</AvatarFallback>
                </Avatar>
                <Label>{member.session.displayName}</Label>
              </TableCell>
              <TableCell className="font-medium" align="left">
                <Label>{member.role}</Label>
              </TableCell>
              <TableCell align="left">
                <WorkSyncIcon
                  name="MdMoreHoriz"
                  package="materialdesignicons"
                  color="black"
                  size={16}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
