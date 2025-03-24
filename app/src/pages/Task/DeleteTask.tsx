import React, { useState, useRef } from "react";
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	Button,
	Text,
	Box,
} from "@chakra-ui/react";
import { ZentaakButton } from "@/src/components/Button";
import { useTaskStore } from "@/src/hooks/useTask";
import { TaskType } from "@/src/types/TaskType";
import { useToastMessage } from "@/src/services/chakra-ui-api/toast";

// import { TaskStore } from "@/store/TaskStore";


interface AlertDialogProps {
	isOpen: boolean;
	onClose: () => void;
	alertTitle: string;
	task: TaskType;
}

export const DeleteTask: React.FC<AlertDialogProps> = ({
	isOpen,
	onClose,
	alertTitle,
	task,
}) => {
	const leastDestructiveRef = useRef(null);
	const [loading, setLoading] = useState(false);
	const { toastMessage, ToastStatus } = useToastMessage();

	const { tasks } = useTaskStore(state => state);

	const deleteTask = (taskId: string | undefined) => {
		//const updatedTasks = tasks.filter((task) => task.id !== taskId);
		//setTasks(updatedTasks);
	};

	function deleteAtivity() {
		/*setLoading(true);
		deletDocument(COLLECTION_TASK, task.id as string)
			.then(() => {
				setLoading(false);

				deleteTask(task?.id);
				toastMessage({
					title: "Elimando!!",
					description: "Tarefa eliminada com sucesso!!",
					statusToast: ToastStatus.LOADING,
					position: "top-right",
				});
				onClose();
			})
			.catch(() => {
				setLoading(false);

				toastMessage({
					title: "Erro!",
					description: "Erro ao eliminar a tarefa!",
					statusToast: ToastStatus.ERROR,
					position: "top-right",
				});

				onClose();
			}); */
	}

	return (
		<AlertDialog
			isOpen={isOpen}
			onClose={onClose}
			leastDestructiveRef={leastDestructiveRef}
			isCentered
			size="lg"
		>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader fontSize="lg" fontWeight="bold">
						{alertTitle}
					</AlertDialogHeader>

					<AlertDialogBody>
						<Box display="flex" flexDir="row" alignItems="center">
							<Text>Tem a certeza que deseja eliminar a tarefa</Text>
							<Text fontWeight="bold" mx="2">{`${task.taskTitle}?`}</Text>
						</Box>
					</AlertDialogBody>

					<AlertDialogFooter>
						<ZentaakButton
							isLoading={loading}
							variant="info"
							mr={3}
							onClick={deleteAtivity}
						>
							Eliminar
						</ZentaakButton>

						<ZentaakButton variant="primary" onClick={onClose} ml={3}>
							Fechar
						</ZentaakButton>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>
	);
};
