import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage Keys
const STORAGE_KEYS = {
  USER_TYPE: 'user_type',
  TEACHER_DATA: 'teacher_data',
  STUDENT_DATA: 'student_data',
  CLASSES: 'classes',
  STUDENTS: 'students',
  GAMES: 'games',
  SCORES: 'scores',
  OFFLINE_GAMES: 'offline_games',
  SYNC_QUEUE: 'sync_queue',
};

// Generic Storage Functions
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error('Error storing data:', error);
    return false;
  }
};

export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error getting data:', error);
    return null;
  }
};

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing data:', error);
    return false;
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

// User Management
export const storeUserType = async (userType) => {
  return await storeData(STORAGE_KEYS.USER_TYPE, userType);
};

export const getUserType = async () => {
  return await getData(STORAGE_KEYS.USER_TYPE);
};

export const storeTeacherData = async (teacherData) => {
  return await storeData(STORAGE_KEYS.TEACHER_DATA, teacherData);
};

export const getTeacherData = async () => {
  return await getData(STORAGE_KEYS.TEACHER_DATA);
};

export const storeStudentData = async (studentData) => {
  return await storeData(STORAGE_KEYS.STUDENT_DATA, studentData);
};

export const getStudentData = async () => {
  return await getData(STORAGE_KEYS.STUDENT_DATA);
};

// Class Management
export const storeClasses = async (classes) => {
  return await storeData(STORAGE_KEYS.CLASSES, classes);
};

export const getClasses = async () => {
  const classes = await getData(STORAGE_KEYS.CLASSES);
  return classes || [];
};

export const addClass = async (newClass) => {
  const classes = await getClasses();
  classes.push(newClass);
  return await storeClasses(classes);
};

// Student Management
export const storeStudents = async (students) => {
  return await storeData(STORAGE_KEYS.STUDENTS, students);
};

export const getStudents = async () => {
  const students = await getData(STORAGE_KEYS.STUDENTS);
  return students || [];
};

export const addStudent = async (newStudent) => {
  const students = await getStudents();
  students.push(newStudent);
  return await storeStudents(students);
};

export const getStudentsByClass = async (classId) => {
  const students = await getStudents();
  return students.filter(student => student.classId === classId);
};

// Game Management
export const storeGames = async (games) => {
  return await storeData(STORAGE_KEYS.GAMES, games);
};

export const getGames = async () => {
  const games = await getData(STORAGE_KEYS.GAMES);
  return games || [];
};

export const addGame = async (newGame) => {
  const games = await getGames();
  games.push(newGame);
  return await storeGames(games);
};

export const saveGame = async (gameData) => {
  return await addGame(gameData);
};

export const getGamesByClass = async (classId) => {
  const games = await getGames();
  return games.filter(game => game.classId === classId);
};

// Score Management
export const storeScores = async (scores) => {
  return await storeData(STORAGE_KEYS.SCORES, scores);
};

export const getScores = async () => {
  const scores = await getData(STORAGE_KEYS.SCORES);
  return scores || [];
};

export const addScore = async (newScore) => {
  const scores = await getScores();
  scores.push(newScore);
  return await storeScores(scores);
};

export const getScoresByStudent = async (studentId) => {
  const scores = await getScores();
  return scores.filter(score => score.studentId === studentId);
};

// Offline Support
export const storeOfflineGames = async (games) => {
  return await storeData(STORAGE_KEYS.OFFLINE_GAMES, games);
};

export const getOfflineGames = async () => {
  const games = await getData(STORAGE_KEYS.OFFLINE_GAMES);
  return games || [];
};

export const addToSyncQueue = async (data) => {
  const syncQueue = await getData(STORAGE_KEYS.SYNC_QUEUE) || [];
  syncQueue.push({ ...data, timestamp: Date.now() });
  return await storeData(STORAGE_KEYS.SYNC_QUEUE, syncQueue);
};

export const getSyncQueue = async () => {
  return await getData(STORAGE_KEYS.SYNC_QUEUE) || [];
};

export const clearSyncQueue = async () => {
  return await storeData(STORAGE_KEYS.SYNC_QUEUE, []);
};

// Utility Functions
export const getStorageSize = async () => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    let totalSize = 0;
    
    for (const key of allKeys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        totalSize += value.length;
      }
    }
    
    return totalSize;
  } catch (error) {
    console.error('Error calculating storage size:', error);
    return 0;
  }
};

export const exportData = async () => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const allData = {};
    
    for (const key of allKeys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        allData[key] = JSON.parse(value);
      }
    }
    
    return allData;
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
};