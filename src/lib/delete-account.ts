import { auth } from '@/firebase/client';

export const deleteAccount = async () => {
  const user = auth.currentUser;

  if (user) {
    try {
      await user.delete();
      console.log('User account deleted.');
    } catch (error) {
      console.error('Error deleting user account:', error);
      throw error;
    }
  } else {
    console.log('No user is currently signed in.');
  }
};