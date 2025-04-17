import { CameraView, Camera } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useRouter, useLocalSearchParams } from "expo-router";

import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

export default function CameraScreen() {
  const [cameraPermission, setCameraPermission] = useState();
  const [photo, setPhoto] = useState(null);
  const [zoom, setZoom] = useState(0);
  const cameraRef = useRef(null);
  const router = useRouter();
  const { stepIndex } = useLocalSearchParams();

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
    if (!photo || !photo.uri) return;

    const formData = new FormData();
    formData.append("file", {
      uri: photo.uri,
      name: `step_${stepIndex}.jpg`,
      type: "image/jpeg",
    });
    formData.append("step_index", stepIndex || "0");

    try {
      const res = await fetch("http://192.168.2.154:8000/validate-step/", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const result = await res.json();
      console.log("Upload response:", result);

      if (result.success) {
        router.back();
      } else {
        alert("Step validation failed.");
      }
    } catch (err) {
      console.error("Error uploading photo:", err);
      alert("Failed to upload photo.");
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
});
