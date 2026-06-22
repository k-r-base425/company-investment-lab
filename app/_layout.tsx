import { Stack } from "expo-router";

import { SelectedMonthProvider } from "../contexts/SelectedMonthContext";

export default function RootLayout() {
  return (
    <SelectedMonthProvider>
      <Stack
        screenOptions={{
          headerShown: false
        }}
      />
    </SelectedMonthProvider>
  );
}
