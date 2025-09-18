// API Base Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-api.com/api';

// Network utilities
export const checkNetworkConnection = async () => {
  try {
    // Simple network check
    await fetch('https://www.google.com', {
      method: 'HEAD',
      mode: 'no-cors',
    });
    return true;
  } catch (error) {
    return false;
  }
};

// Generic API function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: error.message };
  }
};

// Authentication APIs
export const teacherLogin = async (phoneNumber) => {
  return await apiRequest('/auth/teacher/login', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber }),
  });
};

export const teacherRegister = async (teacherData) => {
  return await apiRequest('/auth/teacher/register', {
    method: 'POST',
    body: JSON.stringify(teacherData),
  });
};

export const studentLogin = async (phoneNumber) => {
  return await apiRequest('/auth/student/login', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber }),
  });
};

export const getStudentsByPhone = async (phoneNumber) => {
  return await apiRequest(`/auth/students-by-phone/${phoneNumber}`);
};

// Teacher APIs
export const createClass = async (classData) => {
  return await apiRequest('/teacher/classes', {
    method: 'POST',
    body: JSON.stringify(classData),
  });
};

export const getTeacherClasses = async (teacherId) => {
  return await apiRequest(`/teacher/${teacherId}/classes`);
};

export const addStudentToClass = async (studentData) => {
  return await apiRequest('/teacher/students', {
    method: 'POST',
    body: JSON.stringify(studentData),
  });
};

export const addStudentsFromExcel = async (studentsData) => {
  return await apiRequest('/teacher/students/bulk', {
    method: 'POST',
    body: JSON.stringify(studentsData),
  });
};

export const createGame = async (gameData) => {
  return await apiRequest('/teacher/games', {
    method: 'POST',
    body: JSON.stringify(gameData),
  });
};

export const publishGame = async (gameId, classIds) => {
  return await apiRequest(`/teacher/games/${gameId}/publish`, {
    method: 'POST',
    body: JSON.stringify({ classIds }),
  });
};

// Student APIs
export const getStudentGames = async (studentId) => {
  return await apiRequest(`/student/${studentId}/games`);
};

export const submitGameScore = async (scoreData) => {
  return await apiRequest('/student/scores', {
    method: 'POST',
    body: JSON.stringify(scoreData),
  });
};

export const getStudentScores = async (studentId) => {
  return await apiRequest(`/student/${studentId}/scores`);
};

export const getLeaderboard = async (classId, gameId) => {
  return await apiRequest(`/student/leaderboard/${classId}/${gameId}`);
};

// Game APIs
export const getGameDetails = async (gameId) => {
  return await apiRequest(`/games/${gameId}`);
};

export const downloadGameForOffline = async (gameId) => {
  return await apiRequest(`/games/${gameId}/download`);
};

// Sync APIs
export const syncOfflineData = async (syncData) => {
  return await apiRequest('/sync', {
    method: 'POST',
    body: JSON.stringify(syncData),
  });
};

export const getLastSyncTime = async (userId) => {
  return await apiRequest(`/sync/last-sync/${userId}`);
};

// Analytics APIs
export const getTeacherAnalytics = async (teacherId) => {
  return await apiRequest(`/analytics/teacher/${teacherId}`);
};

export const getStudentProgress = async (studentId) => {
  return await apiRequest(`/analytics/student/${studentId}`);
};

export const getClassAnalytics = async (classId) => {
  return await apiRequest(`/analytics/class/${classId}`);
};

// Mock API responses for development/offline mode
export const mockApiResponses = {
  teacherLogin: {
    success: true,
    data: {
      id: 'teacher_1',
      name: 'Priya Sharma',
      phoneNumber: '+919876543210',
      schoolName: 'Rural Government School',
      token: 'mock_token_123',
    },
  },
  
  studentLogin: {
    success: true,
    data: [
      {
        id: 'student_1',
        name: 'Rahul Kumar',
        phoneNumber: '+919876543210',
        grade: 8,
        classId: 'class_1',
      },
      {
        id: 'student_2',
        name: 'Priya Kumari',
        phoneNumber: '+919876543210',
        grade: 10,
        classId: 'class_2',
      },
    ],
  },
  
  studentGames: {
    success: true,
    data: [
      {
        id: 'game_1',
        title: 'Math Basics',
        type: 'matching',
        subject: 'Mathematics',
        grade: 8,
        questions: 10,
        isCompleted: false,
      },
      {
        id: 'game_2',
        title: 'Science Quiz',
        type: 'blockblast',
        subject: 'Science',
        grade: 8,
        questions: 15,
        isCompleted: true,
        score: 85,
      },
    ],
  },
};

// Function to use mock data in development
export const useMockApi = __DEV__;

export const getMockResponse = (endpoint) => {
  if (endpoint.includes('teacher/login')) return mockApiResponses.teacherLogin;
  if (endpoint.includes('student/login')) return mockApiResponses.studentLogin;
  if (endpoint.includes('student') && endpoint.includes('games')) return mockApiResponses.studentGames;
  return { success: false, error: 'Mock endpoint not found' };
};