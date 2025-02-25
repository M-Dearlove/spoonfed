import { UserPreference } from '../models/UserPreference.js';

export const seedProfiles = async () => {
  await UserPreference.bulkCreate([
    { userId: 1, dietaryRestrictions: ['vegetarian'], favoritesCuisines: ['Italian', 'Mexican'], cookingSkillLevel: 'intermediate' },
    { userId: 2, dietaryRestrictions: ['vegan'], favoritesCuisines: ['Asian', 'Mediterranean'], cookingSkillLevel: 'beginner' },
    { userId: 3, dietaryRestrictions: ['gluten-free'], favoritesCuisines: ['American', 'Indian'], cookingSkillLevel: 'advanced' }
  ], { individualHooks: true });
};