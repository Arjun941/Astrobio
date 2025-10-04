"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { getSummaryAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LoadingSpinner from "@/components/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { Sparkles } from "lucide-react";

type ComplexityLevel = 'Expert' | 'Student' | 'ELI10';

export default function SummaryView({ paperUrl }: { paperUrl: string }) {
  const [complexity, setComplexity] = useState<ComplexityLevel>('Student');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setSummary('');
    const result = await getSummaryAction(paperUrl, complexity, userProfile);
    setIsLoading(false);

    if (result.error) {
      toast({
        title: "Error Generating Summary",
        description: result.error,
        variant: "destructive",
      });
    } else if (result.summary) {
      setSummary(result.summary);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-border hover:border-accent/30 transition-all duration-300">
        <CardHeader>
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Sparkles className="h-5 w-5 text-accent" />
            <CardTitle className="font-headline">AI-Powered Summary</CardTitle>
          </motion.div>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center pt-4">
          <Select
            onValueChange={(value: ComplexityLevel) => setComplexity(value)}
            defaultValue={complexity}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select complexity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Expert">Expert</SelectItem>
              <SelectItem value="Student">Student</SelectItem>
              <SelectItem value="ELI10">ELI10 (Explain Like I'm 10)</SelectItem>
            </SelectContent>
          </Select>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={handleGenerateSummary} 
              disabled={isLoading}
              className="bg-accent hover:bg-accent/90"
            >
              {isLoading ? "Generating..." : "Generate Summary"}
            </Button>
          </motion.div>
        </div>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <motion.div 
              className="flex justify-center items-center h-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <LoadingSpinner text="Generating summary..." />
            </motion.div>
          )}
          {summary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MarkdownRenderer content={summary} />
            </motion.div>
          )}
          {!isLoading && !summary && (
            <motion.div 
              className="text-center text-muted-foreground py-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p>Select a complexity level and click 'Generate Summary' to begin.</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
