import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>This is a modal</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {

  },
});
