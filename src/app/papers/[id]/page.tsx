import { notFound } from "next/navigation";
import { fetchPapersData, type Paper, processImageUrls } from "@/lib/papers-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SummaryView from "@/components/features/summary-view";
import MindmapView from "@/components/features/mindmap-view";
import AudioView from "@/components/features/audio-view";
import ChatbotView from "@/components/features/chatbot-view";
import QuizView from "@/components/features/quiz-view";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { PaperImagesViewer } from "@/components/paper-images-viewer";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { PaperInteractions, PaperComments } from "@/components/paper-interactions-wrapper";

async function getPaper(id: string): Promise<Paper | undefined> {
  const papers = await fetchPapersData();
  return papers.find((p) => p.id === id);
}

function extractAuthorsFromContent(content: string): string {
  const authorsMatch = content.match(/AUTHORS:\s*(.+?)(?:\n|$)/i);
  if (authorsMatch) {
    return authorsMatch[1].trim();
  }
  return "Authors not specified";
}

function extractPublicationYear(content: string): string {
  const yearMatch = content.match(/(\d{4})/);
  return yearMatch ? yearMatch[1] : "N/A";
}

function extractDOI(content: string): string | null {
  const doiMatch = content.match(/DOI:\s*(.+?)(?:\n|$)/i);
  return doiMatch ? doiMatch[1].trim() : null;
}

export default async function PaperDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const paper = await getPaper(resolvedParams.id);

  if (!paper) {
    notFound();
  }

  const authors = extractAuthorsFromContent(paper.content);
  const year = extractPublicationYear(paper.content);
  const doi = extractDOI(paper.content);
  const imageUrls = processImageUrls(paper.images || '');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline font-bold mb-4">{paper.title}</h1>
        <div className="flex flex-col gap-4 text-muted-foreground">
          <p>{authors} - {year}</p>
          {doi && (
            <p className="text-sm">DOI: {doi}</p>
          )}
          
          {/* Paper interactions */}
          <div className="flex items-center gap-6">
            <PaperInteractions 
              paperId={resolvedParams.id}
              paperTitle={paper.title}
              paperLink={paper.link}
            />
          </div>
          
          <div className="flex gap-2">
            {paper.link && (
              <Button variant="outline" size="sm" asChild>
                <a href={paper.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Original
                </a>
              </Button>
            )}
            {paper.pdfLink && (
              <Button variant="outline" size="sm" asChild>
                <a href={paper.pdfLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Download PDF
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto scrollbar-hide mb-4 h-auto flex-nowrap p-1 gap-1">
          <TabsTrigger value="content" className="whitespace-nowrap px-4 py-2.5 text-sm min-w-fit shrink-0">
            Full Paper
          </TabsTrigger>
          <TabsTrigger value="images" className="whitespace-nowrap px-4 py-2.5 text-sm min-w-fit shrink-0">
            Images ({imageUrls.length})
          </TabsTrigger>
          <TabsTrigger value="summary" className="whitespace-nowrap px-4 py-2.5 text-sm min-w-fit shrink-0">
            Summary
          </TabsTrigger>
          <TabsTrigger value="mindmap" className="whitespace-nowrap px-4 py-2.5 text-sm min-w-fit shrink-0">
            Mindmap
          </TabsTrigger>
          <TabsTrigger value="audio" className="whitespace-nowrap px-4 py-2.5 text-sm min-w-fit shrink-0">
            Audio
          </TabsTrigger>
          <TabsTrigger value="chatbot" className="whitespace-nowrap px-4 py-2.5 text-sm min-w-fit shrink-0">
            Chatbot
          </TabsTrigger>
          <TabsTrigger value="quiz" className="whitespace-nowrap px-4 py-2.5 text-sm min-w-fit shrink-0">
            Quiz
          </TabsTrigger>
        </TabsList>
        <TabsContent value="content">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">Full Research Paper</h2>
            {paper.content ? (
              <MarkdownRenderer content={paper.content} />
            ) : (
              <div className="text-muted-foreground text-center py-8">
                <p>Full paper content is not available for this research paper.</p>
                <p className="mt-2">
                  You can access the original paper using the "View Original" link above.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="images">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">Research Images</h2>
            <PaperImagesViewer imageUrls={imageUrls} paperTitle={paper.title} />
          </div>
        </TabsContent>
        <TabsContent value="summary">
          <SummaryView paperUrl={paper.link} />
        </TabsContent>
        <TabsContent value="mindmap">
          <MindmapView paperUrl={paper.link} />
        </TabsContent>
        <TabsContent value="audio">
          <AudioView paperUrl={paper.link} />
        </TabsContent>
        <TabsContent value="chatbot">
           <ChatbotView paperUrl={paper.link} />
        </TabsContent>
        <TabsContent value="quiz">
          <QuizView paperUrl={paper.link} />
        </TabsContent>
      </Tabs>

      {/* Comments section */}
      <div className="mt-8">
        <PaperComments 
          paperId={resolvedParams.id} 
          paperTitle={paper.title} 
        />
      </div>
    </div>
  );
}
