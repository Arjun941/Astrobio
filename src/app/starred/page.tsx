"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Search, Filter, SortDesc, Heart, BookOpen, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import LoadingSpinner from '@/components/loading-spinner';
import { StarButton, CommentButton } from '@/components/paper-interactions';
import { useStarredPapers } from '@/hooks/use-paper-interactions';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type SortOption = 'recent' | 'alphabetical';

export default function StarredPage() {
  const { starredPapers, loading, refetch } = useStarredPapers();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [filteredPapers, setFilteredPapers] = useState(starredPapers);

  useEffect(() => {
    let filtered = [...starredPapers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(paper =>
        paper.paperTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => {
          const dateA = a.starredAt?.toDate?.() || new Date(0);
          const dateB = b.starredAt?.toDate?.() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.paperTitle.localeCompare(b.paperTitle));
        break;
    }

    setFilteredPapers(filtered);
  }, [starredPapers, searchTerm, sortBy]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Star className="w-16 h-16 mx-auto text-muted-foreground" />
            <h1 className="text-3xl font-bold">Sign In Required</h1>
            <p className="text-muted-foreground">
              Please sign in to view your starred papers and build your personal research collection.
            </p>
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <Star className="w-8 h-8 text-yellow-500 fill-current" />
          <h1 className="text-3xl font-bold">Starred Papers</h1>
        </div>
        <p className="text-muted-foreground">
          Your personal collection of interesting research papers
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search starred papers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Starred</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Stats */}
      {starredPapers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex flex-wrap gap-4">
            <Badge variant="secondary" className="text-sm">
              <Heart className="w-4 h-4 mr-1" />
              {starredPapers.length} starred papers
            </Badge>
            {searchTerm && (
              <Badge variant="outline" className="text-sm">
                <Search className="w-4 h-4 mr-1" />
                {filteredPapers.length} matching results
              </Badge>
            )}
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {/* Empty State */}
      {!loading && starredPapers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="max-w-md mx-auto space-y-4">
            <div className="relative">
              <Star className="w-20 h-20 mx-auto text-muted-foreground opacity-20" />
              <BookOpen className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No starred papers yet</h3>
            <p className="text-muted-foreground">
              Start building your research collection by starring papers that interest you.
            </p>
            <Button asChild>
              <Link href="/papers">Browse Papers</Link>
            </Button>
          </div>
        </motion.div>
      )}

      {/* No Search Results */}
      {!loading && starredPapers.length > 0 && filteredPapers.length === 0 && searchTerm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <Search className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-4" />
          <h3 className="text-lg font-medium mb-2">No results found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or browse all starred papers.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </Button>
        </motion.div>
      )}

      {/* Papers Grid */}
      {!loading && filteredPapers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filteredPapers.map((paper, index) => (
                <motion.div
                  key={paper.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    delay: index * 0.1,
                    layout: { duration: 0.3 }
                  }}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <Card className="h-full border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-background/50 backdrop-blur-sm relative overflow-hidden">
                    {/* Starred indicator */}
                    <div className="absolute top-4 right-4 z-10">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    </div>
                    
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-accent transition-colors pr-8">
                        {paper.paperTitle}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Starred on {paper.starredAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <StarButton 
                            paperId={paper.paperId} 
                            paperTitle={paper.paperTitle}
                            paperLink={paper.paperLink}
                            size="sm"
                          />
                          <CommentButton 
                            paperId={paper.paperId}
                            paperTitle={paper.paperTitle}
                            size="sm"
                          />
                        </div>
                        
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-accent"
                        >
                          <Link 
                            href={paper.paperLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                      
                      {/* Paper ID for reference */}
                      <div className="text-xs text-muted-foreground font-mono">
                        ID: {paper.paperId}
                      </div>
                    </CardContent>
                    
                    {/* Hover effect overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      initial={false}
                    />
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
}