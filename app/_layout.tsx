import { DarkTheme } from '@react-navigation/native';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useFonts } from 'expo-font';
import { CharacterProvider } from '@/store/CharacterContext';
import { ErrorBoundary } from '@/components/rpg/ErrorBoundary';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  useFonts({
    PlanewalkerDings: require('@/assets/fonts/PlanewalkerDings.otf'),
  });

  return (
    <ErrorBoundary>
      <CharacterProvider>
        <ThemeProvider value={DarkTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </CharacterProvider>
    </ErrorBoundary>
  );
}
