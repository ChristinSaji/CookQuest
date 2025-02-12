import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-gray-100">
      <View className="p-4 bg-blue-500 rounded-lg">
        <Text className="text-white text-lg font-bold">
          Welcome to CookQuest
        </Text>
      </View>
    </SafeAreaView>
  );
}
