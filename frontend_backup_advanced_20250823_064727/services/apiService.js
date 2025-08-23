const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

// History API service
export const getHistoryEvents = async (month, day) => {
  try {
    const response = await fetch(`https://history.muffinlabs.com/date/${month}/${day}`);
    const data = await response.json();
    
    if (data.data && data.data.Events) {
      // Return top 3 most interesting events
      return data.data.Events.slice(0, 3).map(event => ({
        year: event.year,
        text: event.text,
        html: event.html,
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching history events:', error);
    return [];
  }
};

// Fun Facts API service
export const getFunFact = async () => {
  try {
    const response = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en');
    const data = await response.json();
    return {
      text: data.text,
      source: data.source,
      source_url: data.source_url,
    };
  } catch (error) {
    console.error('Error fetching fun fact:', error);
    // Fallback to Numbers API
    try {
      const today = new Date();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      const response = await fetch(`http://numbersapi.com/${month}/${day}/date?json`);
      const data = await response.json();
      return {
        text: data.text,
        source: 'Numbers API',
        source_url: 'http://numbersapi.com',
      };
    } catch (fallbackError) {
      console.error('Error fetching fallback fun fact:', fallbackError);
      return {
        text: 'Did you know? Octopuses have three hearts and blue blood!',
        source: 'Default',
        source_url: '',
      };
    }
  }
};

// Trivia API service
export const getDailyPuzzle = async () => {
  try {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const response = await fetch(`https://opentdb.com/api.php?amount=1&difficulty=medium&type=multiple&encode=url3986`);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const question = data.results[0];
      const allAnswers = [question.correct_answer, ...question.incorrect_answers];
      const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);
      
      return {
        question: decodeURIComponent(question.question),
        correctAnswer: decodeURIComponent(question.correct_answer),
        answers: shuffledAnswers.map(answer => decodeURIComponent(answer)),
        category: decodeURIComponent(question.category),
        difficulty: question.difficulty,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching daily puzzle:', error);
    // Return a default question
    return {
      question: 'What is the largest planet in our solar system?',
      correctAnswer: 'Jupiter',
      answers: ['Jupiter', 'Saturn', 'Earth', 'Mars'],
      category: 'Science',
      difficulty: 'medium',
    };
  }
};

// Backend API calls
export const submitPuzzleScore = async (userId, score, timeTaken) => {
  try {
    const response = await fetch(`${BASE_URL}/api/submit-score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        score,
        timeTaken,
        date: new Date().toISOString().split('T')[0],
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error submitting score:', error);
    return { success: false, error: error.message };
  }
};

export const getLeaderboard = async (period = 'today') => {
  try {
    const response = await fetch(`${BASE_URL}/api/leaderboard?period=${period}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

export const processReward = async (userId, rewardType, rewardAmount) => {
  try {
    const response = await fetch(`${BASE_URL}/api/process-reward`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        rewardType,
        rewardAmount,
        timestamp: new Date().toISOString(),
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error processing reward:', error);
    return { success: false, error: error.message };
  }
};