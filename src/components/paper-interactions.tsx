"use client";

import { useState } from 'react';
import { Star, MessageCircle, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { useStarredPaper, usePaperComments } from '@/hooks/use-paper-interactions';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

interface StarButtonProps {
  paperId: string;
  paperTitle: string;
  paperLink: string;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StarButton({ 
  paperId, 
  paperTitle, 
  paperLink, 
  showCount = true, 
  size = 'md',
  className 
}: StarButtonProps) {
  const { starred, starCount, loading, toggleStar } = useStarredPaper(paperId);
  const { user } = useAuth();

  if (!user) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <Star className={cn(
          "text-muted-foreground",
          size === 'sm' && "w-3 h-3",
          size === 'md' && "w-4 h-4", 
          size === 'lg' && "w-5 h-5"
        )} />
        {showCount && <span className="text-xs text-muted-foreground">{starCount}</span>}
      </div>
    );
  }

  return (
    <motion.div 
      className={cn("flex items-center gap-1", className)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="ghost"
        size={size === 'sm' ? 'sm' : 'icon'}
        onClick={() => toggleStar(paperTitle, paperLink)}
        disabled={loading}
        className={cn(
          "p-1 transition-colors duration-200",
          starred ? "text-yellow-500 hover:text-yellow-600" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <motion.div
          animate={{ 
            rotate: starred ? [0, -10, 10, -5, 0] : 0,
            scale: starred ? [1, 1.2, 1] : 1
          }}
          transition={{ duration: 0.3 }}
        >
          <Star 
            className={cn(
              "transition-all duration-200",
              size === 'sm' && "w-3 h-3",
              size === 'md' && "w-4 h-4", 
              size === 'lg' && "w-5 h-5",
              starred && "fill-current"
            )} 
          />
        </motion.div>
      </Button>
      
      {showCount && (
        <motion.span 
          className="text-xs text-muted-foreground min-w-[1rem]"
          animate={{ scale: loading ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.2 }}
        >
          {starCount}
        </motion.span>
      )}
    </motion.div>
  );
}

interface CommentSectionProps {
  paperId: string;
  paperTitle: string;
}

export function CommentSection({ paperId, paperTitle }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const { 
    comments, 
    commentCount, 
    loading, 
    submitting, 
    addComment, 
    updateComment, 
    deleteComment 
  } = usePaperComments(paperId);
  const { user } = useAuth();

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;
    
    try {
      await addComment(newComment.trim());
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editText.trim()) return;
    
    try {
      await updateComment(commentId, editText.trim());
      setEditingId(null);
      setEditText('');
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const startEdit = (comment: any) => {
    setEditingId(comment.id);
    setEditText(comment.comment);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Sign in to view and add comments</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Comments ({commentCount})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new comment */}
        <div className="space-y-2">
          <Textarea
            placeholder="Share your thoughts about this paper..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="resize-none"
            rows={3}
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleAddComment}
              disabled={!newComment.trim() || submitting}
              size="sm"
            >
              {submitting ? 'Adding...' : 'Add Comment'}
            </Button>
          </div>
        </div>

        {/* Comments list */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No comments yet. Be the first to share your thoughts!
            </div>
          ) : (
            <AnimatePresence>
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {comment.userName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{comment.userName}</p>
                        <p className="text-xs text-muted-foreground">
                          {comment.createdAt?.toDate?.()?.toLocaleDateString() || 'Just now'}
                        </p>
                      </div>
                    </div>
                    
                    {comment.userId === user.uid && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => startEdit(comment)}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteComment(comment.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  
                  {editingId === comment.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="resize-none"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleEditComment(comment.id)}
                          disabled={submitting}
                        >
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{comment.comment}</p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface CommentButtonProps {
  paperId: string;
  paperTitle: string;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CommentButton({ 
  paperId, 
  paperTitle, 
  showCount = true, 
  size = 'md',
  className 
}: CommentButtonProps) {
  const { commentCount } = usePaperComments(paperId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div 
          className={cn("flex items-center gap-1 cursor-pointer", className)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size={size === 'sm' ? 'sm' : 'icon'}
            className="p-1 text-muted-foreground hover:text-foreground"
          >
            <MessageCircle 
              className={cn(
                size === 'sm' && "w-3 h-3",
                size === 'md' && "w-4 h-4", 
                size === 'lg' && "w-5 h-5"
              )} 
            />
          </Button>
          {showCount && (
            <span className="text-xs text-muted-foreground min-w-[1rem]">
              {commentCount}
            </span>
          )}
        </motion.div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-left">
            {paperTitle}
          </DialogTitle>
        </DialogHeader>
        <CommentSection paperId={paperId} paperTitle={paperTitle} />
      </DialogContent>
    </Dialog>
  );
}