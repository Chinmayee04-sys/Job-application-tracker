import { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useTheme";
import { useApplications } from "@/hooks/useApplications";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Header } from "@/components/ui/Header";
import { Calendar, DateData } from "react-native-calendars";
import { JobApplication } from "@/types";

export default function CalendarScreen() {
  const { applications } = useApplications();
  const { isDark } = useColorScheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  const interviews = useMemo(
    () =>
      applications.filter(
        (a) =>
          a.status === "interview" && a.interviewDate
      ),
    [applications]
  );

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};
    interviews.forEach((app) => {
      if (app.interviewDate) {
        const dateStr = format(parseISO(app.interviewDate), "yyyy-MM-dd");
        marks[dateStr] = {
          marked: true,
          dotColor: colors.primary,
          selected: dateStr === selectedDate,
          selectedColor: colors.primary,
        };
      }
    });
    if (!marks[selectedDate]) {
      marks[selectedDate] = {
        selected: true,
        selectedColor: colors.primary + "30",
      };
    }
    return marks;
  }, [interviews, selectedDate, colors]);

  const dayInterviews = useMemo(
    () =>
      interviews.filter((app) => {
        if (!app.interviewDate) return false;
        return (
          format(parseISO(app.interviewDate), "yyyy-MM-dd") === selectedDate
        );
      }),
    [interviews, selectedDate]
  );

  const calendarTheme = {
    backgroundColor: colors.background,
    calendarBackground: colors.surface,
    textSectionTitleColor: colors.textSecondary,
    selectedDayBackgroundColor: colors.primary,
    selectedDayTextColor: "#FFFFFF",
    todayTextColor: colors.primary,
    dayTextColor: colors.text,
    textDisabledColor: colors.textTertiary,
    dotColor: colors.primary,
    arrowColor: colors.primary,
    monthTextColor: colors.text,
    indicatorColor: colors.primary,
    textDayFontWeight: "500" as const,
    textMonthFontWeight: "700" as const,
    textDayHeaderFontWeight: "600" as const,
    textDayFontSize: 15,
    textMonthFontSize: 18,
    textDayHeaderFontSize: 13,
  };

  return (
<View style={{ flex: 1, backgroundColor: colors.background }}>
<Header title="Calendar" subtitle="Interview schedule" />
<ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
<Animated.View
          entering={FadeInUp.duration(400)}
          style={{ paddingHorizontal: 16, marginBottom: 20 }}
        >
<Card noShadow>
<Calendar
              current={selectedDate}
              onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
              markedDates={markedDates}
              theme={calendarTheme}
              enableSwipeMonths
              style={{
                borderRadius: 12,
                borderWidth: 0,
              }}
            />
</Card>
</Animated.View>
<View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
<Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: colors.text,
            }}
          >
            {dayInterviews.length > 0
              ? `Interviews on ${format(parseISO(selectedDate), "MMMM d, yyyy")}`
              : "No interviews scheduled"}
</Text>
</View>

        {dayInterviews.length === 0 ? (
<EmptyState
            title="No interviews this day"
            message="Tap the + button on the Home tab to add a job application with an interview date"
            icon="calendar-outline"
          />
        ) : (
<View style={{ paddingHorizontal: 20, gap: 12 }}>
            {dayInterviews.map((app: JobApplication, i: number) => (
<Animated.View
                key={app.id}
                entering={FadeInUp.duration(300).delay(i * 80)}
              >
<Card index={i}>
<View
                    style={{ flexDirection: "row", gap: 12, alignItems: "center" }}
                  >
<View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        backgroundColor: colors.primaryLight,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
<Ionicons
                        name="calendar"
                        size={22}
                        color={colors.primary}
                      />
</View>
<View style={{ flex: 1, gap: 3 }}>
<Text
                        style={{
                          fontSize: 16,
                          fontWeight: "700",
                          color: colors.text,
                        }}
                      >
                        {app.company}
</Text>
<Text
                        style={{
                          fontSize: 14,
                          color: colors.textSecondary,
                        }}
                      >
                        {app.role}
</Text>
                      {app.interviewDate && (
<Text
                          style={{
                            fontSize: 13,
                            color: colors.primary,
                            fontWeight: "600",
                          }}
                        >
                          {format(parseISO(app.interviewDate), "h:mm a")}
</Text>
                      )}
</View>
<StatusBadge status={app.status} />
</View>
                  {app.location && (
<View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                        marginTop: 8,
                      }}
                    >
<Ionicons
                        name="location-outline"
                        size={14}
                        color={colors.textTertiary}
                      />
<Text
                        style={{
                          fontSize: 13,
                          color: colors.textTertiary,
                        }}
                      >
                        {app.location}
</Text>
</View>
                  )}
</Card>
</Animated.View>
            ))}
</View>
        )}
</ScrollView>
</View>
  );
}
