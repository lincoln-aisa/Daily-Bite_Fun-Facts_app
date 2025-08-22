import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAppStore = create((set, get) => ({
  // User data
  user: null,
  isAuthenticated: false,
  
  // Daily content
  todayContent: {
    history: [],
    funFact: null,
    puzzle: null,
    date: null,
  },
  
  // User progress
  streak: 0,
  totalPoints: 0,
  lastOpenDate: null,
  
  // Leaderboard
  leaderboard: [],
  userRank: null,
  
  // App state
  loading: false,
  error: null,
  
  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setTodayContent: (content) => set({ todayContent: content }),
  
  updateStreak: async () => {
    const today = new Date().toDateString();
    const { lastOpenDate } = get();
    
    if (lastOpenDate) {
      const lastDate = new Date(lastOpenDate);
      const todayDate = new Date(today);
      const diffTime = todayDate - lastDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive day
        set(state => ({ 
          streak: state.streak + 1,
          lastOpenDate: today 
        }));
      } else if (diffDays > 1) {
        // Streak broken
        set({ streak: 1, lastOpenDate: today });
      }
      // Same day, no change
    } else {
      // First time opening
      set({ streak: 1, lastOpenDate: today });
    }
    
    // Save to AsyncStorage
    const { streak } = get();
    await AsyncStorage.setItem('userStreak', JSON.stringify({ streak, lastOpenDate: today }));
  },
  
  addPoints: (points) => set(state => ({ 
    totalPoints: state.totalPoints + points 
  })),
  
  setLeaderboard: (leaderboard) => set({ leaderboard }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  // Initialize app data from storage
  initializeApp: async () => {
    try {
      const storedStreak = await AsyncStorage.getItem('userStreak');
      if (storedStreak) {
        const { streak, lastOpenDate } = JSON.parse(storedStreak);
        set({ streak, lastOpenDate });
      }
      
      const storedPoints = await AsyncStorage.getItem('totalPoints');
      if (storedPoints) {
        set({ totalPoints: parseInt(storedPoints) });
      }
    } catch (error) {
      console.error('Error initializing app data:', error);
    }
  },
}));

export default useAppStore;