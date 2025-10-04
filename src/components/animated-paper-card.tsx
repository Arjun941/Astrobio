"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink, 
  BookOpen, 
  Calendar, 
  Users, 
  Zap,
  Sparkles,
  Star,
  TrendingUp
} from "lucide-react";

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

export function AnimatedPaperCard({ paper, index }: PaperCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1
    }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  // Extract keywords for badges
  const keywords = paper.keywords 
    ? paper.keywords.split(',').slice(0, 3).map(k => k.trim())
    : [];

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

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      className="group"
    >
      <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 h-full">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full"
              style={{
                left: `${20 + i * 30}%`,
                top: `${10 + i * 20}%`,
              }}
              animate={isHovered ? {
                y: [-2, -8, -2],
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.5, 1],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <CardHeader className="relative z-10">
          <motion.div variants={contentVariants}>
            {/* Header with icons */}
            <motion.div 
              variants={itemVariants}
              className="flex items-start justify-between mb-2"
            >
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-2 rounded-full bg-primary/10"
                >
                  <BookOpen className="w-4 h-4 text-primary" />
                </motion.div>
                {paper.journal && (
                  <Badge variant="secondary" className="text-xs">
                    {paper.journal}
                  </Badge>
                )}
              </div>
              
              <motion.div
                whileHover={{ scale: 1.2, rotate: 15 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Star className="w-5 h-5 text-accent/60" />
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.div variants={itemVariants}>
              <CardTitle className="text-lg font-headline line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                {paper.title}
              </CardTitle>
            </motion.div>

            {/* Authors and date */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center text-sm text-muted-foreground space-x-4 mb-3"
            >
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
            </motion.div>

            {/* Keywords */}
            {keywords.length > 0 && (
              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap gap-1 mb-3"
              >
                {keywords.map((keyword, i) => (
                  <motion.div
                    key={keyword}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors"
                    >
                      <Sparkles className="w-2 h-2 mr-1" />
                      {keyword}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </CardHeader>

        <CardContent className="relative z-10">
          <motion.div variants={contentVariants}>
            {/* Action buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center space-x-2"
            >
              <Link href={`/papers/${paper.id}`} className="flex-1">
                <Button 
                  className="w-full group relative overflow-hidden bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary to-secondary"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10 flex items-center justify-center space-x-1">
                    <Zap className="w-3 h-3" />
                    <span>Explore</span>
                  </span>
                </Button>
              </Link>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                  className="hover:bg-secondary/10 hover:border-secondary"
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
              </motion.div>
            </motion.div>
          </motion.div>
        </CardContent>

        {/* Hover shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          initial={{ x: "-100%", skewX: -15 }}
          animate={isHovered ? { x: "100%" } : { x: "-100%" }}
          transition={{ duration: 0.6 }}
        />
      </Card>
    </motion.div>
  );
}