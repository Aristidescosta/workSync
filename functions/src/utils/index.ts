import { NotificationType } from "../models/NotificationType";
import { TemplateMessage } from "../models/TemplateMessage";

export const ZEN_TAAK_DOMAIN = process.env.FUNCTIONS_EMULATOR === "true" ? "http://localhost:5173" : "https://app.zentaak.com";
export const TASK_COMMENTED_TRIGGER_PATH = "tasks/{taskId}/comments/{commentId}";
export const TASK_PATH = "tasks";
export const USER_PATH = "users";
export const SETTINGS_PATH = "settings";
export const STORAGES_PATH = "storages";
export const SUBSCRIPTIONS_PATH = "subscriptions";
export const STATS_RESUME_TASK_PATH = "statsResumeTask";

export const TEAM_USERS_DELETED_TRIGGER_PATH = "teams/{teamId}/members/{userId}";
export const SUBSCRIPTION_DELETED_TRIGGER_PATH = "subscriptions/{accountId}";
export const STORAGE_SUBSCRIPTION_DELETED_TRIGGER_PATH = "storageSubscriptions/{accountId}";

export const FILE_CREATED_TRIGGER_PATH = "teams/{teamId}/members/{userId}";
export const WORKSPACE_CREATED_TRIGGER_PATH = "workspaces/{workspaceId}";
export const TASK_TRIGGER_PATH = "tasks/{taskId}";

export function messageTemplate(notification: NotificationType, template: TemplateMessage, user: string, isSms = true): string {
	switch (template) {
		case "task_assigned":
			return isSms ?
				`Hey, ${user}. Foste atribuído(a) a tarefa ${notification.taskName}, no workspace ${notification.workspaceName}.` :
				`Olá, ${user}.\n\nFoste atribuído(a) a tarefa ${notification.taskName}, no workspace ${notification.workspaceName}. \n\n\nCumprimentos, \n${notification.teamName}`;
		case "task_commented":
			return isSms ?
				`O ${notification.userNameNotificationFrom} comentou na tarefa ${notification.taskName}, da equipa ${notification.teamName}.` :
				`Olá, \n\n${notification.userNameNotificationFrom} fez um comentário na tarefa ${notification.taskName} da equipa ${notification.teamName}, \n\n\nCumprimentos, \n${notification.teamName}`;
		case "task_change_state":
			return isSms ?
				`Hey, ${notification.userNameNotificationFrom}. Foste atribuído(a) a tarefa ${notification.taskName}, no workspace ${notification.workspaceName}.` :
				`Olá, \n\n${notification.userNameNotificationFrom} fez um comentário na tarefa ${notification.taskName} da equipa ${notification.teamName}, \n\n\nCumprimentos, \n${notification.teamName}`;
		case "task_manager":
			return isSms ?
				`Hey, ${notification.userNameNotificationFrom}. Foste atribuído(a) a tarefa ${notification.taskName}, no workspace ${notification.workspaceName}.` :
				`Olá, \n\n${notification.userNameNotificationFrom} fez um comentário na tarefa ${notification.taskName} da equipa ${notification.teamName}, \n\n\nCumprimentos, \n${notification.teamName}`;
	}
}
