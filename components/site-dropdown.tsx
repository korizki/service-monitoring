import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ServiceLocation } from "@/types/types";
import { Pressable, ScrollView, StyleSheet } from "react-native";

interface SiteDropdownProps {
  sites: ServiceLocation[];
  selectedSite?: ServiceLocation | null;
  onSelect: (site: ServiceLocation) => void;
  placeholder?: string;
}

export function SiteDropdown({
  sites,
  selectedSite,
  onSelect,
}: Readonly<SiteDropdownProps>) {
  return (
    <ScrollView style={styles.dropdownList}>
      {sites.map((site, index) => (
        <Pressable
          key={index + 1}
          style={[
            styles.dropdownItem,
            selectedSite?.url === site.url && styles.selectedItem,
          ]}
          onPress={() => onSelect(site)}
        >
          <ThemedText
            style={[
              styles.dropdownItemText,
              selectedSite?.url === site.url && styles.selectedItemText,
            ]}
          >
            {site.site} - {site.url}
          </ThemedText>
          {selectedSite?.url === site.url && (
            <IconSymbol name="check" size={18} color="#007AFF" />
          )}
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   paddingTop: StatusBar.currentHeight,
  // },
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
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#efefef",
    borderRadius: 8,
    padding: 12,
  },
  selectedText: {
    fontSize: 16,
    flex: 1,
  },
  dropdownWrapper: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: 4,
    zIndex: 1000,
  },
  dropdownList: {
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#efefef",
    borderRadius: 8,
    maxHeight: 200,
    width: "100%",
  },
  scrollContent: {
    paddingVertical: 4,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemText: {
    fontSize: 16,
  },
  selectedItem: {
    backgroundColor: "#e8f4ff",
  },
  selectedItemText: {
    color: "#007AFF",
    fontWeight: "600",
  },
});
