import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import LoginScreen from '../screens/auth/LoginScreen';
import HomeScreen from '../screens/dashboard/HomeScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginSuccess, logout } from '../redux/authSlice';
import { getCurrentUser } from '../api/authApi';
import CreateIncident from '../screens/incidents/CreateIncident';
import IncidentList from '../screens/incidents/IncidentList';
import IncidentDetailsScreen from '../screens/manager/IncidentDetailsScreen';
import AssignedIncidentsScreen from '../screens/engineer/AssignedIncidentsScreen';
import UpdateIncidentStatusScreen from '../screens/engineer/UpdateIncidentStatusScreen';
import MyIncidentsScreen from '../screens/reporter/MyIncidentsScreen';
import SplashScreen from '../screens/SplashScreen';

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
          const response = await getCurrentUser();
          dispatch(loginSuccess({ user: response.data, token }));
        }
      } catch (error) {
        console.log('Session restore failed:', error);
        await AsyncStorage.removeItem('token');
        dispatch(logout());
      } finally {
        // Keep splash for at least 2 seconds for branding
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };

    restoreSession();
  }, [dispatch]);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuth ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="CreateIncident" component={CreateIncident} />
            <Stack.Screen name="IncidentList" component={IncidentList} />
            <Stack.Screen name="AllIncidents" component={IncidentList} />
            <Stack.Screen name="IncidentDetails" component={IncidentDetailsScreen} />
            <Stack.Screen name='AssignedIncidents' component={AssignedIncidentsScreen} />
            <Stack.Screen name='UpdateStatus' component={UpdateIncidentStatusScreen} />
            <Stack.Screen name='MyIncidents' component={MyIncidentsScreen} />
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
