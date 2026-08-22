import {
  getUserProfileDataService,
  updateUserProfileDataService,
} from '../services/userService.js';

/**
 * @desc    Get current authenticated user profile & trip statistics
 * @route   GET /api/users/me
 * @access  Private (Authenticated User)
 */
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = await getUserProfileDataService(userId);
    return res.status(200).json(profileData);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Failed to fetch user profile.' });
  }
};

/**
 * @desc    Update current authenticated user profile (name, avatarUrl)
 * @route   PATCH /api/users/me
 * @access  Private (Authenticated User)
 */
export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedUser = await updateUserProfileDataService(userId, req.body);
    return res.status(200).json({
      message: 'Profile updated successfully!',
      user: updatedUser,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.message || 'Failed to update profile.' });
  }
};
