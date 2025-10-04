'use client';'use client';



import { useState, useMemo } from 'react';import { useState, useMemo   return (

import { type Paper, searchPapers } from "@/lib/papers-data";    <div className="container mx-auto px-4 py-8 space-y-6">

import { PapersSearch } from "@/components/papers-search";      <div className="text-center space-y-4">

import { Badge } from "@/components/ui/badge";        <h1 className="text-3xl md:text-4xl font-bold mb-4">

import { CleanPaperCard } from "@/components/clean-paper-card";          Explore Research Papers

        </h1>

interface PapersPageClientProps {        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">

  initialPapers: Paper[];          Discover cutting-edge research in space biology, microgravity effects, and astrobiology

}        </p>eact';

import Link from "next/link";

export function PapersPageClient({ initialPapers }: PapersPageClientProps) {import { type Paper, searchPapers } from "@/lib/papers-data";

  const [searchQuery, setSearchQuery] = useState('');import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

  // Filter papers based on search queryimport { PapersSearch } from "@/components/papers-search";

  const filteredPapers = useMemo(() => {import { Badge } from "@/components/ui/badge";

    return searchPapers(initialPapers, searchQuery);import { MarkdownRenderer } from "@/components/ui/markdown-renderer";

  }, [initialPapers, searchQuery]);import { CleanPaperCard } from "@/components/clean-paper-card";



  const extractAuthorsFromContent = (content: string): string => {interface PapersPageClientProps {

    // Try to extract authors from the content if available  initialPapers: Paper[];

    const authorsMatch = content.match(/AUTHORS:\s*(.+?)(?:\n|$)/i);}

    if (authorsMatch) {

      return authorsMatch[1].trim();export function PapersPageClient({ initialPapers }: PapersPageClientProps) {

    }  const [searchQuery, setSearchQuery] = useState('');

    return "Authors not specified";

  };  // Filter papers based on search query

  const filteredPapers = useMemo(() => {

  const extractPublicationYear = (content: string): string => {    return searchPapers(initialPapers, searchQuery);

    // Extract publication year from content  }, [initialPapers, searchQuery]);

    const yearMatch = content.match(/(\d{4})/);

    return yearMatch ? yearMatch[1] : 'Unknown';  const extractAuthorsFromContent = (content: string): string => {

  };    // Try to extract authors from the content if available

    const authorsMatch = content.match(/AUTHORS:\s*(.+?)(?:\n|$)/i);

  const truncateContent = (content: string, maxLength = 200): string => {    if (authorsMatch) {

    if (content.length <= maxLength) return content;      return authorsMatch[1].trim();

    return content.substring(0, maxLength) + '...';    }

  };    return "Authors not specified";

  };

  const extractKeywords = (content: string): string => {

    // Extract keywords from content or return some defaults  const extractPublicationYear = (content: string): string => {

    const keywordsMatch = content.match(/KEYWORDS:\s*(.+?)(?:\n|$)/i);    // Try to extract year from DOI or content

    if (keywordsMatch) {    const yearMatch = content.match(/(\d{4})/);

      return keywordsMatch[1].trim();    return yearMatch ? yearMatch[1] : "N/A";

    }  };

    // Return some default astrobiology keywords

    return "astrobiology,space biology,microgravity";  const truncateContent = (content: string, maxLength: number = 150): string => {

  };    if (content.length <= maxLength) return content;

    return content.substring(0, maxLength) + "...";

  return (  };

    <div className="container mx-auto px-4 py-8 space-y-6">

      <div className="text-center space-y-4">  return (

        <h1 className="text-3xl md:text-4xl font-bold mb-4">    <div className="container mx-auto px-4 py-8">

          Research Papers      <div className="text-center mb-8">

        </h1>        <h1 className="text-3xl md:text-4xl font-headline font-bold mb-4">

        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">          Explore Astrobiology Research Papers

          Discover cutting-edge research in space biology, microgravity effects, and astrobiology        </h1>

        </p>        <p className="text-lg text-muted-foreground mb-6">

                  Discover cutting-edge research in space biology, microgravity effects, and astrobiology

        <PapersSearch onSearch={setSearchQuery} />        </p>

                

        {searchQuery && (        <PapersSearch onSearch={setSearchQuery} />

          <div className="flex items-center justify-center gap-2 mb-4">        

            <span className="text-sm text-muted-foreground">        {searchQuery && (

              Found {filteredPapers.length} paper{filteredPapers.length !== 1 ? 's' : ''} for:          <div className="flex items-center justify-center gap-2 mb-4">

            </span>            <span className="text-sm text-muted-foreground">

            <Badge variant="secondary">{searchQuery}</Badge>              Found {filteredPapers.length} paper{filteredPapers.length !== 1 ? 's' : ''} for:

          </div>            </span>

        )}            <Badge variant="secondary">{searchQuery}</Badge>

      </div>          </div>

        )}

      {filteredPapers.length === 0 ? (      </div>

        <div className="text-center py-12">

          <p className="text-lg text-muted-foreground">      {filteredPapers.length === 0 ? (

            {searchQuery ? `No papers found matching "${searchQuery}"` : 'No papers available'}        <div className="text-center py-12">

          </p>          <p className="text-lg text-muted-foreground">

          {searchQuery && (            {searchQuery ? `No papers found matching "${searchQuery}"` : 'No papers available'}

            <p className="text-sm text-muted-foreground mt-2">          </p>

              Try searching with different keywords or clear your search          {searchQuery && (

            </p>            <p className="text-sm text-muted-foreground mt-2">

          )}              Try searching with different keywords or clear your search

        </div>            </p>

      ) : (          )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">        </div>

          {filteredPapers.map((paper, index) => {      ) : (

            // Transform paper data for CleanPaperCard        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            const transformedPaper = {          {filteredPapers.map((paper, index) => {

              id: paper.id,            // Transform paper data for CleanPaperCard

              title: paper.title,            const transformedPaper = {

              authors: extractAuthorsFromContent(paper.content),              id: paper.id,

              abstract: truncateContent(              title: paper.title,

                paper.content              authors: extractAuthorsFromContent(paper.content),

                  .replace(/={4,}/g, '')              abstract: truncateContent(

                  .replace(/DOI:\s*[^\n]*/g, '')                paper.content

                  .replace(/TITLE:\s*[^\n]*/g, '')                  .replace(/={4,}/g, '')

                  .replace(/AUTHORS:\s*[^\n]*/g, '')                  .replace(/DOI:\s*[^\n]*/g, '')

                  .replace(/ABSTRACT/g, '')                  .replace(/TITLE:\s*[^\n]*/g, '')

                  .trim()                  .replace(/AUTHORS:\s*[^\n]*/g, '')

              ),                  .replace(/ABSTRACT/g, '')

              url: paper.link,                  .trim()

              publication_date: extractPublicationYear(paper.content),              ),

              keywords: extractKeywords(paper.content),              url: paper.link,

              journal: 'Astrobiology Research'              publication_date: extractPublicationYear(paper.content),

            };              keywords: extractKeywords(paper.content),

              journal: 'Astrobiology Research'

            return (            };

              <CleanPaperCard 

                key={paper.id}            return (

                paper={transformedPaper}              <CleanPaperCard 

                index={index}                key={paper.id}

              />                paper={transformedPaper}

            );                index={index}

          })}              />

        </div>            );

      )}          })}

    </div>        </div>

  );      )}

}    </div>
  );

  function extractKeywords(content: string): string {
    // Extract keywords from content or return some defaults
    const keywordsMatch = content.match(/KEYWORDS:\s*(.+?)(?:\n|$)/i);
    if (keywordsMatch) {
      return keywordsMatch[1].trim();
    }
    // Return some default astrobiology keywords
    return "astrobiology,space biology,microgravity";
  }
}