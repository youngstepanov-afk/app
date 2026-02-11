import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ThemedView>
      <Link href="/modal"><ThemedText>Home</ThemedText></Link>
    </ThemedView>
  );
}
