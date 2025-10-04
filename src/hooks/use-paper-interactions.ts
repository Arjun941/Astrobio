"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import {
  starPaper,
  unstarPaper,
  isStarred,
  getUserStarredPapers,
  addComment,
  updateComment,
  deleteComment,
  getPaperComments,
  getCommentCount,
  getStarCount,
  type StarredPaper,
  type PaperComment
} from '@/firebase/firestore/papers-interactions';

export function useStarredPaper(paperId: string) {
  const [starred, setStarred] = useState(false);
  const [starCount, setStarCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.uid) {
      checkStarredStatus();
      loadStarCount();
    }
  }, [user?.uid, paperId]);

  const checkStarredStatus = async () => {
    if (!user?.uid) return;
    
    try {
      const starredStatus = await isStarred(user.uid, paperId);
      setStarred(starredStatus);
    } catch (error) {
      console.error('Error checking starred status:', error);
    }
  };

  const loadStarCount = async () => {
    try {
      const count = await getStarCount(paperId);
      setStarCount(count);
    } catch (error) {
      console.error('Error loading star count:', error);
    }
  };

  const toggleStar = async (paperTitle: string, paperLink: string) => {
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      if (starred) {
        await unstarPaper(user.uid, paperId);
        setStarred(false);
        setStarCount(prev => Math.max(0, prev - 1));
      } else {
        await starPaper(user.uid, paperId, paperTitle, paperLink);
        setStarred(true);
        setStarCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling star:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    starred,
    starCount,
    loading,
    toggleStar,
    refetch: () => {
      checkStarredStatus();
      loadStarCount();
    }
  };
}

export function useStarredPapers() {
  const [starredPapers, setStarredPapers] = useState<StarredPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.uid) {
      loadStarredPapers();
    } else {
      setStarredPapers([]);
      setLoading(false);
    }
  }, [user?.uid]);

  const loadStarredPapers = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      const papers = await getUserStarredPapers(user.uid);
      setStarredPapers(papers);
    } catch (error) {
      console.error('Error loading starred papers:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    starredPapers,
    loading,
    refetch: loadStarredPapers
  };
}

export function usePaperComments(paperId: string) {
  const [comments, setComments] = useState<PaperComment[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadComments();
    loadCommentCount();
  }, [paperId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const paperComments = await getPaperComments(paperId);
      setComments(paperComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCommentCount = async () => {
    try {
      const count = await getCommentCount(paperId);
      setCommentCount(count);
    } catch (error) {
      console.error('Error loading comment count:', error);
    }
  };

  const addNewComment = async (commentText: string) => {
    if (!user?.uid || !user?.email) return;
    
    setSubmitting(true);
    try {
      const userName = user.displayName || user.email || 'Anonymous';
      await addComment(user.uid, user.email, userName, paperId, commentText);
      await loadComments();
      await loadCommentCount();
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const editComment = async (commentId: string, newCommentText: string) => {
    setSubmitting(true);
    try {
      await updateComment(commentId, newCommentText);
      await loadComments();
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const removeComment = async (commentId: string) => {
    setSubmitting(true);
    try {
      await deleteComment(commentId);
      await loadComments();
      await loadCommentCount();
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    comments,
    commentCount,
    loading,
    submitting,
    addComment: addNewComment,
    updateComment: editComment,
    deleteComment: removeComment,
    refetch: () => {
      loadComments();
      loadCommentCount();
    }
  };
}