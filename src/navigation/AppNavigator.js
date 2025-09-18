import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useApp } from '../context/AppContext';

// Auth Screens
import UserTypeSelection from '../screens/auth/UserTypeSelection';
import TeacherAuth from '../screens/auth/TeacherAuth';
import StudentAuth from '../screens/auth/StudentAuth';

// Teacher Screens
import TeacherDashboard from '../screens/teacher/TeacherDashboard';
import CreateClass from '../screens/teacher/CreateClass';
import AddStudents from '../screens/teacher/AddStudents';
import CreateContent from '../screens/teacher/CreateContent';
import PublishGame from '../screens/teacher/PublishGame';

// Student Screens
import StudentDashboard from '../screens/student/StudentDashboard';
import GameSelection from '../screens/student/GameSelection';
import ScoreFeedback from '../screens/student/ScoreFeedback';

// Game Screens
import MatchingGame from '../screens/games/MatchingGame';
import BlockBlastGame from '../screens/games/BlockBlastGame';

// Loading Screen
import LoadingScreen from '../screens/auth/LoadingScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isLoading, isAuthenticated, userType } = useApp();
  
  if (isLoading) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Loading" component={LoadingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
        initialRouteName={isAuthenticated ? getInitialRoute() : 'UserTypeSelection'}
      >
        {!isAuthenticated ? (
          // Auth Stack
          <>
            <Stack.Screen name="UserTypeSelection" component={UserTypeSelection} />
            <Stack.Screen name="TeacherAuth" component={TeacherAuth} />
            <Stack.Screen name="StudentAuth" component={StudentAuth} />
          </>
        ) : userType === 'teacher' ? (
          // Teacher Stack
          <>
            <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
            <Stack.Screen name="CreateClass" component={CreateClass} />
            <Stack.Screen name="AddStudents" component={AddStudents} />
            <Stack.Screen name="CreateContent" component={CreateContent} />
            <Stack.Screen name="PublishGame" component={PublishGame} />
          </>
        ) : (
          // Student Stack
          <>
            <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
            <Stack.Screen name="GameSelection" component={GameSelection} />
            <Stack.Screen name="MatchingGame" component={MatchingGame} />
            <Stack.Screen name="BlockBlastGame" component={BlockBlastGame} />
            <Stack.Screen name="ScoreFeedback" component={ScoreFeedback} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
  
  function getInitialRoute() {
    if (userType === 'teacher') {
      return 'TeacherDashboard';
    } else if (userType === 'student') {
      return 'StudentDashboard';
    }
    return 'UserTypeSelection';
  }
};

export default AppNavigator;