import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export const DEBUG_MODE = false;

/**
 * Signs in a user with email and password
 */
export const signInWithEmail = async (email: string, password: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      return {
        id: data.user.id,
        email: data.user.email || null,
        displayName: data.user.user_metadata?.name || null,
        photoURL: data.user.user_metadata?.avatar_url || null,
      };
    }
    return null;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

/**
 * Signs up a new user with email and password
 */
export const signUpWithEmail = async (email: string, password: string, name: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      return {
        id: data.user.id,
        email: data.user.email || null,
        displayName: name,
        photoURL: null,
      };
    }
    return null;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

/**
 * Gets the current authenticated user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data } = await supabase.auth.getSession();

    if (data.session?.user) {
      const user = data.session.user;
      return {
        id: user.id,
        email: user.email || null,
        displayName: user.user_metadata?.name || null,
        photoURL: user.user_metadata?.avatar_url || null,
      };
    }
    return null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

/**
 * Signs out the current user
 */
export const signOut = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};