import Auth from '../utils/auth';

interface UserProfileData {
  name: string;
  email: string;
  bio: string;
}

const getUserProfile = async () => {
  const token = Auth.getToken();
  const userId = Auth.getUserId();
  
  try {
    const response = await fetch(`/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
};

const updateUserProfile = async (profileData: UserProfileData) => {
  const token = Auth.getToken();
  const userId = Auth.getUserId();
  
  console.log('Updating profile for userId:', userId);
  console.log('New profile data:', profileData);
  
  try {
    const response = await fetch('/api/profile/user', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...profileData,
        userId
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update profile');
    }

    const data = await response.json();
    console.log('Updated profile:', data);
    return data;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
};

export { getUserProfile, updateUserProfile, type UserProfileData };