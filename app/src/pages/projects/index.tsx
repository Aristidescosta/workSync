import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { WorkSyncIcon } from "@/react-icons"

export const Projects = () => {

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col items-center lg:flex-row lg:justify-between">
          <h1 className="text-secondary font-semibold uppercase text-center">Projectos</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"secondary"}>
                Criar novo projecto
                <WorkSyncIcon
                  name="FaPlus"
                  package="fontawesome6"
                  color="white"
                />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Criar novo projecto</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" value="Pedro Duarte" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input id="username" value="@peduarte" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Separator className="my-4" />
      </div>
    </>
  )
}
