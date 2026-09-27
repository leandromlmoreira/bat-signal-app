import { SafeAreaProvider } from 'react-native-safe-area-context';

import Central from './src/screens/Central/Central';

export default function App() {
  return (
    <SafeAreaProvider>
      <Central />
    </SafeAreaProvider>
  );
}
