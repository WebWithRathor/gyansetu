import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getUserType, getTeacherData, getStudentData } from '../utils/storage';

// Initial State
const initialState = {
  // User Management
  isLoading: true,
  userType: null, // 'teacher' | 'student' | null
  teacherData: null,
  studentData: null,
  isAuthenticated: false,
  
  // Navigation State
  currentScreen: null,
  
  // Game State
  currentGame: null,
  gameState: {
    score: 0,
    moves: 0,
    timeElapsed: 0,
    isGameActive: false,
  },
  
  // Network State
  isOnline: true,
  syncInProgress: false,
  
  // UI State
  showModal: false,
  modalContent: null,
  notification: null,
};

// Action Types
const actionTypes = {
  // Authentication
  SET_LOADING: 'SET_LOADING',
  SET_USER_TYPE: 'SET_USER_TYPE',
  SET_TEACHER_DATA: 'SET_TEACHER_DATA',
  SET_STUDENT_DATA: 'SET_STUDENT_DATA',
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
  LOGOUT: 'LOGOUT',
  
  // Navigation
  SET_CURRENT_SCREEN: 'SET_CURRENT_SCREEN',
  
  // Game Actions
  SET_CURRENT_GAME: 'SET_CURRENT_GAME',
  UPDATE_GAME_STATE: 'UPDATE_GAME_STATE',
  RESET_GAME_STATE: 'RESET_GAME_STATE',
  
  // Network Actions
  SET_ONLINE_STATUS: 'SET_ONLINE_STATUS',
  SET_SYNC_STATUS: 'SET_SYNC_STATUS',
  
  // UI Actions
  SHOW_MODAL: 'SHOW_MODAL',
  HIDE_MODAL: 'HIDE_MODAL',
  SHOW_NOTIFICATION: 'SHOW_NOTIFICATION',
  HIDE_NOTIFICATION: 'HIDE_NOTIFICATION',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
      
    case actionTypes.SET_USER_TYPE:
      return {
        ...state,
        userType: action.payload,
      };
      
    case actionTypes.SET_TEACHER_DATA:
      return {
        ...state,
        teacherData: action.payload,
        isAuthenticated: !!action.payload,
      };
      
    case actionTypes.SET_STUDENT_DATA:
      return {
        ...state,
        studentData: action.payload,
        isAuthenticated: !!action.payload,
      };
      
    case actionTypes.SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.payload,
      };
      
    case actionTypes.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      };
      
    case actionTypes.SET_CURRENT_SCREEN:
      return {
        ...state,
        currentScreen: action.payload,
      };
      
    case actionTypes.SET_CURRENT_GAME:
      return {
        ...state,
        currentGame: action.payload,
      };
      
    case actionTypes.UPDATE_GAME_STATE:
      return {
        ...state,
        gameState: {
          ...state.gameState,
          ...action.payload,
        },
      };
      
    case actionTypes.RESET_GAME_STATE:
      return {
        ...state,
        gameState: {
          score: 0,
          moves: 0,
          timeElapsed: 0,
          isGameActive: false,
        },
      };
      
    case actionTypes.SET_ONLINE_STATUS:
      return {
        ...state,
        isOnline: action.payload,
      };
      
    case actionTypes.SET_SYNC_STATUS:
      return {
        ...state,
        syncInProgress: action.payload,
      };
      
    case actionTypes.SHOW_MODAL:
      return {
        ...state,
        showModal: true,
        modalContent: action.payload,
      };
      
    case actionTypes.HIDE_MODAL:
      return {
        ...state,
        showModal: false,
        modalContent: null,
      };
      
    case actionTypes.SHOW_NOTIFICATION:
      return {
        ...state,
        notification: action.payload,
      };
      
    case actionTypes.HIDE_NOTIFICATION:
      return {
        ...state,
        notification: null,
      };
      
    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider Component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Initialize app state
  useEffect(() => {
    initializeApp();
  }, []);
  
  const initializeApp = async () => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      
      // Check user type
      const userType = await getUserType();
      if (userType) {
        dispatch({ type: actionTypes.SET_USER_TYPE, payload: userType });
        
        // Load user data based on type
        if (userType === 'teacher') {
          const teacherData = await getTeacherData();
          if (teacherData) {
            dispatch({ type: actionTypes.SET_TEACHER_DATA, payload: teacherData });
          }
        } else if (userType === 'student') {
          const studentData = await getStudentData();
          if (studentData) {
            dispatch({ type: actionTypes.SET_STUDENT_DATA, payload: studentData });
          }
        }
      }
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
    }
  };
  
  // Action Creators
  const actions = {
    // Authentication Actions
    setUserType: (userType) => {
      dispatch({ type: actionTypes.SET_USER_TYPE, payload: userType });
    },
    
    setTeacherData: (data) => {
      dispatch({ type: actionTypes.SET_TEACHER_DATA, payload: data });
    },
    
    setStudentData: (data) => {
      dispatch({ type: actionTypes.SET_STUDENT_DATA, payload: data });
    },
    
    logout: () => {
      dispatch({ type: actionTypes.LOGOUT });
    },
    
    // Navigation Actions
    setCurrentScreen: (screen) => {
      dispatch({ type: actionTypes.SET_CURRENT_SCREEN, payload: screen });
    },
    
    // Game Actions
    setCurrentGame: (game) => {
      dispatch({ type: actionTypes.SET_CURRENT_GAME, payload: game });
    },
    
    updateGameState: (updates) => {
      dispatch({ type: actionTypes.UPDATE_GAME_STATE, payload: updates });
    },
    
    resetGameState: () => {
      dispatch({ type: actionTypes.RESET_GAME_STATE });
    },
    
    // Network Actions
    setOnlineStatus: (isOnline) => {
      dispatch({ type: actionTypes.SET_ONLINE_STATUS, payload: isOnline });
    },
    
    setSyncStatus: (inProgress) => {
      dispatch({ type: actionTypes.SET_SYNC_STATUS, payload: inProgress });
    },
    
    // UI Actions
    showModal: (content) => {
      dispatch({ type: actionTypes.SHOW_MODAL, payload: content });
    },
    
    hideModal: () => {
      dispatch({ type: actionTypes.HIDE_MODAL });
    },
    
    showNotification: (notification) => {
      dispatch({ type: actionTypes.SHOW_NOTIFICATION, payload: notification });
    },
    
    hideNotification: () => {
      dispatch({ type: actionTypes.HIDE_NOTIFICATION });
    },
  };
  
  const value = {
    ...state,
    ...actions,
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export { actionTypes };
export default AppContext;