import { Text, View } from 'react-native';

export default function Page() {
  throw new Error("Router entry test crash");
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' }}>
      <Text style={{ color: 'white', fontSize: 24 }}>🎉 Daily Bite: Fun & Facts</Text>
      <Text style={{ color: '#a0a0a0', fontSize: 16, marginTop: 10 }}>It's working!</Text>
    </View>
  );
}