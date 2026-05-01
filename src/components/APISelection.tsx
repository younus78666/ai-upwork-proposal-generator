'use client'
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, KeyRound } from 'lucide-react';
import { useProposal } from '@/context/ProposalContext';
import { ProposalLoader } from '@/components/ProposalLoader';
import { findFirstSavedKey } from '@/config/providers';

export function APISelection() {
  const {
    generateProposal,
    runPipelineWithKey,
    questions,
    isGeneratingProposal,
    isAnalyzing,
    setCurrentPage,
    selectedAPI,
  } = useProposal();

  // Auto-trigger on mount if a session key already exists.
  // Guard: skip if the pipeline is already running (happens when runPipelineWithKey
  // temporarily sets currentPage:'api-selection' as a loading indicator — without this
  // guard, APISelection would launch a second concurrent pipeline run).
  useEffect(() => {
    if (isAnalyzing || isGeneratingProposal) return;
    const saved = findFirstSavedKey();
    if (saved) {
      if (questions.length === 0) {
        runPipelineWithKey(saved.key, saved.provider);
      } else {
        generateProposal(saved.key);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isAnalyzing || isGeneratingProposal) {
    return <ProposalLoader visible={true} />;
  }

  // No key set — prompt user to add one via the header or inline button
  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6 animate-fade-in text-center py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-5">
        <KeyRound className="h-8 w-8 text-primary" />
      </div>

      <h1 className="text-2xl font-bold mb-2">Add Your API Key</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Choose an AI provider and paste your key. It stays in your browser session only,
        never stored on our servers, cleared automatically when you close the browser.
      </p>

      <Link href="/api-key">
        <Button variant="hero" className="gap-2 mb-4">
          <KeyRound className="h-4 w-4" />
          Set API Key
        </Button>
      </Link>

      <div className="mt-6">
        <Button variant="ghost" onClick={() => setCurrentPage('input')} className="gap-2 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
    </div>
  );
}
