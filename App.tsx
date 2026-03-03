import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from './src/theme/gluestack-ui.config';

import { useEffect } from 'react';
import { setupNotificationListeners } from './src/services/notificationService';

export default function App() {
  useEffect(() => {
    const unsubscribe = setupNotificationListeners();
    return () => unsubscribe();
  }, []);

  return (
    <Provider store={store}>
      <GluestackUIProvider config={config}>
        <SafeAreaProvider>
          <AppNavigator />
        </SafeAreaProvider>
      </GluestackUIProvider>
    </Provider>
  );
}
