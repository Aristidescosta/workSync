import { onCall } from "firebase-functions/v2/https";
import {
	onDocumentCreated,
	onDocumentDeleted,
	onDocumentUpdated,
} from "firebase-functions/v2/firestore";
import { onObjectFinalized, onObjectDeleted } from "firebase-functions/v2/storage";
import { initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { onSchedule } from "firebase-functions/v2/scheduler";

initializeApp();
const storage = getStorage();
const bucketName = storage.bucket().name;

import { sendInviteEmailToJoinTeam, sendNotification } from "./controllers/controllerMessages";
import { onTaskCommentDeleted, onTaskCommented } from "./controllers/controllerTaskComment";
import { STORAGE_SUBSCRIPTION_DELETED_TRIGGER_PATH, SUBSCRIPTION_DELETED_TRIGGER_PATH, TASK_COMMENTED_TRIGGER_PATH, TEAM_USERS_DELETED_TRIGGER_PATH, TASK_TRIGGER_PATH, WORKSPACE_CREATED_TRIGGER_PATH } from "./utils";
import { onUserRemovedFromTeam } from "./controllers/controllerTeams";
import { onFileCreated, onFileRemoved } from "./controllers/controllerFile";
import { onEndStorageSubscription, onEndSubscription } from "./controllers/controllerSubscription";
import { onCreatedWorkspace } from "./controllers/controllerWorkspace";
import { checkDueTasks, onCreatedTask, onUpdatedTask } from "./controllers/controllerTask";

export const onSendInviteEmailToJoinTeam = onCall(sendInviteEmailToJoinTeam);
// export const onSendMentionNotification = onCall(onSendMentionNotification);
export const onSendNotification = onCall(sendNotification);

exports.onTaskCommented = onDocumentCreated(TASK_COMMENTED_TRIGGER_PATH, onTaskCommented);
exports.onTaskCommentDeleted = onDocumentUpdated(TASK_COMMENTED_TRIGGER_PATH, onTaskCommentDeleted);

exports.onUserRemovedFromTeam = onDocumentDeleted(TEAM_USERS_DELETED_TRIGGER_PATH, onUserRemovedFromTeam);

exports.onEndSubscription = onDocumentDeleted(SUBSCRIPTION_DELETED_TRIGGER_PATH, onEndSubscription);
exports.onEndStorageSubscription = onDocumentDeleted(STORAGE_SUBSCRIPTION_DELETED_TRIGGER_PATH, onEndStorageSubscription);

exports.onFileCreated = onObjectFinalized({ bucket: bucketName }, onFileCreated);
exports.onFileRemoved = onObjectDeleted({ bucket: bucketName }, onFileRemoved);

exports.onCreatedWorkspace = onDocumentCreated(WORKSPACE_CREATED_TRIGGER_PATH, onCreatedWorkspace);
exports.onCreatedTask = onDocumentCreated(TASK_TRIGGER_PATH, onCreatedTask);
exports.onUpdatedTask = onDocumentUpdated(TASK_TRIGGER_PATH, onUpdatedTask);

exports.checkDueTasks = onSchedule("every day 06:00", checkDueTasks);
