// routes/api/user-profile-routes.ts
import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.js';
import { UserPreference } from '../../models/UserPreference.js';
import { User } from '../../models/user.js';

const router = Router();

// GET /preferences
router.get('/preferences', authenticateToken, async (req, res) => {
  const userId = req.body.userId;
  console.log('GET /preferences - Received request for userId:', userId);
  
  try {
    console.log('Attempting to find user preferences...');
    const preference = await UserPreference.findOne({
      where: { userId },
      include: [{
        model: User,
        attributes: ['username']
      }]
    });

    console.log('Database query result:', preference);

    if (!preference) {
      console.log('No preferences found, returning defaults for userId:', userId);
      return res.json({
        userId,
        dietaryRestrictions: [],
        favoritesCuisines: [],
        cookingSkillLevel: 'intermediate'
      });
    }

    console.log('Found preferences:', preference.toJSON());
    return res.json(preference);
  } catch (error) {
    console.error('Error in GET /preferences:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch preferences',
      details: (error instanceof Error) ? error.message : 'Unknown error'
    });
  }
});

// PUT /preferences
router.put('/preferences', authenticateToken, async (req, res) => {
  const userId = req.body.userId;
  console.log('PUT /preferences - Received update for userId:', userId);
  console.log('Update data:', req.body);

  try {
    const [preference, created] = await UserPreference.findOrCreate({
      where: { userId },
      defaults: {
        userId,
        dietaryRestrictions: req.body.dietaryRestrictions || [],
        favoritesCuisines: req.body.favoritesCuisines || [],
        cookingSkillLevel: req.body.cookingSkillLevel || 'intermediate'
      }
    });

    console.log('Preference was created:', created);
    
    if (!created) {
      console.log('Updating existing preferences');
      await preference.update({
        dietaryRestrictions: req.body.dietaryRestrictions,
        favoritesCuisines: req.body.favoritesCuisines,
        cookingSkillLevel: req.body.cookingSkillLevel
      });
      console.log('Update complete');
    }

    const updatedPreference = await UserPreference.findOne({
      where: { userId },
      include: [{
        model: User,
        attributes: ['username']
      }]
    });

    console.log('Final preference state:', updatedPreference?.toJSON());
    return res.json(updatedPreference);
  } catch (error) {
    console.error('Error in PUT /preferences:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.stack);
    } else {
      console.error('Error details:', error);
    }
    return res.status(500).json({ 
      error: 'Failed to update preferences',
      details: (error instanceof Error) ? error.message : 'Unknown error'
    });
  }
});

router.put('/user', authenticateToken, async (req, res) => {
  const userId = req.body.userId;
  console.log('PUT /user - Received update for userId:', userId);
  console.log('Update data:', req.body);

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user profile information
    await user.update({
      name: req.body.name,
      email: req.body.email,
      bio: req.body.bio
    });

    return res.json({
      id: user.id,
      name: user.name || null,
      email: user.email || null,
      bio: user.bio || null,
      username: user.username
    });
  } catch (error) {
    console.error('Error in PUT /user:', error);
    return res.status(500).json({ 
      error: 'Failed to update profile',
      details: (error instanceof Error) ? error.message : 'Unknown error'
    });
  }
});

export { router as userProfileRouter };