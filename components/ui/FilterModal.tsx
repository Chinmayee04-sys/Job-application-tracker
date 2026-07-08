import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Modal } from "react-native";
import { ApplicationStatus } from "@/types";
import { Colors } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useTheme";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

interface FilterOption {
  key: string;
  label: string;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: FilterOption[];
  selected: string;
  onSelect: (key: string) => void;
}

export function FilterModal({
  visible,
  onClose,
  title,
  options,
  selected,
  onSelect,
}: FilterModalProps) {
  const { isDark } = useColorScheme();
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={{
          flex: 1,
          backgroundColor: colors.overlay,
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          entering={FadeIn.duration(300).delay(100)}
          style={{
            backgroundColor: colors.surface,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: 8,
            paddingBottom: 40,
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: colors.surfaceTertiary,
              alignSelf: "center",
              marginBottom: 20,
            }}
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: colors.text,
              marginBottom: 16,
            }}
          >
            {title}
          </Text>
          <ScrollView>
            {options.map((opt) => {
              const isSelected = opt.key === selected;
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => {
                    onSelect(opt.key);
                    onClose();
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 14,
                    paddingHorizontal: 4,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.borderLight,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: isSelected ? colors.primary : colors.text,
                      fontWeight: isSelected ? "600" : "400",
                    }}
                  >
                    {opt.label}
                  </Text>
                  {isSelected && (
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: colors.primary,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ color: "#FFF", fontSize: 12 }}>
                        ✓
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
