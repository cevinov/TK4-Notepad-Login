import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNotes } from '../hooks/useNotes';
import { theme } from '../constants/theme';
import ProtectedRoute from '../components/ProtectedRoute';

export default function EditNote() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { getNote, updateNote } = useNotes();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const note = getNote(id);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
      } else {
        Alert.alert('Error', 'Note not found');
        router.back();
      }
    }
  }, [id, getNote]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your note');
      return;
    }

    if (!id) {
      Alert.alert('Error', 'Note ID is missing');
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateNote(id, title.trim(), content.trim());
      if (result) {
        router.back();
      } else {
        Alert.alert('Error', 'Failed to update note. Please try again.');
      }
    } catch (error) {
      console.error('Error updating note:', error);
      Alert.alert('Error', 'An error occurred while updating your note');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <TextInput
          style={styles.titleInput}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />
        <TextInput
          style={styles.contentInput}
          placeholder="Write your note here..."
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Update Note'}
          </Text>
        </TouchableOpacity>
      </View>
    </ProtectedRoute>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    padding: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    padding: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});