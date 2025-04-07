import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions, CameraType } from "expo-camera";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function CameraCaptureScreen() {
  const router = useRouter();
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const takePhoto = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedPhoto(photo);
      } catch (err) {
        console.error("Error capturing photo:", err);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
  };

  const confirmPhoto = () => {
    Alert.alert("📸 Photo saved!", "You can now send this for scoring later.");
    router.back();
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text>Camera access is required</Text>
        <Pressable
          style={styles.retakeButton}
          onPress={() => requestPermission()}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {capturedPhoto ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedPhoto.uri }} style={styles.preview} />
          <View style={styles.buttonRow}>
            <Pressable style={styles.retakeButton} onPress={retakePhoto}>
              <Text style={styles.buttonText}>Retake</Text>
            </Pressable>
            <Pressable style={styles.confirmButton} onPress={confirmPhoto}>
              <Text style={styles.buttonText}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            onCameraReady={() => setIsCameraReady(true)}
          />

          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="white" />
          </Pressable>

          <View style={styles.controls}>
            <Pressable style={styles.captureButton} onPress={takePhoto}>
              <Ionicons name="camera" size={30} color="white" />
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  controls: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
  captureButton: {
    backgroundColor: "#A1B75A",
    padding: 20,
    borderRadius: 50,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  preview: {
    width,
    height,
    resizeMode: "contain",
  },
  buttonRow: {
    position: "absolute",
    bottom: 60,
    flexDirection: "row",
    gap: 20,
  },
  retakeButton: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  confirmButton: {
    backgroundColor: "#A1B75A",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
