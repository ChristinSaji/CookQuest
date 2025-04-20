import { CameraView, Camera } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useRouter, useLocalSearchParams } from "expo-router";

import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { validateStep } from "../../utils/api";

const { width, height } = Dimensions.get("window");

export default function CameraScreen() {
  const [cameraPermission, setCameraPermission] = useState();
  const [photo, setPhoto] = useState(null);
  const [zoom, setZoom] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const cameraRef = useRef(null);
  const router = useRouter();
  const { stepIndex, mealId } = useLocalSearchParams();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === "granted");
    })();
  }, []);

  if (!cameraPermission) {
    return <Text>Requesting camera permission...</Text>;
  }

  const takePic = async () => {
    const newPhoto = await cameraRef.current.takePictureAsync({ quality: 1 });
    setPhoto(newPhoto);
  };

  const uploadPhoto = async () => {
    if (!photo?.uri) return;

    try {
      const result = await validateStep({
        photoUri: photo.uri,
        stepIndex,
      });

      setShowSuccess(true);
      setTimeout(() => {
        const nextStep = parseInt(stepIndex) + 1;
        router.replace(`/cooking?stepIndex=${nextStep}&mealId=${mealId}`);
      }, 1000);
    } catch (err) {
      alert("Failed to upload photo. Please try again.");
    }
  };

  return photo ? (
    <SafeAreaView style={styles.imageContainer}>
      <Image style={styles.preview} source={{ uri: photo.uri }} />
      <View style={styles.btnContainer}>
        <TouchableOpacity onPress={() => setPhoto(null)} style={styles.iconBtn}>
          <MaterialCommunityIcons name="camera-retake" size={30} color="#333" />
          <Text style={styles.label}>Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={uploadPhoto} style={styles.iconBtn}>
          <FontAwesome name="send" size={26} color="#333" />
          <Text style={styles.label}>Upload</Text>
        </TouchableOpacity>
      </View>

      {showSuccess && (
        <View style={styles.successOverlay}>
          <FontAwesome name="check-circle" size={60} color="#4CAF50" />
          <Text style={styles.successText}>Step Completed!</Text>
        </View>
      )}
    </SafeAreaView>
  ) : (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        zoom={zoom}
      />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        step={0.01}
        value={zoom}
        onValueChange={setZoom}
        minimumTrackTintColor="#A1B75A"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#A1B75A"
      />
      <View style={styles.shutterContainer}>
        <TouchableOpacity onPress={takePic} style={styles.shutterBtn}>
          <MaterialIcons name="camera" size={70} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  slider: {
    position: "absolute",
    bottom: 150,
    width: "80%",
    alignSelf: "center",
  },
  shutterContainer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
  },
  shutterBtn: {
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: { flex: 1 },
  preview: { flex: 1 },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#fff",
    paddingVertical: 20,
  },
  iconBtn: {
    alignItems: "center",
    padding: 10,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: "#333",
  },
  successOverlay: {
    position: "absolute",
    top: height / 2.5,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 30,
    borderRadius: 20,
    marginHorizontal: 20,
    elevation: 5,
  },
  successText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    color: "#4CAF50",
  },
});
