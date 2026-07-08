import { useState, useEffect, useCallback } from "react";
import { Platform } from "react-native";

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === "web") return;
    registerForPushNotifications();
  }, []);

  const registerForPushNotifications = async () => {
    try {
      const { requestPermissionsAsync, getExpoPushTokenAsync } = await import(
        "expo-notifications"
      );
      const { status } = await requestPermissionsAsync();
      if (status !== "granted") return;
      const tokenData = await getExpoPushTokenAsync();
      setExpoPushToken(tokenData.data);
    } catch {
      // noop
    }
  };

  const scheduleNotification = useCallback(
    async (title: string, body: string, date: Date) => {
      if (Platform.OS === "web") return;
      try {
        const { default: N, SchedulableTriggerInputTypes } = await import(
          "expo-notifications"
        );
        const trigger = date.getTime() - 30 * 60 * 1000;
        if (trigger <= Date.now()) return;
        await N.scheduleNotificationAsync({
          content: { title, body, data: { type: "interview" } },
          trigger: {
            type: SchedulableTriggerInputTypes.DATE,
            date: new Date(trigger),
          },
        });
      } catch {
        // noop
      }
    },
    []
  );

  return { expoPushToken, scheduleNotification };
}
