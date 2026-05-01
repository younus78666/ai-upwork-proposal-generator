'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
;
import { APISelection } from '@/components/APISelection';
import { ProposalOutput } from '@/components/ProposalOutput';
import { useProposal } from '@/context/ProposalContext';

const Generate = () => {
  const { currentPage } = useProposal();
  const router = useRouter();

  useEffect(() => {
    if (currentPage === 'input') {
      router.replace('/');
    }
  }, [currentPage]);

  const content = currentPage === 'output'
    ? <ProposalOutput />
    : currentPage === 'api-selection'
      ? <APISelection />
      : null;

  if (!content) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container mx-auto py-8 md:py-12">
        {content}
      </main>
      <footer className="border-t border-border/50 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Ultimate Freelancers
        </div>
      </footer>
    </div>
  );
};

export default Generate;
