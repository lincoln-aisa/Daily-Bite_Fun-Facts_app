import { Text, View } from 'react-native';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a2e',
      }}
    >
      <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: 'bold' }}>
        Daily Bite: Fun & Facts
      </Text>
      <Text style={{ color: '#a0a0a0', fontSize: 16, marginTop: 10 }}>
        Your daily dose of history, facts & puzzles!
      </Text>
    </View>
  );
}