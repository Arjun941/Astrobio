"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getQuizAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import LoadingSpinner from '@/components/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, RefreshCw, Brain } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export default function QuizView({ paperUrl }: { paperUrl: string }) {
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const { toast } = useToast();

  const handleGenerateQuiz = async () => {
    setIsLoading(true);
    setQuiz([]);
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    const result = await getQuizAction(paperUrl);
    setIsLoading(false);

    if (result.error) {
      toast({
        title: "Error Generating Quiz",
        description: result.error,
        variant: "destructive",
      });
    } else if ('quiz' in result && result.quiz) {
      setQuiz(result.quiz || []);
    }
  };

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return;
    setIsAnswered(true);
    if (selectedAnswer === quiz[currentQuestionIndex].answer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setQuiz([]);
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-96">
          <LoadingSpinner />
          <p className="mt-4">Generating your quiz...</p>
        </CardContent>
      </Card>
    );
  }

  if (quiz.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-96 text-center">
          <p className="mb-4 text-muted-foreground">Test your knowledge with a short quiz.</p>
          <Button onClick={handleGenerateQuiz}>Generate Quiz</Button>
        </CardContent>
      </Card>
    );
  }

  if (quizFinished) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-center">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-2xl">Your Score: {score} / {quiz.length}</p>
          <p className="text-muted-foreground">
            {score / quiz.length >= 0.8 ? "Excellent job!" : "Good effort! Review the paper to learn more."}
          </p>
          <Button onClick={handleRestart}><RefreshCw className="mr-2 h-4 w-4" /> Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = quiz[currentQuestionIndex];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">
          Question {currentQuestionIndex + 1} of {quiz.length}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-semibold mb-4 text-lg">{currentQuestion.question}</p>
        <RadioGroup
          value={selectedAnswer || ''}
          onValueChange={setSelectedAnswer}
          disabled={isAnswered}
          className="space-y-2"
        >
          {currentQuestion.options.map((option, index) => {
            const isCorrect = option === currentQuestion.answer;
            const isSelected = option === selectedAnswer;
            
            return (
              <Label
                key={index}
                className={cn(
                  "flex items-center p-3 border rounded-md cursor-pointer transition-colors",
                  isAnswered && isCorrect && "bg-green-100 dark:bg-green-900/30 border-green-500",
                  isAnswered && isSelected && !isCorrect && "bg-red-100 dark:bg-red-900/30 border-red-500",
                  !isAnswered && "hover:bg-muted/50"
                )}
              >
                <RadioGroupItem value={option} id={`option-${index}`} className="mr-3" />
                <span>{option}</span>
                {isAnswered && isCorrect && <CheckCircle className="ml-auto text-green-600" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="ml-auto text-red-600" />}
              </Label>
            );
          })}
        </RadioGroup>
        <div className="mt-6 flex justify-end">
          {isAnswered ? (
            <Button onClick={handleNextQuestion}>
              {currentQuestionIndex === quiz.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </Button>
          ) : (
            <Button onClick={handleAnswerSubmit} disabled={!selectedAnswer}>
              Submit Answer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
