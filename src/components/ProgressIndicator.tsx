'use client'
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { useProposal } from '@/context/ProposalContext';

const steps = [
  { id: 'input', label: 'Job Details' },
  { id: 'questions', label: 'Questions' },
  { id: 'api-selection', label: 'Choose AI' },
  { id: 'output', label: 'Proposal' },
];

export function ProgressIndicator() {
  const { currentPage, currentQuestionIndex, questions } = useProposal();
  
  const stepIndex = steps.findIndex(s => s.id === currentPage);
  const totalQuestions = questions.length;

  return (
    <div className="w-full py-6 px-4">
      <div className="flex items-center justify-center gap-2 md:gap-4">
        {steps.map((step, index) => {
          const isComplete = index < stepIndex;
          const isCurrent = index === stepIndex;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                    isComplete && "gradient-primary text-primary-foreground shadow-glow",
                    isCurrent && "border-2 border-primary bg-primary/10 text-primary",
                    !isComplete && !isCurrent && "border-2 border-muted bg-muted text-muted-foreground"
                  )}
                >
                  {isComplete ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={cn(
                  "mt-2 text-xs font-medium hidden md:block",
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.label}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className={cn(
                  "h-0.5 w-8 md:w-16 mx-2 transition-all duration-300",
                  index < stepIndex ? "bg-primary" : "bg-muted"
                )} />
              )}
            </div>
          );
        })}
      </div>
      
      {currentPage === 'questions' && totalQuestions > 0 && (
        <div className="mt-4 text-center">
          <span className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <div className="mt-2 mx-auto max-w-xs bg-muted rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full gradient-primary transition-all duration-300 rounded-full"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
