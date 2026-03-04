import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ASSET_URL, INIT_SERVICE } from "@/store/initial";
import { ServiceLocation } from "@/types/types";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { Animated, Modal, PanResponder, StyleSheet, View } from "react-native";
import { getServiceStatus } from "./service";
import ServiceInfo from "./ServiceInfo";

export default function SiteModal({
  site,
  setSite,
}: Readonly<{ site: ServiceLocation; setSite: (site: null) => void }>) {
  const translateY = useRef(new Animated.Value(0)).current;
  const spinValue = useRef(new Animated.Value(0)).current;

  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState(INIT_SERVICE);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        translateY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 100) {
          Animated.timing(translateY, {
            toValue: 1000,
            duration: 300,
            useNativeDriver: true,
          }).start(() => setSite(null));
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  function handleClose() {
    Animated.timing(translateY, {
      toValue: 1000,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSite(null));
  }

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    setIsLoading(true);
    getServiceStatus(site.url)
      .then((data) => setServices(data))
      .finally(() => setIsLoading(false));
  }, [site.site]);

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    );
    spinAnimation.start();
    return () => spinAnimation.stop();
  }, []);

  return (
    <Modal
      visible={!!site}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        {site && (
          <Animated.View
            style={[styles.modalContent, { transform: [{ translateY }] }]}
          >
            <Animated.View
              style={styles.modalHandle}
              {...panResponder.panHandlers}
            >
              <View style={styles.modalHandleBar} />
            </Animated.View>
            <View style={styles.modalHeader}>
              <Image
                source={{ uri: `${ASSET_URL}${site.assets}` }}
                style={styles.modalImage}
              />
              <View style={{ flex: 1 }}>
                <ThemedText>Site Project - {site.url}</ThemedText>
                <ThemedText type="title" style={styles.modalTitle}>
                  {site.site}
                </ThemedText>
              </View>
              {isLoading && (
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <IconSymbol name="data-usage" color={"#007AFF"} />
                </Animated.View>
              )}
            </View>
            <ServiceInfo
              data={services}
              url={site.url}
              closeModal={() => setSite(null)}
            />
          </Animated.View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "#ffffff00",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: "auto",
    height: "90%",
    shadowColor: "#3f424b",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  modalHandle: {
    alignItems: "center",
    paddingTop: 8,
  },
  modalHandleBar: {
    width: 50,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#e0e0e0",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginInline: 18,
    marginBottom: 8,
    gap: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  modalImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    resizeMode: "center",
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    marginTop: 12,
  },
  modalValue: {
    fontSize: 16,
    color: "#007AFF",
  },
});
