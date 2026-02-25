import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from './src/theme/gluestack-ui.config';

export default function App() {
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
