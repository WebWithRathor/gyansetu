// Validation Utilities
export const validatePhoneNumber = (phone) => {
  // Indian phone number validation (10 digits)
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const validateName = (name) => {
  // Name should be at least 2 characters and only contain letters and spaces
  const nameRegex = /^[a-zA-Z\s]{2,}$/;
  return nameRegex.test(name.trim());
};

export const validateSchoolName = (schoolName) => {
  // School name should be at least 3 characters
  return schoolName.trim().length >= 3;
};

export const validateGrade = (grade) => {
  // Grade should be between 6 and 12
  const gradeNum = parseInt(grade, 10);
  return gradeNum >= 6 && gradeNum <= 12;
};

export const validateQuestion = (question) => {
  // Question should be at least 5 characters
  return question.trim().length >= 5;
};

export const validateAnswer = (answer) => {
  // Answer should be at least 1 character
  return answer.trim().length >= 1;
};

// Format Utilities
export const formatPhoneNumber = (phone) => {
  // Format phone number with country code
  if (phone.startsWith('+91')) {
    return phone;
  }
  return `+91${phone}`;
};

export const formatStudentName = (name) => {
  // Capitalize first letter of each word
  return name
    .trim()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatScore = (score) => {
  // Format score with proper sign
  if (score > 0) {
    return `+${score}`;
  }
  return score.toString();
};

// Data Processing Utilities
export const shuffleArray = (array) => {
  // Fisher-Yates shuffle algorithm
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateId = () => {
  // Generate a unique ID
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const chunkArray = (array, chunkSize) => {
  // Split array into chunks of specified size
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

// Game Utilities
export const calculateScore = (correctAnswers, wrongAnswers, bonusMultiplier = 1) => {
  const baseScore = (correctAnswers * 10) - (wrongAnswers * 5);
  return Math.max(0, baseScore * bonusMultiplier);
};

export const getScoreEmoji = (score, maxScore) => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 90) return { icon: 'star', type: 'MaterialIcons', emoji: '⭐' };
  if (percentage >= 80) return { icon: 'celebration', type: 'MaterialIcons', emoji: '🎉' };
  if (percentage >= 70) return { icon: 'thumb-up', type: 'MaterialIcons', emoji: '👏' };
  if (percentage >= 60) return { icon: 'trending-up', type: 'MaterialIcons', emoji: '👍' };
  if (percentage >= 50) return { icon: 'fitness-center', type: 'MaterialIcons', emoji: '💪' };
  return { icon: 'school', type: 'MaterialIcons', emoji: '📚' };
};

export const formatTime = (seconds) => {
  // Format time in MM:SS format
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Debounce utility for search and input
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};