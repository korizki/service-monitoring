import { ThemedView } from "@/components/themed-view";
import SiteModal from "@/features/SiteModal/SiteModal";
import { ASSET_URL, LIST_SITE } from "@/store/initial";
import { ServiceLocation } from "@/types/types";
import { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

const sampleLocations: ServiceLocation[] = LIST_SITE;

const CustomMarker = ({ location }: { location: ServiceLocation }) => (
  <TouchableOpacity
    style={styles.markerTouchable}
    activeOpacity={0.8}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <View style={styles.markerContainer}>
      <Image
        source={{ uri: `${ASSET_URL}${location.assets}` }}
        style={styles.markerImage}
        resizeMode="contain"
      />
    </View>
  </TouchableOpacity>
);

export default function MapScreen() {
  const [selectedLocation, setSelectedLocation] =
    useState<ServiceLocation | null>(null);

  return (
    <ThemedView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -2.5489,
          longitude: 118.0149,
          latitudeDelta: 5,
          longitudeDelta: 5,
        }}
        onMapReady={() => console.log("Map ready")}
      >
        {sampleLocations.map((location) => (
          <Marker
            key={location.site}
            coordinate={location.coordinate}
            title={location.site}
            description={location.company}
            onPress={() => setSelectedLocation(location)}
          >
            <CustomMarker location={location} />
          </Marker>
        ))}
      </MapView>
      {selectedLocation && (
        <SiteModal site={selectedLocation} setSite={setSelectedLocation} />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 30,
    height: 30,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: "#d8a058",
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerImage: {
    width: 30,
    height: 30,
  },
  markerTouchable: {
    width: 30,
    height: 30,
  },
});
