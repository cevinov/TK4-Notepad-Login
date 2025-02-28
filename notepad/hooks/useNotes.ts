import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export interface Note {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const loadNotes = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tk4_notepad')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      setNotes(data || []);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchNoteById = useCallback(async (noteId: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('tk4_notepad')
        .select('*')
        .eq('id', noteId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching note by ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching note by ID:', error);
      return null;
    }
  }, [user]);
  const addNote = useCallback(async (title: string, content: string) => {
    if (!user) return null;

    try {
      const newNote = {
        title,
        content,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('tk4_notepad')
        .insert([newNote])
        .select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setNotes(prevNotes => [data[0], ...prevNotes]);
        return data[0];
      }
      return null;
    } catch (error) {
      console.error('Error adding note:', error);
      return null;
    }
  }, [user]);

  const updateNote = useCallback(async (id: string, title: string, content: string) => {
    if (!user) return null;

    try {
      const updatedNote = {
        title,
        content,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('tk4_notepad')
        .update(updatedNote)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setNotes(prevNotes => 
          prevNotes.map(note => note.id === id ? data[0] : note)
        );
        return data[0];
      }
      return null;
    } catch (error) {
      console.error('Error updating note:', error);
      return null;
    }
  }, [user]);

  const deleteNote = useCallback(async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tk4_notepad')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }, [user]);

  const getNote = useCallback((id: string) => {
    return notes.find(note => note.id === id) || null;
  }, [notes]);

  return {
    notes,
    isLoading,
    loadNotes,
    addNote,
    updateNote,
    deleteNote,
    getNote,
    fetchNoteById,
  };
};