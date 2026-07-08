import { useEffect, useRef } from "react";
import { Platform } from "react-native";

export async function scheduleInterviewNotification(
  title: string,
  body: string,
  date: Date
): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    const { default: Notifications, SchedulableTriggerInputTypes } =
      await import("expo-notifications");

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") return;

    const trigger = date.getTime() - 30 * 60 * 1000;
    if (trigger <= Date.now()) return;

    await Notifications.scheduleNotificationAsync({
      content: { title, body, data: { type: "interview" } },
      trigger: {
        type: SchedulableTriggerInputTypes.DATE,
        date: new Date(trigger),
      },
    });
  } catch {
    // noop
  }
}

export async function cancelAllNotifications(): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    const { default: Notifications } = await import("expo-notifications");
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // noop
  }
}

export function useNotificationSetup(): void {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || Platform.OS === "web") return;
    initialized.current = true;

    (async () => {
      try {
        const Notifications = await import("expo-notifications");
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
          }),
        });

        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("interviews", {
            name: "Interview Reminders",
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
          });
        }
      } catch {
        // noop
      }
    })();
  }, []);
}
