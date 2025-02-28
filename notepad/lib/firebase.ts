// Mock Firebase implementation to prevent native module errors

// Mock Firebase Auth
const mockUser = {
  uid: 'mock-uid-123',
  email: 'mock@example.com',
  displayName: 'Mock User',
  photoURL: 'https://ui-avatars.com/api/?name=Mock+User',
  emailVerified: true,
  isAnonymous: false,
  metadata: {
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString(),
  },
  providerData: [],
  refreshToken: 'mock-refresh-token',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => 'mock-id-token',
  getIdTokenResult: async () => ({}),
  reload: async () => {},
  toJSON: () => ({}),
  phoneNumber: null,
  providerId: 'firebase',
};

// Mock auth module
const mockAuth = {
  currentUser: mockUser,
  onAuthStateChanged: (callback: (user: typeof mockUser | null) => void) => {
    // Simulate auth state change after a short delay
    setTimeout(() => callback(mockUser), 100);
    // Return unsubscribe function
    return () => {};
  },
  signInWithCredential: async () => ({ user: mockUser }),
  signOut: async () => {},
  GoogleAuthProvider: {
    credential: (idToken: string) => ({ idToken }),
  },
};

// Mock Firebase app
const mockApp = {
  auth: () => mockAuth,
  // Add other Firebase services as needed
};

// Mock Firebase module
const mockFirebase = {
  app: () => mockApp,
  apps: [mockApp],
  initializeApp: () => mockApp,
};

// Export mock auth
export const auth = () => mockAuth;
// Mock implementation of GoogleSignin to prevent native module errors
export const GoogleSignin = {
  hasPlayServices: async ({ showPlayServicesUpdateDialog = false } = {}) => {
    console.log('[MOCK] Checking Play Services', { showPlayServicesUpdateDialog });
    return true;
  },
  configure: (options = {}) => {
    console.log('[MOCK] Configuring GoogleSignin', options);
  },
  signIn: async () => {
    console.log('[MOCK] Google Sign-In');
    return {
      user: {
        id: 'mock-google-id',
        name: 'Mock User',
        email: 'mock@example.com',
        photo: 'https://ui-avatars.com/api/?name=Mock+User',
      }
    };
  },
  getTokens: async () => {
    console.log('[MOCK] Getting Google tokens');
    return { 
      idToken: 'mock-id-token',
      accessToken: 'mock-access-token'
    };
  },
  revokeAccess: async () => {
    console.log('[MOCK] Revoking Google access');
  },
  signOut: async () => {
    console.log('[MOCK] Google Sign-Out');
  },
  isSignedIn: async () => {
    console.log('[MOCK] Checking if signed in with Google');
    return false;
  },
  getCurrentUser: async () => {
    console.log('[MOCK] Getting current Google user');
    return null;
  }
};

// Export mock Firebase for global use
export default mockFirebase;
