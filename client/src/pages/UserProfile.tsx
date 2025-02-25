import React, { useState, useEffect } from 'react';
import UserSavedRecipes from '../components/UserSavedRecipes';
import '../styles/userprofile.css';
import Auth from '../utils/auth';
import { getUserPreferences, updateUserPreferences, type UserPreferences } from '../api/userPreferencesAPI';
import { getUserProfile, updateUserProfile } from '../api/userProfileAPI';

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  preferences: UserPreferences;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  dietaryRestrictions: [],
  favoritesCuisines: [],
  cookingSkillLevel: 'intermediate'
};

const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner Chef' },
  { value: 'intermediate', label: 'Home Cook' },
  { value: 'advanced', label: 'Professional Chef' }
];

const DIETARY_RESTRICTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'
];

const UserProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    bio: '',
    preferences: DEFAULT_PREFERENCES
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        if (Auth.loggedIn()) {
          const [userProfile, userPreferences] = await Promise.all([
            getUserProfile(), 
            getUserPreferences()
          ]);

          setProfile({
            name: userProfile.name || '',
            email: userProfile.email || '',
            bio: userProfile.bio || '',
            preferences: userPreferences
          });
        }
      } catch (error) {
        console.error('Failed to fetch preferences:', error);
        setErrorMessage('Failed to load preferences');
      }
    };

    fetchPreferences();
  }, []);

  const handleSaveProfile = async () => {
    try {
      if (Auth.loggedIn()) {
        // Save both profile info and preferences
        await Promise.all([
          updateUserProfile({
            name: profile.name,
            email: profile.email,
            bio: profile.bio,
          }),
          updateUserPreferences(profile.preferences)
        ]);
  
        setIsEditing(false);
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      setErrorMessage('Failed to save profile');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handlePreferenceChange = async (
    category: keyof UserPreferences,
    value: string | string[]
  ) => {
    const newPreferences = {
      ...profile.preferences,
      [category]: value
    };
    
    setProfile(prev => ({
      ...prev,
      preferences: newPreferences
    }));
  
    // Auto-save preferences when they change
    try {
      await updateUserPreferences(newPreferences);
      setSuccessMessage('Preferences updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      setErrorMessage('Failed to save preferences');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="profile-avatar-icon" style={{ width: 40, height: 40, backgroundColor: "#4A5568" }} />
        </div>
        <h1 className="profile-title">Your Culinary Profile</h1>
        <p className="profile-subtitle">Customize your cooking preferences and saved recipes</p>
      </div>

      {(successMessage || errorMessage) && (
        <div className={successMessage ? 'success-message' : 'error-message'}>
          {successMessage || errorMessage}
        </div>
      )}

      <div className="profile-grid">
        <div className="profile-left">
          <div className="profile-section">
            <div className="section-header">
              <h2 className="section-title">Profile Details</h2>
              <button
                className="profile-button secondary"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <span>Save</span>
                ) : (
                  <span>Edit</span>
                )}
              </button>
            </div>
            <div className="section-content">
              {isEditing ? (
                <div>
                  <div className="profile-form-group">
                    <label className="profile-label">Name</label>
                    <input
                      type="text"
                      className="profile-input"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="profile-form-group">
                    <label className="profile-label">Email</label>
                    <input
                      type="email"
                      className="profile-input"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="profile-form-group">
                    <label className="profile-label">Bio</label>
                    <textarea
                      className="profile-input profile-textarea"
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    />
                  </div>
                  <button
                    className="profile-button"
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div>
                  <div className="profile-form-group">
                    <label className="profile-label">Name</label>
                    <p className="profile-value">{profile.name || 'Click edit to set your name'}</p>
                  </div>
                  <div className="profile-form-group">
                    <label className="profile-label">Email</label>
                    <p className="profile-value">{profile.email || 'Click edit to set your email'}</p>
                  </div>
                  <div className="profile-form-group">
                    <label className="profile-label">Bio</label>
                    <p className="profile-value">{profile.bio || 'Tell us about your cooking journey...'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="profile-section">
            <div className="section-header">
              <h2 className="section-title">Cooking Preferences</h2>
            </div>
            <div className="section-content">
              <div className="profile-form-group">
                <label className="profile-label">Cooking Skill Level</label>
                <select
                  className="skill-select"
                  value={profile.preferences.cookingSkillLevel}
                  onChange={(e) => handlePreferenceChange('cookingSkillLevel', e.target.value)}
                >
                  {SKILL_LEVELS.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="profile-form-group">
                <label className="profile-label">Dietary Restrictions</label>
                <div className="preferences-list">
                  {DIETARY_RESTRICTIONS.map((restriction) => (
                    <label key={restriction} className="preference-item">
                      <input
                        type="checkbox"
                        className="preference-checkbox"
                        checked={profile.preferences.dietaryRestrictions.includes(restriction)}
                        onChange={(e) => {
                          const newRestrictions = e.target.checked
                            ? [...profile.preferences.dietaryRestrictions, restriction]
                            : profile.preferences.dietaryRestrictions.filter(r => r !== restriction);
                          handlePreferenceChange('dietaryRestrictions', newRestrictions);
                        }}
                      />
                      <span className="preference-label">{restriction}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <div className="section-header">
            <h2 className="section-title">My Saved Recipes</h2>
          </div>
          <div className="section-content">
            {Auth.loggedIn() ? (
              <UserSavedRecipes />
            ) : (
              <p>Please log in to see your saved recipes</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
