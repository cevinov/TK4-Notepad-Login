import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNotes } from '../../hooks/useNotes';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function EditNotePage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { updateNote, fetchNoteById } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadNote = async () => {
      if (!id) {
        alert('No note ID provided');
        router.back();
        return;
      }

      console.log('Fetching note with ID:', id);
      const note = await fetchNoteById(id as string);

      if (note) {
        console.log('Note found:', note.title);
        setTitle(note.title);
        setContent(note.content);
        setIsLoading(false);
      } else {
        console.log('Note not found with ID:', id);
        alert('Note not found');
        router.back();
      }
    };

    loadNote();
  }, [id, fetchNoteById, router]);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    setIsSaving(true);
    try {
      const updatedNote = await updateNote(id as string, title, content);

      if (updatedNote) {
        router.back();
      } else {
        alert('Failed to update note');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      alert('An error occurred while saving the note');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View style={styles.container}>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.contentInput}
            value={content}
            onChangeText={setContent}
            placeholder="Note content"
            placeholderTextColor="#999"
            multiline
            textAlignVertical="top"
          />
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
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
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    padding: 8,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});