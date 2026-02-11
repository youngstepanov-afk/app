import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function TabTwoScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Explore</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {

  },
});
