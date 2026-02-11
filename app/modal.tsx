import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  return (
    <ThemedView isModal>
      <ThemedText>This is a modal</ThemedText>
    </ThemedView>
  );
}
