"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  FileText, 
  Search, 
  BookOpen, 
  ExternalLink, 
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles
} from "lucide-react";
import { analyzePdfAction } from "@/app/actions";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface RelatedPaper {
  id: string;
  title: string;
  link: string;
  relevanceScore: number;
  matchingKeywords: string[];
}

interface Citation {
  paperTitle: string;
  paperLink: string;
  citationText: string;
  lineNumber?: string;
  context: string;
}

interface AnalysisResult {
  keywords: string[];
  relatedPapers: RelatedPaper[];
  citations: Citation[];
  crossReferences: Citation[];
  summary: string;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile);
      setError(null);
      setAnalysisResult(null);
    } else {
      setError('Please upload a valid PDF file.');
      toast({
        title: "Invalid File",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024, // 50MB limit
  });

  const handleAnalyze = async () => {
    if (!file || !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to analyze research papers.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setError(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev < 90) return prev + 10;
          return prev;
        });
      }, 1000);

      const result = await analyzePdfAction(file);
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);

      if (result.error) {
        throw new Error(result.error);
      }

      setAnalysisResult(result.analysis);
      toast({
        title: "Analysis Complete",
        description: `Found ${result.analysis.relatedPapers.length} related papers and ${result.analysis.citations.length} citations.`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      toast({
        title: "Analysis Failed",
        description: err instanceof Error ? err.message : 'An error occurred during analysis.',
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setAnalysisResult(null);
    setError(null);
    setAnalysisProgress(0);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-accent" />
          <h1 className="text-3xl md:text-4xl font-bold">
            Research Cross-Reference
          </h1>
        </div>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
          Upload your research PDF to find related papers, citations, and cross-references from our database of 600+ papers
        </p>
      </motion.div>

      {/* Upload Section */}
      {!analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Research PDF
              </CardTitle>
              <CardDescription>
                Upload your research paper to analyze and find related studies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
                  ${isDragActive ? 'border-accent bg-accent/5' : 'border-muted-foreground/25'}
                  ${file ? 'bg-accent/5 border-accent' : 'hover:border-accent/50 hover:bg-accent/5'}
                `}
              >
                <input {...getInputProps()} />
                <div className="space-y-4">
                  {file ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="space-y-2"
                    >
                      <CheckCircle className="h-12 w-12 mx-auto text-accent" />
                      <p className="text-lg font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                      <div className="space-y-2">
                        <p className="text-lg font-medium">
                          {isDragActive ? 'Drop your PDF here' : 'Drag & drop your PDF here'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          or click to browse files (max 50MB)
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                {file && (
                  <Button
                    onClick={resetUpload}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Different File
                  </Button>
                )}
                {file && (
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="bg-accent hover:bg-accent/90 flex items-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4" />
                        Analyze & Find References
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Progress */}
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Analysis Progress</span>
                      <span>{analysisProgress}%</span>
                    </div>
                    <Progress value={analysisProgress} className="w-full" />
                  </div>
                  <div className="text-sm text-muted-foreground text-center">
                    {analysisProgress < 30 && "Extracting text from PDF..."}
                    {analysisProgress >= 30 && analysisProgress < 60 && "Generating keywords with AI..."}
                    {analysisProgress >= 60 && analysisProgress < 90 && "Searching related papers..."}
                    {analysisProgress >= 90 && "Finding citations and cross-references..."}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Results Section */}
      <AnimatePresence>
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Action Bar */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Analysis Results</h2>
              <Button onClick={resetUpload} variant="outline">
                Analyze Another Paper
              </Button>
            </div>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Paper Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {analysisResult.summary}
                </p>
              </CardContent>
            </Card>

            {/* Keywords */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Extracted Keywords
                </CardTitle>
                <CardDescription>
                  AI-generated keywords used for finding related research
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Related Papers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Related Papers ({analysisResult.relatedPapers.length})
                </CardTitle>
                <CardDescription>
                  Papers from our database that match your research
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisResult.relatedPapers.map((paper, index) => (
                    <motion.div
                      key={paper.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-2">
                          <h4 className="font-medium line-clamp-2">{paper.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {Math.round(paper.relevanceScore * 100)}% match
                            </Badge>
                            <div className="flex flex-wrap gap-1">
                              {paper.matchingKeywords.slice(0, 3).map((keyword, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={paper.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Citations */}
            {analysisResult.citations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5" />
                    Citations Found ({analysisResult.citations.length})
                  </CardTitle>
                  <CardDescription>
                    References to papers in our database
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisResult.citations.map((citation, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="border-l-4 border-accent pl-4 py-2"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <h5 className="font-medium text-sm">{citation.paperTitle}</h5>
                            {citation.lineNumber && (
                              <Badge variant="outline" className="text-xs">
                                Line {citation.lineNumber}
                              </Badge>
                            )}
                          </div>
                          <blockquote className="text-sm text-muted-foreground italic">
                            "{citation.citationText}"
                          </blockquote>
                          <p className="text-xs text-muted-foreground">
                            Context: {citation.context}
                          </p>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={citation.paperLink} target="_blank" rel="noopener noreferrer">
                              View Paper <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}