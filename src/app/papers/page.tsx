"use client";

import { useEffect, useState, useMemo } from "react";
import { fetchPapersData, type Paper, searchPapers, formatAuthorsForPreview } from "@/lib/papers-data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, BookOpen, Calendar, Users, Search } from "lucide-react";
import { motion } from "framer-motion";
import { PapersSearch } from "@/components/papers-search";
import { StarButton, CommentButton } from "@/components/paper-interactions";

export default function PapersPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const papersPerPage = 12;

  useEffect(() => {
    const loadPapers = async () => {
      try {
        const data = await fetchPapersData();
        setPapers(data);
      } catch (error) {
        console.error('Failed to load papers:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPapers();
  }, []);

  // Filter papers based on search query and pagination
  const { paginatedPapers, totalPages, totalResults } = useMemo(() => {
    const filtered = searchQuery.trim() 
      ? searchPapers(papers, searchQuery)
      : papers;
    
    const totalResults = filtered.length;
    const totalPages = Math.ceil(totalResults / papersPerPage);
    const startIndex = (currentPage - 1) * papersPerPage;
    const paginatedPapers = filtered.slice(startIndex, startIndex + papersPerPage);
    
    return { paginatedPapers, totalPages, totalResults };
  }, [papers, searchQuery, currentPage, papersPerPage]);

  // Reset to page 1 when search query changes
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const extractAuthorsFromContent = (content: string): string => {
    const authorsMatch = content.match(/AUTHORS:\s*(.+?)(?:\n|$)/i);
    if (authorsMatch) {
      return authorsMatch[1].trim();
    }
    return "Authors not specified";
  };

  const formatAuthorsDisplay = (paper: Paper): { displayText: string; hasMore: boolean } => {
    // First try to use the authors field from the Google Sheets
    if (paper.authors && paper.authors.trim()) {
      const { displayAuthors, remainingCount } = formatAuthorsForPreview(paper.authors, 2);
      return {
        displayText: displayAuthors || "Authors not specified",
        hasMore: remainingCount > 0
      };
    }
    
    // Fallback to extracting from content if authors field is not available
    const fallbackAuthors = extractAuthorsFromContent(paper.content);
    return {
      displayText: fallbackAuthors,
      hasMore: false
    };
  };

  const extractPublicationYear = (content: string): string => {
    const yearMatch = content.match(/(\d{4})/);
    return yearMatch ? yearMatch[1] : 'Unknown';
  };

  const truncateContent = (content: string, maxLength = 200): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <motion.div 
        className="text-center space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Research Papers
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Discover cutting-edge research in space biology, microgravity effects, and astrobiology
          </p>
        </div>
        
        {/* Search Component */}
        <PapersSearch 
          onSearch={handleSearch}
          placeholder="Search through 600+ research papers..."
        />
        
        {/* Results Info */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Search className="h-4 w-4" />
          {searchQuery ? (
            <span>Found {totalResults} paper{totalResults !== 1 ? 's' : ''} for "{searchQuery}"</span>
          ) : (
            <span>Showing {paginatedPapers.length} of {papers.length} research papers (Page {currentPage} of {totalPages})</span>
          )}
        </div>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {paginatedPapers.map((paper, index) => {

          return (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 border-0 shadow-sm hover:border-accent/20 group">
              <CardHeader className="flex-none pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-md bg-accent/10">
                      <BookOpen className="w-4 h-4 text-accent" />
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Badge variant="secondary" className="text-xs bg-accent/10 text-accent hover:bg-accent/20 transition-colors">
                        Astrobiology Research
                      </Badge>
                    </motion.div>
                  </div>
                </div>

                <CardTitle className="text-lg leading-tight line-clamp-2 hover:text-accent transition-colors group-hover:text-accent">
                  {paper.title}
                </CardTitle>

                <div className="flex items-center text-sm text-muted-foreground space-x-4">
                  <div className="flex items-center space-x-1 flex-1 min-w-0">
                    <Users className="w-3 h-3 flex-shrink-0" />
                    <span className="line-clamp-1 flex-1">
                      {(() => {
                        const { displayText, hasMore } = formatAuthorsDisplay(paper);
                        const { remainingCount } = formatAuthorsForPreview(paper.authors || '', 2);
                        return (
                          <>
                            {displayText}
                            {hasMore && remainingCount > 0 && (
                              <span className="text-accent font-medium ml-1">
                                +{remainingCount} more
                              </span>
                            )}
                          </>
                        );
                      })()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <Calendar className="w-3 h-3" />
                    <span>{extractPublicationYear(paper.content)}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col space-y-3">
                {/* Paper interactions */}
                <div className="flex items-center justify-between pt-2 border-t border-muted/20">
                  <div className="flex items-center gap-3">
                    <StarButton 
                      paperId={paper.id}
                      paperTitle={paper.title}
                      paperLink={paper.link}
                      size="sm"
                    />
                    <CommentButton 
                      paperId={paper.id}
                      paperTitle={paper.title}
                      size="sm"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-auto">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button asChild className="w-full bg-accent hover:bg-accent/90" size="sm">
                      <Link href={`/papers/${paper.id}`}>
                        Explore
                      </Link>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                      className="hover:bg-accent/10 hover:border-accent/30"
                    >
                      <a 
                        href={paper.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <motion.div 
          className="flex justify-center items-center gap-2 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="hover:bg-accent/10 hover:border-accent/30"
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className={currentPage === pageNum 
                    ? "bg-accent text-accent-foreground" 
                    : "hover:bg-accent/10 hover:border-accent/30"
                  }
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="hover:bg-accent/10 hover:border-accent/30"
          >
            Next
          </Button>
        </motion.div>
      )}

      {/* No Results Message */}
      {searchQuery && totalResults === 0 && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-4">
            <Search className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <div className="space-y-2">
              <p className="text-lg font-medium">No papers found</p>
              <p className="text-muted-foreground">
                Try different keywords or browse our suggested papers below
              </p>
            </div>
            <Button 
              onClick={() => setSearchQuery("")}
              variant="outline"
              className="mt-4"
            >
              Clear Search
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
