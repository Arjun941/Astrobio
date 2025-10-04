"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, BookOpen, Calendar, Users } from "lucide-react";
import { StarButton, CommentButton } from "@/components/paper-interactions";

interface PaperCardProps {
  paper: {
    id: string;
    title: string;
    authors: string;
    abstract: string;
    url: string;
    publication_date?: string;
    keywords?: string;
    journal?: string;
  };
  index: number;
}

export function CleanPaperCard({ paper, index }: PaperCardProps) {
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30
    },
    visible: { 
      opacity: 1, 
      y: 0
    }
  };

  // Format publication date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      });
    } catch {
      return dateString;
    }
  };

  // Extract keywords for badges
  const keywords = paper.keywords 
    ? paper.keywords.split(',').slice(0, 2).map(k => k.trim())
    : [];

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
        <CardHeader className="flex-none pb-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-md bg-accent/10">
                <BookOpen className="w-4 h-4 text-accent" />
              </div>
              {paper.journal && (
                <Badge variant="secondary" className="text-xs">
                  {paper.journal}
                </Badge>
              )}
            </div>
          </div>

          <CardTitle className="text-lg leading-tight line-clamp-2 hover:text-accent transition-colors">
            {paper.title}
          </CardTitle>

          <div className="flex items-center text-sm text-muted-foreground space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span className="line-clamp-1">{paper.authors}</span>
            </div>
            {paper.publication_date && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(paper.publication_date)}</span>
              </div>
            )}
          </div>

          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {keywords.map((keyword) => (
                <Badge 
                  key={keyword}
                  variant="outline" 
                  className="text-xs bg-accent/5 border-accent/20 hover:bg-accent/10 transition-colors"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-3">
          {/* Paper interactions */}
          <div className="flex items-center justify-between pt-2 border-t border-muted/20">
            <div className="flex items-center gap-3">
              <StarButton 
                paperId={paper.id}
                paperTitle={paper.title}
                paperLink={paper.url}
                size="sm"
              />
              <CommentButton 
                paperId={paper.id}
                paperTitle={paper.title}
                size="sm"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 mt-auto">
            <Button asChild className="flex-1 bg-accent hover:bg-accent/90" size="sm">
              <Link href={`/papers/${paper.id}`}>
                Explore
              </Link>
            </Button>

            <Button 
              variant="outline" 
              size="sm"
              asChild
              className="hover:bg-accent/10 hover:border-accent/30"
            >
              <a 
                href={paper.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-1"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}