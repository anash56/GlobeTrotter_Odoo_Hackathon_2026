import {
  getCommunityPostsService,
  createCommunityPostService,
  deleteCommunityPostService,
  toggleCommunityPostLikeService,
  addPostCommentService,
  getPostCommentsService,
} from '../services/communityService.js';

/**
 * @desc    Get community feed posts (with optional search, filter, sort)
 * @route   GET /api/community/posts
 * @access  Public / Optional Auth
 */
export const getCommunityPosts = async (req, res) => {
  try {
    const { search, filter, sort, page, limit } = req.query;
    const currentUserId = req.user ? req.user.id : null;

    const posts = await getCommunityPostsService({
      currentUserId,
      search,
      filter,
      sort,
      page,
      limit,
    });

    return res.status(200).json(posts);
  } catch (error) {
    console.error('Get community posts error:', error);
    return res.status(500).json({ error: 'Failed to fetch community posts.' });
  }
};

/**
 * @desc    Create a community post
 * @route   POST /api/community/posts
 * @access  Private (Authenticated User)
 */
export const createCommunityPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, content, destination, category, imageUrl } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Post title is required.' });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Post content cannot be empty.' });
    }

    const post = await createCommunityPostService({
      userId,
      title,
      content,
      destination,
      category,
      imageUrl,
    });

    return res.status(201).json({
      message: 'Post published successfully!',
      post,
    });
  } catch (error) {
    console.error('Create post error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create community post.' });
  }
};

/**
 * @desc    Delete a community post
 * @route   DELETE /api/community/posts/:id
 * @access  Private (Author Only)
 */
export const deleteCommunityPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await deleteCommunityPostService(id, userId);

    return res.status(200).json({ message: 'Post deleted successfully.' });
  } catch (error) {
    console.error('Delete post error:', error);
    if (error.message === 'Unauthorized to delete this post') {
      return res.status(403).json({ error: error.message });
    }
    if (error.message === 'Post not found') {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Failed to delete post.' });
  }
};

/**
 * @desc    Toggle like status for a post
 * @route   POST /api/community/posts/:id/like
 * @access  Private (Authenticated User)
 */
export const toggleLikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await toggleCommunityPostLikeService(id, userId);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Toggle like error:', error);
    if (error.message === 'Post not found') {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Failed to update like status.' });
  }
};

/**
 * @desc    Get comments for a community post
 * @route   GET /api/community/posts/:id/comments
 * @access  Public
 */
export const getPostComments = async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await getPostCommentsService(id);
    return res.status(200).json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    return res.status(500).json({ error: 'Failed to fetch comments.' });
  }
};

/**
 * @desc    Add comment to a community post
 * @route   POST /api/community/posts/:id/comments
 * @access  Private (Authenticated User)
 */
export const addPostComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content cannot be empty.' });
    }

    const comment = await addPostCommentService({
      postId: id,
      userId,
      content,
    });

    return res.status(201).json({
      message: 'Comment added successfully!',
      comment,
    });
  } catch (error) {
    console.error('Add comment error:', error);
    if (error.message === 'Post not found') {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Failed to add comment.' });
  }
};
