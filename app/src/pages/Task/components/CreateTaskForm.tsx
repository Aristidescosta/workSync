import { VStack, Flex, FormControl, FormLabel, Input, HStack, Textarea, Box } from "@chakra-ui/react";
import Select, { MultiValue } from "react-select";
import TaskLabel from "./TaskLabel";
import { TagType } from "@/src/types/TagType";
import { iReactSelect } from "@/src/interfaces/iReactSelect";
import { UserType } from "@/src/types/UserType";
import { useTeamStore } from "@/src/hooks/useTeam";
import { UserSessionType } from "@/src/types/UserSessionType";

interface CreateTaskForm {
    taskName: string
    description: string
    existingTags: TagType[]
    startDate: Date
    deadline: Date
    assignedOf: UserSessionType[]
    isEditting: boolean
    onChangeTaskName: (arg: string) => void
    onChangeTaskDescription: (arg: string) => void
    onChangeTaskStartDate: (arg: Date) => void
    onChangeTaskDeadline: (arg: Date) => void
    onChangeAssignedOf: (arg: UserSessionType[]) => void
    selectedTags: (tags: TagType[]) => void
}

export default function CreateTaskForm(props: CreateTaskForm): JSX.Element {

    const membersOfTeam = useTeamStore(state => state.membersOfTeam)

    const {
        taskName,
        description,
        existingTags,
        startDate,
        deadline,
        assignedOf,
        isEditting,
        onChangeTaskDeadline,
        onChangeTaskDescription,
        onChangeAssignedOf,
        onChangeTaskName,
        onChangeTaskStartDate,
        selectedTags
    } = props

    const assignedOfOptions = assignedOf.map(user => ({
        value: user,
        label: user.displayName
    }));

    function handleChangeTaskName(e: React.ChangeEvent<HTMLInputElement>) {
        onChangeTaskName(e.target.value)
    }

    function handleChangeTaskDescription(e: React.ChangeEvent<HTMLTextAreaElement>) {
        onChangeTaskDescription(e.target.value)
    }

    function handleChangeStartDate(e: React.ChangeEvent<HTMLInputElement>) {
        onChangeTaskStartDate(e.target.value.convertToDate())
    }

    function handleChangeDeadline(e: React.ChangeEvent<HTMLInputElement>) {
        onChangeTaskDeadline(e.target.value.convertToDate())
    }

    function handleAssignedOf(e: MultiValue<iReactSelect<UserSessionType>>) {
        if (e) {
            onChangeAssignedOf(e.flatMap(u => u.value))
        }
    }

    return (
        <VStack width={'100%'}>
            <Flex width={'100%'} gap={10}>
                <Box width="49%">
                    <FormControl my="20px" isRequired>
                        <FormLabel fontSize="14px">Tarefa</FormLabel>
                        <Input
                            placeholder="Informe a tarefa"
                            border="1px solid #ddd"
                            id="task"
                            height="50px"
                            value={taskName}
                            onChange={handleChangeTaskName}
                            _placeholder={{ fontSize: 13, color: "#555", opacity: 0.8 }}
                        />
                    </FormControl>

                    <HStack>
                        <FormControl>
                            <FormLabel fontSize="14px">Data de início</FormLabel>
                            <Input
                                type="date"
                                border="1px solid #ddd"
                                id="beginDate"
                                height="50px"
                                value={startDate.toISOString().split('T')[0]}
                                onChange={handleChangeStartDate}
                                _placeholder={{ fontSize: 12, color: "#555", opacity: 0.8 }}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel fontSize="14px">Data de fim</FormLabel>
                            <Input
                                type="date"
                                border="1px solid #ddd"
                                id="endDate"
                                height="50px"
                                value={deadline.toISOString().split('T')[0]}
                                onChange={handleChangeDeadline}
                                _placeholder={{ fontSize: 12, color: "#555", opacity: 0.8 }}
                            />
                        </FormControl>
                    </HStack>

                    <FormControl my="20px">
                        <FormLabel fontSize="14px">Atribuir a</FormLabel>
                        <Select
                            id="owner"
                            placeholder="Elementos da equipa"
                            options={membersOfTeam}
                            isSearchable={false}
                            isMulti
                            isDisabled={isEditting}
                            noOptionsMessage={() => "Nenhum membro na equipa"}
                            className="basic-multi-select"
                            onChange={handleAssignedOf}
                            styles={{
                                control: (baseStyles) => ({
                                    ...baseStyles,
                                    borderColor: "#ddd",
                                    height: 48,
                                    fontSize: 14,
                                }),
                            }}
                            value={assignedOfOptions}
                        />
                    </FormControl>
                </Box>

                <Box width="49%">
                    <FormControl my="20px" isRequired>
                        <FormLabel fontSize="14px">Etiqueta</FormLabel>
                        <TaskLabel
                            selectedTags={selectedTags}
                            existingTags={existingTags}
                        />
                    </FormControl>
                </Box>
            </Flex>

            <FormControl isRequired>
                <FormLabel fontSize="14px">Notas</FormLabel>
                <Textarea
                    size="md"
                    minHeight={"80px"}
                    maxH={"150px"}
                    border="1px solid #ddd"
                    id="description"
                    value={description}
                    onChange={handleChangeTaskDescription}
                    _placeholder={{ fontSize: 13, color: "#555", opacity: 0.8 }}
                    placeholder="Escreva uma descrição ou adicione notas aqui"
                />
            </FormControl>
        </VStack>
    )
}