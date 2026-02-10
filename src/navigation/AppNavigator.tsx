import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import LoginScreen from '../screens/auth/LoginScreen';
import HomeScreen from '../screens/dashboard/HomeScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { loginSuccess, logout } from '../redux/authSlice';
import { getCurrentUser } from '../api/authApi';
import { View, ActivityIndicator } from 'react-native';
import CreateIncident from '../screens/incidents/CreateIncident';
import IncidentListScreen from '../screens/manager/IncidentListScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          // Token exists, verify it and get user data
          const response = await getCurrentUser();
          dispatch(loginSuccess({ user: response.data, token }));
        }
      } catch (error) {
        console.log('Session restore failed:', error);
        await AsyncStorage.removeItem('token');
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [dispatch]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuth ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="CreateIncident" component={CreateIncident} />
            <Stack.Screen name='AllIncidents' component={IncidentListScreen}/>
          </>
          
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
