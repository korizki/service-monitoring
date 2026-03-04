import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ServiceSummary } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { restartService } from "./service";

export default function ServiceInfo({
  data,
  url,
  closeModal,
}: Readonly<{ data: ServiceSummary; url: string; closeModal: () => void }>) {
  const [isLoading, setIsLoading] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;

  async function handleRestart() {
    setIsLoading(true);
    await restartService(url);
    closeModal();
    setIsLoading(false);
  }

  useEffect(() => {
    if (isLoading) {
      const spinAnimation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      );
      spinAnimation.start();
      return () => spinAnimation.stop();
    }
  }, [isLoading]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <ThemedView style={{ height: "87%", position: "relative" }}>
      <ThemedView style={styles.outer}>
        <LabelNotif
          label="Total Service"
          value={data.totalService}
          icon="apps"
        />
        <LabelNotif
          label="Unhealthy Service"
          value={data.unhealthyCount}
          background="#fde0e0"
          icon="gpp-bad"
        />
        <LabelNotif
          label="Timestamp"
          value={data.timestamp}
          icon="access-time-filled"
          noBorder={true}
        />
      </ThemedView>
      <ScrollView style={styles.serviceWrapper}>
        {data.services.map(
          ({ serviceName, status, healthCheck, issueCodes }) => (
            <ThemedView key={serviceName} style={styles.serviceCard}>
              <ThemedView style={styles.serviceCardHeader}>
                <ThemedText style={styles.serviceName}>
                  {serviceName}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.healthLabel}>
                <ThemedText style={{ fontSize: 13 }}>
                  {status.toUpperCase()}
                </ThemedText>
                <IconSymbol
                  size={15}
                  name={status == "healthy" ? "verified" : "report-problem"}
                  color={status == "healthy" ? "#2bc48c" : "#ff4545"}
                />
              </ThemedView>
              {issueCodes?.length > 0 && (
                <ThemedView style={styles.messageWrapper}>
                  {issueCodes?.map((message) => (
                    <ThemedText
                      key={message}
                      style={{ color: "#ff8a1d", fontSize: 14 }}
                    >
                      {message}
                    </ThemedText>
                  ))}
                </ThemedView>
              )}
              {healthCheck?.data?.data?.logErrorMessage?.length > 0 &&
                status != "healthy" && (
                  <ThemedView style={styles.messageWrapper}>
                    {healthCheck?.data?.data?.logErrorMessage?.map(
                      (message: string, index: number) => (
                        <ThemedText
                          key={index + 1}
                          style={{ color: "#ff8a1d", fontSize: 14 }}
                        >
                          {message}
                        </ThemedText>
                      ),
                    )}
                  </ThemedView>
                )}
            </ThemedView>
          ),
        )}
      </ScrollView>
      <ThemedView style={styles.buttonWrapper}>
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={isLoading}
          style={styles.floatingButton}
          onPress={handleRestart}
        >
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <IconSymbol
              name={isLoading ? "data-usage" : "settings-suggest"}
              color="white"
            />
          </Animated.View>
          <ThemedText style={styles.floatingButtonText}>
            {isLoading ? "Processing ..." : "Restart Services"}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const LabelNotif = ({
  label,
  value,
  icon,
  noBorder,
  background,
}: {
  label: string;
  background?: string;
  value: number | string;
  icon: string;
  noBorder?: boolean;
}) => {
  return (
    <ThemedView
      style={{
        ...styles.wrapper,
        borderBottomWidth: noBorder ? 0 : 1,
        backgroundColor: background || "#fafafa",
      }}
    >
      <ThemedView style={styles.label}>
        <IconSymbol name={icon} color={background ? "#ff4545" : "#f3b42d"} />
        <ThemedText style={{ fontSize: 15 }}>{label}</ThemedText>
      </ThemedView>
      <ThemedText style={{ fontWeight: 600, fontSize: 16 }}>{value}</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  messageWrapper: {
    backgroundColor: "#fff8e3",
    paddingInline: 14,
    paddingBlock: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  healthLabel: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  serviceCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderColor: "#efefef",
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#94989b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusHealthy: {
    backgroundColor: "#e8f5e9",
  },
  statusUnhealthy: {
    backgroundColor: "#ffebee",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  serviceWrapper: {
    flex: 1,
    paddingInline: 20,
    paddingBlock: 4,
  },
  outer: {
    borderWidth: 1,
    borderColor: "#efefef",
    borderRadius: 16,
    marginInline: 18,
    marginBottom: 16,
    overflow: "hidden",
  },
  wrapper: {
    padding: 10,
    paddingInline: 14,
    borderBottomColor: "#efefef",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    flexDirection: "row",
    backgroundColor: "transparent",
    gap: 12,
    alignItems: "center",
  },
  buttonWrapper: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    paddingInline: 16,
    paddingBottom: 16,
    borderTopColor: "#efefef",
    borderTopWidth: 1,
  },
  floatingButton: {
    backgroundColor: "#007AFF",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  floatingButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
