import { SiteDropdown } from "@/components/site-dropdown";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { LIST_SITE } from "@/store/initial";
import { useState } from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePicker, {
  DateType,
  useDefaultStyles,
} from "react-native-ui-datepicker";

export default function TabTwoScreen() {
  const defaultStyles = useDefaultStyles();
  const [selected, setSelected] = useState<DateType>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSite, setSelectedSite] = useState<
    (typeof LIST_SITE)[number] | null
  >(null);

  async function handleSubmit() {
    const date = new Date(selected as any).toLocaleDateString("fr-CA");
    const url = selectedSite?.url;
    if (date && url) {
      setIsLoading(true);
      const action = await fetch(
        `https://api42-web.${url}/hpr/v1/production/device/production-raw/batch`,
        {
          method: "PUT",
          body: JSON.stringify({
            startDate: `${date} 00:00:00`,
            endDate: `${date} 23:59:59`,
            nrp: "22003265",
          }),
        },
      );
      const response = await action.json();
      if (response?.data?.modifiedCount > 0) {
        Alert.alert(
          "Aksi Berhasil",
          `Berhasil memperbarui ${response?.data?.modifiedCount} records`,
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        );
      }
      setIsLoading(false);
    } else {
      Alert.alert(
        "Aksi Gagal",
        "Silakan pilih tanggal dan site terlebih dulu",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      );
    }
  }

  return (
    <ThemedView style={{ padding: 16, flex: 1 }}>
      <ThemedText type="subtitle" style={{ marginTop: 24, marginBottom: 12 }}>
        Invalid Cycle Params
      </ThemedText>
      <DateTimePicker
        mode="single"
        date={selected}
        onChange={({ date }) => setSelected(date)}
        styles={defaultStyles}
      />
      <ThemedView style={styles.formContainer}>
        <SiteDropdown
          sites={LIST_SITE}
          selectedSite={selectedSite}
          onSelect={setSelectedSite}
          placeholder="Select a site"
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <IconSymbol
            name={isLoading ? "data-usage" : "save"}
            size={24}
            color="#ffffff"
          />
          <ThemedText style={styles.submitButtonText}>
            {isLoading ? "Processing ..." : "Submit"}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  scrollView: {
    backgroundColor: "pink",
  },
  text: {
    fontSize: 42,
    padding: 12,
  },
  container: {
    position: "relative",
    marginBottom: 16,
  },
  formContainer: {
    gap: 24,
    transform: "translateY(-20px)",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#007AFF",
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 12,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
