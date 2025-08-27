const BASE_URL = (process.env.EXPO_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");

// --- HISTORY ---
export const getHistoryEvents = async (month, day) => {
  try {
    const response = await fetch(`https://history.muffinlabs.com/date/${month}/${day}`);
    const data = await response.json();
    if (data?.data?.Events) {
      return data.data.Events.slice(0, 3).map(ev => ({
        year: ev.year, text: ev.text, html: ev.html,
      }));
    }
    return [];
  } catch (e) { console.error('Error fetching history events:', e); return []; }
};

// --- FUN FACT ---
export const getFunFact = async () => {
  try {
    const response = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en');
    const data = await response.json();
    return { text: data.text, source: data.source, source_url: data.source_url };
  } catch (error) {
    console.error('Error fetching fun fact:', error);
    try {
      const today = new Date(); const m = today.getMonth()+1; const d = today.getDate();
      const res = await fetch(`http://numbersapi.com/${m}/${d}/date?json`);
      const data = await res.json();
      return { text: data.text, source: 'Numbers API', source_url: 'http://numbersapi.com' };
    } catch (fallbackError) {
      console.error('Error fetching fallback fun fact:', fallbackError);
      return { text: 'Did you know? Octopuses have three hearts and blue blood!', source: 'Default', source_url: '' };
    }
  }
};

// --- PUZZLE (OpenTDB) ---
export const getDailyPuzzle = async () => {
  try {
    const res = await fetch(`https://opentdb.com/api.php?amount=1&difficulty=medium&type=multiple&encode=url3986`);
    const data = await res.json();
    if (data?.results?.length) {
      const q = data.results[0];
      const all = [q.correct_answer, ...q.incorrect_answers].sort(() => Math.random() - 0.5);
      return {
        question: decodeURIComponent(q.question),
        correctAnswer: decodeURIComponent(q.correct_answer),
        answers: all.map(a => decodeURIComponent(a)),
        category: decodeURIComponent(q.category),
        difficulty: q.difficulty,
      };
    }
    return null;
  } catch (e) {
    console.error('Error fetching daily puzzle:', e);
    return { question: 'What is the largest planet in our solar system?', correctAnswer: 'Jupiter', answers: ['Jupiter','Saturn','Earth','Mars'], category: 'Science', difficulty: 'medium' };
  }
};

// --- BACKEND HELPERS ---
export const submitPuzzleScore = async (userId, score, timeTaken) => {
  if (!BASE_URL) return { success: false, error: 'No backend URL configured' };
  try {
    const res = await fetch(`${BASE_URL}/api/submit-score`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, score, timeTaken, date: new Date().toISOString().split('T')[0] }),
    });
    return await res.json();
  } catch (e) { console.error('Error submitting score:', e); return { success: false, error: e.message }; }
};

export const getLeaderboard = async (period = 'today') => {
  if (!BASE_URL) return [];
  try { const res = await fetch(`${BASE_URL}/api/leaderboard?period=${period}`); return await res.json(); }
  catch (e) { console.error('Error fetching leaderboard:', e); return []; }
};

export const processReward = async (userId, rewardType, rewardAmount) => {
  if (!BASE_URL) return { success: false, error: 'No backend URL configured' };
  try {
    const res = await fetch(`${BASE_URL}/api/process-reward`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, rewardType, rewardAmount, timestamp: new Date().toISOString() }),
    });
    return await res.json();
  } catch (e) { console.error('Error processing reward:', e); return { success: false, error: e.message }; }
};

// NEW: user stats
export const getUserStats = async (userId) => {
  try {
    const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/user/${userId}/stats`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};
