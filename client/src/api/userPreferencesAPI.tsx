// src/api/userPreferencesAPI.ts
import Auth from '../utils/auth';

interface UserPreferences {
  dietaryRestrictions: string[];
  favoritesCuisines: string[];
  cookingSkillLevel: string;
}

const getUserPreferences = async () => {
  const token = Auth.getToken();
  const userId = Auth.getUserId();
  
  console.log('Fetching preferences for userId:', userId);
  
  try {
    const response = await fetch('/api/profile/preferences', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Preferences response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(errorData.error || 'Failed to fetch preferences');
    }

    const data = await response.json();
    console.log('Received preferences:', data);
    return data;
  } catch (error) {
    console.error('Error in getUserPreferences:', error);
    throw error;
  }
};

const updateUserPreferences = async (preferences: UserPreferences) => {
  const token = Auth.getToken();
  const userId = Auth.getUserId();
  
  console.log('Updating preferences for userId:', userId);
  console.log('New preferences:', preferences);
  
  try {
    const response = await fetch('/api/profile/preferences', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...preferences,
        userId
      })
    });

    console.log('Update response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(errorData.error || 'Failed to update preferences');
    }

    const data = await response.json();
    console.log('Updated preferences:', data);
    return data;
  } catch (error) {
    console.error('Error in updateUserPreferences:', error);
    throw error;
  }
};

export { getUserPreferences, updateUserPreferences, type UserPreferences };