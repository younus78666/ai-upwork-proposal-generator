'use client'
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Loader2, 
  ArrowLeft, 
  ArrowRight, 
  RefreshCw, 
  Sparkles,
  Pencil,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProposal } from '@/context/ProposalContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function QuestionCard() {
  const {
    questions,
    currentQuestionIndex,
    jobTitle,
    jobDescription,
    jobAnalysis,
    isGeneratingAnswer,
    currentError,
    updateAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    setCurrentPage,
    clearError,
  } = useProposal();

  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerateError, setRegenerateError] = useState<string | null>(null);
  const [showEditHint, setShowEditHint] = useState(true);

  const question = questions[currentQuestionIndex];
  const isLast = currentQuestionIndex === questions.length - 1;
  const totalQuestions = questions.length;
  const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Check if current answer is empty
  const isCurrentAnswerEmpty = !question?.answer?.trim();
  
  // Check if all answers are filled for proposal generation
  const validation = useMemo(() => {
    const emptyAnswers = questions.filter(q => !q.answer?.trim());
    const hasEmptyAnswers = emptyAnswers.length > 0;
    return {
      hasEmptyAnswers,
      emptyCount: emptyAnswers.length,
      canGenerateProposal: !hasEmptyAnswers
    };
  }, [questions]);

  // Build previous answers context
  const getPreviousAnswers = () => {
    return questions
      .slice(0, currentQuestionIndex)
      .map(q => ({ question: q.question, answer: q.answer }));
  };

  // Regenerate answer using the generate-answer edge function
  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setRegenerateError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-answer', {
        body: { 
          question: question.question,
          jobTitle,
          jobDescription,
          jobAnalysis,
          previousAnswers: getPreviousAnswers()
        }
      });
      
      if (error) throw error;
      
      updateAnswer(currentQuestionIndex, data.suggestion);
      toast.success('New suggestion generated!');
    } catch (error) {
      console.error('Error regenerating answer:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate suggestion';
      setRegenerateError(errorMessage);
      toast.error('Failed to generate suggestion. Try again.');
    } finally {
      setIsRegenerating(false);
    }
  };


  const handleNext = () => {
    if (!isCurrentAnswerEmpty) {
      goToNextQuestion();
    }
  };

  const handleProceedToAPI = () => {
    if (validation.canGenerateProposal) {
      setCurrentPage('api-selection');
    }
  };

  if (!question) return null;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
      {/* Progress Section */}
      <div className="mb-6 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(progressPercent)}% complete
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
          <div 
            className="h-full gradient-primary transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Error Display */}
      {(currentError || regenerateError) && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg animate-fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-destructive font-medium">Error</p>
              <p className="text-sm text-destructive/80 mt-1">{currentError || regenerateError}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                clearError();
                setRegenerateError(null);
              }}
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              Dismiss
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRegenerate}
              className="text-primary border-primary/30 hover:bg-primary/10"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Main Question Card */}
      <Card variant="elevated" className="border-0 shadow-lg animate-slide-in-right" key={question.id}>
        <CardContent className="p-6 md:p-8">
          {/* Question Text */}
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground leading-relaxed">
              {question.question}
            </h2>
          </div>

          {/* AI Suggested Answer Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI Suggested Answer</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRegenerate}
                disabled={isRegenerating || isGeneratingAnswer}
                className="text-muted-foreground hover:text-primary"
              >
                {isRegenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-1.5" />
                    Generate New
                  </>
                )}
              </Button>
            </div>

            {/* Editable Textarea */}
            <div className="relative">
              <Textarea
                value={question.answer}
                onChange={(e) => {
                  updateAnswer(currentQuestionIndex, e.target.value);
                  setShowEditHint(false);
                }}
                placeholder="Your answer will appear here..."
                className={cn(
                  "min-h-[180px] text-base leading-relaxed resize-none",
                  isCurrentAnswerEmpty && "border-amber-500/50"
                )}
                disabled={isRegenerating}
              />
              
              {/* Edit hint */}
              {showEditHint && question.answer && (
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                  <Pencil className="h-3 w-3" />
                  Click to edit
                </div>
              )}
            </div>

            {/* Empty answer warning */}
            {isCurrentAnswerEmpty && (
              <p className="text-sm text-amber-600 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4" />
                Please provide an answer to continue
              </p>
            )}

            {/* Loading overlay */}
            {isRegenerating && (
              <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating suggestion...
              </div>
            )}
          </div>


          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0 || isRegenerating}
              className="sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex-1" />

            {isLast ? (
              <div className="flex flex-col items-end gap-2">
                <Button
                  variant="hero"
                  onClick={handleProceedToAPI}
                  disabled={isRegenerating || !validation.canGenerateProposal}
                  className="sm:w-auto"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Choose AI & Generate
                </Button>
                {validation.hasEmptyAnswers && (
                  <p className="text-xs text-amber-600">
                    {validation.emptyCount} answer{validation.emptyCount > 1 ? 's' : ''} still needed
                  </p>
                )}
              </div>
            ) : (
              <Button
                onClick={handleNext}
                disabled={isRegenerating || isCurrentAnswerEmpty}
                className="sm:w-auto"
              >
                Next Question
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Navigation Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-6">
        {questions.map((q, index) => (
          <button
            key={index}
            onClick={() => {
              if (index < currentQuestionIndex) {
                // Go back to previous questions
                for (let i = currentQuestionIndex; i > index; i--) {
                  goToPreviousQuestion();
                }
              }
            }}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-200",
              index === currentQuestionIndex 
                ? "w-6 gradient-primary" 
                : index < currentQuestionIndex
                  ? q.answer?.trim() 
                    ? "bg-primary/60 hover:bg-primary cursor-pointer"
                    : "bg-amber-500/60 hover:bg-amber-500 cursor-pointer"
                  : "bg-muted"
            )}
            disabled={index >= currentQuestionIndex}
            title={`Question ${index + 1}${!q.answer?.trim() && index < currentQuestionIndex ? ' (needs answer)' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
