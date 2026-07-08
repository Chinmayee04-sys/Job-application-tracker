import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, backgroundColor: "#0A0A1A", alignItems: "center", justifyContent: "center", padding: 40 }}>
          <Text style={{ color: "#F87171", fontSize: 20, fontWeight: "700", marginBottom: 12 }}>
            Something went wrong
          </Text>
          <Text style={{ color: "#94A3B8", fontSize: 14, textAlign: "center", marginBottom: 24 }}>
            {this.state.error?.message || "Unknown error"}
          </Text>
          <TouchableOpacity
            onPress={() => this.setState({ hasError: false, error: null })}
            style={{
              backgroundColor: "#6366F1",
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "#FFF", fontWeight: "600" }}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}
