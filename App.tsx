import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-zinc-950">
      <Text className="text-xl font-bold text-white tracking-widest text-center px-4">
        Mobile App Environment
      </Text>
      <Text className="text-zinc-400 mt-2 text-center text-sm">
        NativeWind & Tailwind are working perfectly!
      </Text>
      <StatusBar style="light" />
    </View>
  );
}
