import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { CommunityHeader } from '../components/community/CommunityHeader';
import { CommunityToolbar } from '../components/community/CommunityToolbar';
import { CommunityPostCard } from '../components/community/CommunityPostCard';
import { CommunitySidebar } from '../components/community/CommunitySidebar';
import { CreatePostModal } from '../components/community/CreatePostModal';
import { EmptyCommunityState } from '../components/community/EmptyCommunityState';
import { PostSkeleton } from '../components/community/PostSkeleton';
import { ToastContainer } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { communityService } from '../services/communityService';
import { MapPin, Tag, RefreshCw, AlertTriangle } from 'lucide-react';

export function CommunityPage() {
  const { currentUser, logoutUser } = useAuth();
  const navigate = useNavigate();

  // Feed & Filter State
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [groupBy, setGroupBy] = useState('all');
  const [filterOption, setFilterOption] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Modal & Toast State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Debounce search query changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Toast Helper
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch Community Posts from API
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await communityService.getPosts({
        search: debouncedSearch,
        filter: filterOption,
        sort: sortBy,
      });
      setPosts(data || []);
    } catch (err) {
      console.error('Failed to load community feed:', err);
      setError('Unable to load community posts from server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, filterOption, sortBy]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Reset Filters Handler
  const handleResetFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setGroupBy('all');
    setFilterOption('all');
    setSortBy('newest');
  };

  // Open Create Modal Handler (Auth Check)
  const handleOpenCreateModal = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setIsCreateModalOpen(true);
  };

  // Delete Post Handler
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await communityService.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      showToast('Post deleted successfully.', 'success');
    } catch (err) {
      console.error('Failed to delete post:', err);
      showToast(err.message || 'Failed to delete post.', 'error');
    }
  };

  // Prepend newly created post
  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // Render Grouped Feed if groupBy is destination or category
  const renderFeedContent = () => {
    if (isLoading) {
      return (
        <div className="posts-feed-list">
          {[1, 2, 3].map((idx) => (
            <PostSkeleton key={idx} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="community-error-card">
          <AlertTriangle size={36} color="#EF4444" />
          <h3>Could not load feed</h3>
          <p>{error}</p>
          <button type="button" className="btn-retry-feed" onClick={fetchPosts}>
            <RefreshCw size={15} /> Retry
          </button>
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <EmptyCommunityState
          isSearchResult={Boolean(debouncedSearch || filterOption !== 'all')}
          onReset={handleResetFilters}
          onOpenCreateModal={handleOpenCreateModal}
        />
      );
    }

    // Grouping Logic
    if (groupBy === 'destination') {
      const groups = {};
      posts.forEach((post) => {
        const dest = post.destination || 'General Travel';
        if (!groups[dest]) groups[dest] = [];
        groups[dest].push(post);
      });

      return (
        <div className="grouped-feed-container">
          {Object.entries(groups).map(([destName, groupPosts]) => (
            <section key={destName} className="feed-group-section">
              <div className="group-section-header">
                <MapPin size={18} color="#6587D2" />
                <h3>{destName}</h3>
                <span className="group-count-pill">{groupPosts.length} {groupPosts.length === 1 ? 'post' : 'posts'}</span>
              </div>
              <div className="group-posts-list">
                {groupPosts.map((post) => (
                  <CommunityPostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    onOpenAuth={() => navigate('/login')}
                    onDeletePost={handleDeletePost}
                    onShowToast={showToast}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      );
    }

    if (groupBy === 'category') {
      const groups = {};
      posts.forEach((post) => {
        const cat = post.category || 'Trip Story';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(post);
      });

      return (
        <div className="grouped-feed-container">
          {Object.entries(groups).map(([catName, groupPosts]) => (
            <section key={catName} className="feed-group-section">
              <div className="group-section-header">
                <Tag size={18} color="#6587D2" />
                <h3>{catName}</h3>
                <span className="group-count-pill">{groupPosts.length} {groupPosts.length === 1 ? 'post' : 'posts'}</span>
              </div>
              <div className="group-posts-list">
                {groupPosts.map((post) => (
                  <CommunityPostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    onOpenAuth={() => navigate('/login')}
                    onDeletePost={handleDeletePost}
                    onShowToast={showToast}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      );
    }

    // Default Flat Feed
    return (
      <div className="posts-feed-list">
        {posts.map((post) => (
          <CommunityPostCard
            key={post.id}
            post={post}
            currentUser={currentUser}
            onOpenAuth={() => navigate('/login')}
            onDeletePost={handleDeletePost}
            onShowToast={showToast}
          />
        ))}
      </div>
    );
  };

  const hasActiveFilters = Boolean(
    searchQuery || filterOption !== 'all' || groupBy !== 'all' || sortBy !== 'newest'
  );

  return (
    <div className="community-page">
      {/* 1. Global Navigation Bar */}
      <LandingNavbar
        currentUser={currentUser}
        onOpenAuth={() => navigate('/login')}
        onLogout={logoutUser}
        onPlanTrip={() => navigate(currentUser ? '/trips/create' : '/login')}
        activePage="community"
      />

      {/* 2. Main Page Content Container */}
      <main className="community-main-layout">
        {/* Banner Header */}
        <CommunityHeader
          onOpenCreateModal={handleOpenCreateModal}
          currentUser={currentUser}
        />

        {/* Toolbar Controls */}
        <CommunityToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          groupBy={groupBy}
          setGroupBy={setGroupBy}
          filterOption={filterOption}
          setFilterOption={setFilterOption}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          currentUser={currentUser}
        />

        {/* Responsive Feed & Sidebar Layout Grid */}
        <div className="community-content-grid">
          {/* Feed Column */}
          <div className="community-feed-column">
            <div className="feed-results-header">
              <h2>
                {isLoading
                  ? 'Loading community feed...'
                  : `${posts.length} ${posts.length === 1 ? 'Post' : 'Posts'}`}
              </h2>
              {debouncedSearch && <p>Showing results for "{debouncedSearch}"</p>}
            </div>

            {renderFeedContent()}
          </div>

          {/* Sidebar Column */}
          <div className="community-sidebar-column">
            <CommunitySidebar
              onOpenCreateModal={handleOpenCreateModal}
              currentUser={currentUser}
            />
          </div>
        </div>
      </main>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
        onShowToast={showToast}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
