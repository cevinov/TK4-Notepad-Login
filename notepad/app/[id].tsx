import React, { useEffect, useState } from 'react';
import { useNotes, Note } from '../hooks/useNotes';
import ProtectedRoute from '../components/ProtectedRoute';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NoteDetail() {
  const { id } = useLocalSearchParams();
  const { fetchNoteById } = useNotes();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadNote = async () => {
      if (!id) {
        alert('No note ID provided');
        router.back();
        return;
      }

      const fetchedNote = await fetchNoteById(id as string);
      setNote(fetchedNote);
      setIsLoading(false);

      if (!fetchedNote) {
        alert('Note not found');
        router.back();
      }
    };

    loadNote();
  }, [id, fetchNoteById, router]);

  return (
    <ProtectedRoute>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : note ? (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{note.title}</Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => router.push(`/edit-note/${note.id}`)}
            >
              <Ionicons name="pencil" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.contentContainer}>
            <Text style={styles.content}>{note.content}</Text>
          </ScrollView>
        </View>
      ) : (
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFound}>Note not found</Text>
        </View>
      )}
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  editButton: {
    padding: 8,
  },
  contentContainer: {
    flex: 1,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  notFound: {
    fontSize: 18,
    color: '#999',
  }
});