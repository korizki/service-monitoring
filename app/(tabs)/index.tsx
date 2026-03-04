import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import SiteModal from "@/features/SiteModal/SiteModal";
import { ASSET_URL, LIST_SITE } from "@/store/initial";
import { ServiceLocation } from "@/types/types";
import { Image } from "expo-image";
import { useMemo, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const sampleLocations: ServiceLocation[] = LIST_SITE;

export default function ListScreen() {
  const [searchText, setSearchText] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<ServiceLocation | null>(null);
  const translateY = useRef(new Animated.Value(0)).current;

  const filteredLocations = useMemo(() => {
    if (!searchText.trim()) return sampleLocations;

    const searchTerm = searchText.toLowerCase();
    return sampleLocations.filter((location) => {
      const matchesSite = location.site.toLowerCase().includes(searchTerm);
      const matchesCompany = location.company
        .toLowerCase()
        .includes(searchTerm);
      return matchesSite || matchesCompany;
    });
  }, [searchText]);

  return (
    <>
      <ScrollView style={styles.listContainer} stickyHeaderIndices={[0]}>
        <ThemedView style={styles.filterContainer}>
          <TextInput
            style={styles.filterInput}
            placeholder="Search by site or company..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </ThemedView>
        <View style={{ padding: 12 }}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Site Project - ({filteredLocations.length})
          </ThemedText>
          <ThemedView style={styles.cardWrapper}>
            {filteredLocations.map((location) => (
              <TouchableOpacity
                activeOpacity={0.7}
                key={location.site}
                style={styles.card}
                onPress={() => {
                  translateY.setValue(0);
                  setSelectedLocation(location);
                }}
              >
                <Image
                  source={{ uri: `${ASSET_URL}${location.assets}` }}
                  style={styles.cardImage}
                />
                <View>
                  <ThemedText style={{ textAlign: "center" }} type="subtitle">
                    {location.site}
                  </ThemedText>
                  <ThemedText style={styles.cardSubtitle}>
                    Perusahaan {location.company}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </View>
      </ScrollView>
      {selectedLocation && (
        <SiteModal site={selectedLocation} setSite={setSelectedLocation} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    flexWrap: "wrap",
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
  listContainer: {
    flex: 1,
  },
  filterContainer: {
    backgroundColor: "#ffffff",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingTop: 36,
    borderRadius: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  filterInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    marginBottom: 12,
    shadowColor: "#878d91",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
    gap: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
  },
  cardImage: {
    width: 60,
    height: 60,
  },
  floatingButton: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: "#007AFF",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  floatingButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
