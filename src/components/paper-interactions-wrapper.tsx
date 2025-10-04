"use client";

import { StarButton, CommentButton, CommentSection } from "@/components/paper-interactions";

interface PaperInteractionsProps {
  paperId: string;
  paperTitle: string;
  paperLink: string;
}

export function PaperInteractions({ paperId, paperTitle, paperLink }: PaperInteractionsProps) {
  return (
    <div className="flex items-center gap-4">
      <StarButton 
        paperId={paperId}
        paperTitle={paperTitle}
        paperLink={paperLink}
        size="md"
      />
      <CommentButton 
        paperId={paperId}
        paperTitle={paperTitle}
        size="md"
      />
    </div>
  );
}

interface PaperCommentsProps {
  paperId: string;
  paperTitle: string;
}

export function PaperComments({ paperId, paperTitle }: PaperCommentsProps) {
  return (
    <CommentSection 
      paperId={paperId} 
      paperTitle={paperTitle} 
    />
  );
}