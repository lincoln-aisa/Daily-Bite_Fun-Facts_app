import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const BANNER_ID = process.env.EXPO_PUBLIC_ADMOB_BANNER_AD_UNIT_ID || TestIds.BANNER;

export default function BottomBar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={styles.wrap}>
      {/* Ad above tabs */}
      <View style={styles.adWrap}>
        <BannerAd unitId={BANNER_ID} size={BannerAdSize.LARGE_BANNER} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Tab label="🏠 Home" active={pathname === '/'} onPress={() => router.replace('/')} />
        <Tab label="🏆 Leaderboard" active={pathname === '/leaderboard'} onPress={() => router.replace('/leaderboard')} />
        <Tab label="👤 Profile" active={pathname === '/profile'} onPress={() => router.replace('/profile')} />
      </View>
    </View>
  );
}

function Tab({ label, active, onPress }: {label:string; active:boolean; onPress:()=>void}) {
  return (
    <TouchableOpacity style={[styles.tab, active && styles.tabActive]} onPress={onPress}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: '#0f1626',
    paddingTop: 6,
  },
  adWrap: { alignItems: 'center', marginBottom: 6 },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#0f3460',
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  tabActive: { backgroundColor: '#273c75' },
  tabText: { color: '#a0a0a0', fontSize: 12 },
  tabTextActive: { color: '#fff', fontWeight: 'bold' },
});
