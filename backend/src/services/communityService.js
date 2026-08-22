import prisma from '../config/prisma.js';

/**
 * Get community posts with search, filtering, sorting, and user like status
 */
export const getCommunityPostsService = async ({
  currentUserId,
  search,
  filter,
  sort = 'newest',
  page = 1,
  limit = 20,
}) => {
  const where = {};

  // Search filter
  if (search && search.trim()) {
    const q = search.trim();
    where.OR = [
      { title: { contains: q } },
      { content: { contains: q } },
      { destination: { contains: q } },
      { user: { name: { contains: q } } },
    ];
  }

  // Filter options
  if (filter) {
    if (filter === 'my-posts' && currentUserId) {
      where.userId = currentUserId;
    } else if (filter !== 'all' && filter !== 'All' && filter !== 'my-posts') {
      where.OR = [
        { category: filter },
        { destination: { contains: filter } },
      ];
    }
  }

  // Sorting
  let orderBy = { createdAt: 'desc' };
  if (sort === 'oldest') {
    orderBy = { createdAt: 'asc' };
  }

  const posts = await prisma.communityPost.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          email: true,
        },
      },
      likes: {
        select: {
          userId: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy,
    take: Number(limit),
    skip: (Number(page) - 1) * Number(limit),
  });

  // Transform and augment posts with counts and isLiked indicator
  let formattedPosts = posts.map((post) => {
    const isLiked = currentUserId
      ? post.likes.some((like) => like.userId === currentUserId)
      : false;

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      destination: post.destination,
      category: post.category,
      imageUrl: post.imageUrl,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: post.user,
      likeCount: post.likes.length,
      commentCount: post.comments.length,
      isLiked,
      comments: post.comments.map((c) => ({
        id: c.id,
        content: c.content,
        createdAt: c.createdAt,
        user: c.user,
      })),
    };
  });

  // Popular sort in memory if requested
  if (sort === 'popular' || sort === 'most-popular') {
    formattedPosts.sort((a, b) => b.likeCount - a.likeCount);
  }

  return formattedPosts;
};

/**
 * Create a new community post
 */
export const createCommunityPostService = async ({
  userId,
  title,
  content,
  destination,
  category = 'Trip Story',
  imageUrl,
}) => {
  const newPost = await prisma.communityPost.create({
    data: {
      userId,
      title: title.trim(),
      content: content.trim(),
      destination: destination ? destination.trim() : null,
      category: category || 'Trip Story',
      imageUrl: imageUrl ? imageUrl.trim() : null,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          email: true,
        },
      },
      likes: true,
      comments: true,
    },
  });

  return {
    id: newPost.id,
    title: newPost.title,
    content: newPost.content,
    destination: newPost.destination,
    category: newPost.category,
    imageUrl: newPost.imageUrl,
    createdAt: newPost.createdAt,
    updatedAt: newPost.updatedAt,
    author: newPost.user,
    likeCount: 0,
    commentCount: 0,
    isLiked: false,
    comments: [],
  };
};

/**
 * Delete a post by ID (must belong to userId)
 */
export const deleteCommunityPostService = async (postId, userId) => {
  const post = await prisma.communityPost.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new Error('Post not found');
  }

  if (post.userId !== userId) {
    throw new Error('Unauthorized to delete this post');
  }

  await prisma.communityPost.delete({
    where: { id: postId },
  });

  return true;
};

/**
 * Toggle post like for user
 */
export const toggleCommunityPostLikeService = async (postId, userId) => {
  const post = await prisma.communityPost.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new Error('Post not found');
  }

  const existingLike = await prisma.communityPostLike.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

  let isLiked = false;

  if (existingLike) {
    await prisma.communityPostLike.delete({
      where: {
        id: existingLike.id,
      },
    });
    isLiked = false;
  } else {
    await prisma.communityPostLike.create({
      data: {
        postId,
        userId,
      },
    });
    isLiked = true;
  }

  const totalLikes = await prisma.communityPostLike.count({
    where: { postId },
  });

  return { isLiked, likeCount: totalLikes };
};

/**
 * Add comment to post
 */
export const addPostCommentService = async ({ postId, userId, content }) => {
  const post = await prisma.communityPost.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new Error('Post not found');
  }

  const comment = await prisma.communityComment.create({
    data: {
      postId,
      userId,
      content: content.trim(),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
  });

  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    user: comment.user,
  };
};

/**
 * Get comments for a post
 */
export const getPostCommentsService = async (postId) => {
  const comments = await prisma.communityComment.findMany({
    where: { postId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  return comments;
};
