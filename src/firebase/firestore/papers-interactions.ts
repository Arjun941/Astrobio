import { 
  doc, 
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface StarredPaper {
  id: string;
  userId: string;
  paperId: string;
  paperTitle: string;
  paperLink: string;
  starredAt: any;
}

export interface PaperComment {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  paperId: string;
  comment: string;
  createdAt: any;
  updatedAt: any;
}

// Star/Unstar functionality
export async function starPaper(
  userId: string, 
  paperId: string, 
  paperTitle: string, 
  paperLink: string
): Promise<void> {
  console.log('🌟 Attempting to star paper:', { userId, paperId, paperTitle });
  
  try {
    // Check if already starred
    const starQuery = query(
      collection(db, 'starred_papers'),
      where('userId', '==', userId),
      where('paperId', '==', paperId)
    );
    
    console.log('🔍 Checking if already starred...');
    const existingStars = await getDocs(starQuery);
    
    if (existingStars.empty) {
      console.log('✨ Creating new star document...');
      // Add to starred papers
      const docData = {
        userId,
        paperId,
        paperTitle,
        paperLink,
        starredAt: serverTimestamp()
      };
      console.log('📝 Document data:', docData);
      
      await addDoc(collection(db, 'starred_papers'), docData);
      
      console.log('✅ Paper starred successfully');
    } else {
      console.log('⚠️ Paper already starred');
    }
  } catch (error) {
    console.error('❌ Error starring paper:', error);
    throw error;
  }
}

export async function unstarPaper(userId: string, paperId: string): Promise<void> {
  console.log('🗑️ Attempting to unstar paper:', { userId, paperId });
  
  try {
    const starQuery = query(
      collection(db, 'starred_papers'),
      where('userId', '==', userId),
      where('paperId', '==', paperId)
    );
    
    console.log('🔍 Finding starred document to remove...');
    const stars = await getDocs(starQuery);
    
    if (!stars.empty) {
      console.log('🗑️ Removing star document(s)...');
      const batch = writeBatch(db);
      stars.docs.forEach((starDoc) => {
        batch.delete(starDoc.ref);
      });
      await batch.commit();
      
      console.log('✅ Paper unstarred successfully');
    } else {
      console.log('⚠️ No starred document found to remove');
    }
  } catch (error) {
    console.error('❌ Error unstarring paper:', error);
    throw error;
  }
}

export async function isStarred(userId: string, paperId: string): Promise<boolean> {
  try {
    const starQuery = query(
      collection(db, 'starred_papers'),
      where('userId', '==', userId),
      where('paperId', '==', paperId)
    );
    
    const stars = await getDocs(starQuery);
    return !stars.empty;
  } catch (error) {
    console.error('Error checking if paper is starred:', error);
    return false;
  }
}

export async function getUserStarredPapers(userId: string): Promise<StarredPaper[]> {
  try {
    const starQuery = query(
      collection(db, 'starred_papers'),
      where('userId', '==', userId),
      orderBy('starredAt', 'desc')
    );
    
    const stars = await getDocs(starQuery);
    return stars.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as StarredPaper));
  } catch (error) {
    console.error('Error fetching starred papers:', error);
    return [];
  }
}

// Comment functionality
export async function addComment(
  userId: string,
  userEmail: string,
  userName: string,
  paperId: string,
  comment: string
): Promise<void> {
  try {
    await addDoc(collection(db, 'paper_comments'), {
      userId,
      userEmail,
      userName,
      paperId,
      comment,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('Comment added successfully');
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}

export async function updateComment(commentId: string, newComment: string): Promise<void> {
  try {
    const commentRef = doc(db, 'paper_comments', commentId);
    await updateDoc(commentRef, {
      comment: newComment,
      updatedAt: serverTimestamp()
    });
    
    console.log('Comment updated successfully');
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
}

export async function deleteComment(commentId: string): Promise<void> {
  try {
    const commentRef = doc(db, 'paper_comments', commentId);
    await deleteDoc(commentRef);
    
    console.log('Comment deleted successfully');
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}

export async function getPaperComments(paperId: string): Promise<PaperComment[]> {
  try {
    const commentsQuery = query(
      collection(db, 'paper_comments'),
      where('paperId', '==', paperId),
      orderBy('createdAt', 'desc')
    );
    
    const comments = await getDocs(commentsQuery);
    return comments.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as PaperComment));
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export async function getCommentCount(paperId: string): Promise<number> {
  try {
    const commentsQuery = query(
      collection(db, 'paper_comments'),
      where('paperId', '==', paperId)
    );
    
    const comments = await getDocs(commentsQuery);
    return comments.size;
  } catch (error) {
    console.error('Error getting comment count:', error);
    return 0;
  }
}

export async function getStarCount(paperId: string): Promise<number> {
  try {
    const starQuery = query(
      collection(db, 'starred_papers'),
      where('paperId', '==', paperId)
    );
    
    const stars = await getDocs(starQuery);
    return stars.size;
  } catch (error) {
    console.error('Error getting star count:', error);
    return 0;
  }
}