import { create } from "zustand";
import NotificationService from "../services/firebase/firestore/NotificationService";
import { NotificationMessageType, NotificationType, NotifyType } from "../types/NotificationType";
import generateId from "../services/UUID";
import { Unsubscribe } from "firebase/firestore";
import FunctionNotificationService from "../services/firebase/functions/FunctionNotificationService";
import { TemplateMessage } from "../types/TemplateMessage";

interface State {
    notifications: NotificationType[]
}

interface Actions {
    sendNotification: (title: string, body: string, to: string[], type: NotifyType, origin?: any, workspaceId?: string) => Promise<void>
    getNotifications: (userId: string, workspaceId: string, callback: (notification: NotificationType, isRemoving: boolean) => void) => Unsubscribe
    readNotification: (notificationId: string) => Promise<void>
    sendMessageNotification: (accountId: string, notification: NotificationMessageType, template: TemplateMessage) => Promise<void>
}

export const useNotificationStore = create<Actions & State>((set, get) => ({
    notifications: [],

    sendNotification: (title: string, body: string, to: string[], type: NotifyType, origin?: any, workspaceId?: string) => {
        const notification: NotificationType[] = []

        for (const index in to) {
            notification.push({
                notificationId: generateId(),
                title,
                body,
                type,
                createAt: new Date(),
                to: to[index],
                read: false,
                origin,
                workspaceId,
            })
        }

        return NotificationService.shared.createNotification(notification)
    },
    getNotifications: (userId: string, workspaceId: string, callback: (notification: NotificationType, isRemoving: boolean) => void): Unsubscribe => {
        return NotificationService.shared.getAllNotification(userId, workspaceId, (notification, isRemoving) => {

            if (notification) {
                set(state => ({ notifications: [...state.notifications, notification] }))
            }

            callback(notification, isRemoving)
        })
    },
    readNotification: async (notificationId: string) => {
        return await NotificationService.shared.readNotification(notificationId)
    },
    sendMessageNotification: (accountId: string, notification: NotificationMessageType, template: TemplateMessage): Promise<void> => {
        return FunctionNotificationService.shared.onSendMessageNotification(accountId, notification, template)
    }
}))