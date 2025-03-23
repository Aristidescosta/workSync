import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { FormField, FormItem, FormMessage } from "@/components/ui/form"

const members = [
    {
        value: "membro1",
        label: "Membro 1",
    },
    {
        value: "membro2",
        label: "Membro 2",
    },
    {
        value: "membro3",
        label: "Membro 3",
    },
    {
        value: "membro4",
        label: "Membro 4",
    },
    {
        value: "membro5",
        label: "Membro 5",
    },
]

interface MemberComboBoxProps {
    name: string
    control: any
}

export function MemberComboBox({ name, control }: MemberComboBoxProps) {
    const [open, setOpen] = React.useState(false)
    const [selectedMembers, setSelectedMembers] = React.useState<string[]>([])

    const toggleMember = (value: string) => {
        setSelectedMembers((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        )
    }

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <Popover {...field} open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[200px] justify-between"
                                onClick={() => setOpen(!open)}
                            >
                                {selectedMembers.length > 0
                                    ? selectedMembers
                                        .map((value) => members.find((member) => member.value === value)?.label)
                                        .join(", ")
                                    : "Selecione os membros..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder="Buscar membro..." />
                                <CommandList>
                                    <CommandEmpty>Nenhum membro encontrado.</CommandEmpty>
                                    <CommandGroup>
                                        {members.map((member) => (
                                            <CommandItem
                                                key={member.value}
                                                value={member.value}
                                                onSelect={() => {
                                                    toggleMember(member.value)
                                                    field.onChange(selectedMembers)
                                                    setOpen(false)
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedMembers.includes(member.value) ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {member.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>

            )}
        />
    )
}
