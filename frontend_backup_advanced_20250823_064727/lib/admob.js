import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

// AdMob configuration
export const AD_UNIT_IDS = {
  banner: __DEV__ 
    ? TestIds.BANNER 
    : Platform.select({
        ios: process.env.EXPO_PUBLIC_ADMOB_BANNER_AD_UNIT_ID || 'ca-app-pub-4432871597544432/1252638738',
        android: process.env.EXPO_PUBLIC_ADMOB_BANNER_AD_UNIT_ID || 'ca-app-pub-4432871597544432/1252638738',
      }),
  interstitial: __DEV__
    ? TestIds.INTERSTITIAL
    : Platform.select({
        ios: process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_AD_UNIT_ID || 'ca-app-pub-4432871597544432/5722366789',
        android: process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_AD_UNIT_ID || 'ca-app-pub-4432871597544432/5722366789',
      }),
  rewarded: __DEV__
    ? TestIds.REWARDED
    : Platform.select({
        ios: process.env.EXPO_PUBLIC_ADMOB_REWARDED_AD_UNIT_ID || 'ca-app-pub-4432871597544432/7928925394',
        android: process.env.EXPO_PUBLIC_ADMOB_REWARDED_AD_UNIT_ID || 'ca-app-pub-4432871597544432/7928925394',
      }),
};

// AdMob initialization
import mobileAds from 'react-native-google-mobile-ads';

export const initializeAdMob = async () => {
  try {
    await mobileAds().initialize();
    
    // Configure ad settings
    await mobileAds().setRequestConfiguration({
      maxAdContentRating: 'PG',
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false,
      testDeviceIdentifiers: __DEV__ ? ['EMULATOR'] : [],
    });

    console.log('AdMob initialized successfully');
    return true;
  } catch (error) {
    console.error('AdMob initialization error:', error);
    return false;
  }
};