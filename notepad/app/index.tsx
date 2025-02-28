import { View, FlatList, TouchableOpacity, StyleSheet, Text, ActivityIndicator, Alert, Image } from 'react-native';
import NoteItem from '../components/NoteItem';
import React, { useState, useEffect } from 'react';
import { useNotes } from '../hooks/useNotes';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { notes, loadNotes, deleteNote } = useNotes();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load notes when component mounts
    loadNotes();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadNotes();
    setIsRefreshing(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteNote(id) }
      ]
    );
  };

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Sign Out", 
          style: "destructive", 
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('Sign out error:', error);
            }
          } 
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TK4 - Notepad</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleRefresh} disabled={isRefreshing} style={styles.iconButton}>
            {isRefreshing ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : (
              <Ionicons name="refresh" size={24} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignOut} style={styles.userContainer}>
            <Ionicons name="person-circle" size={36} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>
          Welcome, {user?.displayName || user?.email || 'User'}
        </Text>
      </View>

      <FlatList
        data={notes}
        renderItem={({ item }) => <NoteItem note={item} onDelete={handleDelete} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notes yet. Create your first note!</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/new-note')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 16,
    padding: 4,
  },
  userContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  welcomeText: {
    fontSize: 16,
    color: theme.colors.secondaryText,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.secondaryText,
    fontSize: 16,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
});