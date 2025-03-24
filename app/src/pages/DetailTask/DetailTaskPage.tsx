
import { ZenTaakModal } from "@/src/components/ZenTaakModal";
import { useTaskStore } from "@/src/hooks/useTask";
import { HStack } from "@chakra-ui/react";
import DetailTaskLateralFeature from "./DetailTaskLateralFeature";
import DetailTaskContent from "./DetailTaskContent";
import { useUserSessionStore } from "@/src/hooks/useUserSession";

interface DetailsTaskProps extends iModalPage { }

export default function DetailTaskPage(props: DetailsTaskProps) {

	const {
		isOpen,
		onClose
	} = props

	const task = useTaskStore(state => state.task)
	const setTaskSelected = useTaskStore(state => state.setTaskSelected)

	const user = useUserSessionStore(state => state.user)

	function handleClose() {
		onClose()
		setTaskSelected(null)
	}

	return (
		task && (
			<ZenTaakModal
				title={task.taskTitle}
				subtitle="Seja conciso e claro quando elaborar o seu relatório."
				isOpen={isOpen}
				position="relative"
				size="5xl"
				onClose={handleClose}
			>
				<HStack
					justifyContent={'space-between'}
					alignItems={'flex-start'}
				>
					<DetailTaskContent
						user={user}
						task={task}
						about={task.notes}
						activities={task.activities}
					/>
					<DetailTaskLateralFeature
						assignedOf={task.assignedOf}
						tags={task.tags}
						deadline={task.deadline}
						attachments={task.attachments}
						progressTask={task.progress}
						stateTask={task.state}
					/>
				</HStack>
			</ZenTaakModal>
		)
	);
}
