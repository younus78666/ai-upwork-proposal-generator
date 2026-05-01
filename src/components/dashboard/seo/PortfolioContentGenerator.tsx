'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, 
  ChevronDown, 
  ChevronUp,
  Copy, 
  Check,
  Sparkles,
  FolderOpen,
  Briefcase
} from 'lucide-react';

interface PortfolioContent {
  title: string;
  fullDescription: string;
  keyFeatures: string[];
  clientProblem: string;
  solution: string;
  outcome: string;
  faqs: { question: string; answer: string }[];
  suggestedTags: string[];
}

interface PortfolioContentGeneratorProps {
  titles: string[];
  type: 'portfolio' | 'catalog';
  keywords: string[];
  openaiApiKey: string | null;
}

export function PortfolioContentGenerator({ 
  titles, 
  type, 
  keywords,
  openaiApiKey 
}: PortfolioContentGeneratorProps) {
  const { toast } = useToast();
  const [generatedContent, setGeneratedContent] = useState<Record<number, PortfolioContent>>({});
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleGenerate = async (title: string, index: number) => {
    if (!openaiApiKey) {
      toast({
        title: 'API Key Required',
        description: 'Please add your OpenAI API key first',
        variant: 'destructive',
      });
      return;
    }

    setLoadingIndex(index);

    try {
      const { data, error } = await supabase.functions.invoke('generate-portfolio-content', {
        body: {
          openaiApiKey,
          title,
          keywords,
          projectType: type,
        },
      });

      if (error) throw error;

      setGeneratedContent(prev => ({
        ...prev,
        [index]: { title, ...data },
      }));
      setExpandedIndex(index);
      toast({
        title: 'Content Generated',
        description: `Generated full content for "${title}"`,
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate content',
        variant: 'destructive',
      });
    } finally {
      setLoadingIndex(null);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const CopyBtn = ({ text, field }: { text: string; field: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copyToClipboard(text, field)}
      className="h-6 w-6 p-0"
    >
      {copiedField === field ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  );

  const Icon = type === 'portfolio' ? FolderOpen : Briefcase;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {type === 'portfolio' ? 'Portfolio Titles' : 'Project Catalog Titles'} ({titles.length})
        </CardTitle>
        <CardDescription>
          Click "Generate Details" to create full content for each item
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-2">
            {titles.map((title, i) => (
              <Collapsible
                key={i}
                open={expandedIndex === i && generatedContent[i] !== undefined}
                onOpenChange={(open) => setExpandedIndex(open ? i : null)}
              >
                <div className="p-3 bg-muted/50 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium block truncate">{title}</span>
                      <span className="text-xs text-muted-foreground">{title.length} chars</span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <CopyBtn text={title} field={`title-${i}`} />
                      {generatedContent[i] ? (
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            {expandedIndex === i ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerate(title, i)}
                          disabled={loadingIndex !== null || !openaiApiKey}
                          className="h-7 px-2 text-xs"
                        >
                          {loadingIndex === i ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>
                              <Sparkles className="h-3 w-3 mr-1" />
                              Generate
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  <CollapsibleContent className="mt-4 space-y-4">
                    {generatedContent[i] && (
                      <>
                        {/* Full Description */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium">Full Description</Label>
                            <CopyBtn 
                              text={generatedContent[i].fullDescription} 
                              field={`desc-${i}`} 
                            />
                          </div>
                          <p className="text-xs text-muted-foreground bg-background p-2 rounded border">
                            {generatedContent[i].fullDescription}
                          </p>
                        </div>

                        {/* Client Problem → Solution → Outcome */}
                        <div className="grid gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-orange-500">Client Problem</Label>
                            <p className="text-xs bg-background p-2 rounded border">
                              {generatedContent[i].clientProblem}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-blue-500">Solution</Label>
                            <p className="text-xs bg-background p-2 rounded border">
                              {generatedContent[i].solution}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs font-medium text-green-500">Outcome</Label>
                            <p className="text-xs bg-background p-2 rounded border">
                              {generatedContent[i].outcome}
                            </p>
                          </div>
                        </div>

                        {/* Key Features */}
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">Key Features</Label>
                          <div className="flex flex-wrap gap-1">
                            {generatedContent[i].keyFeatures.map((feature, fi) => (
                              <Badge key={fi} variant="secondary" className="text-[10px]">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* FAQs */}
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">FAQs</Label>
                          <div className="space-y-2">
                            {generatedContent[i].faqs.map((faq, fi) => (
                              <div key={fi} className="bg-background p-2 rounded border">
                                <p className="text-xs font-medium">{faq.question}</p>
                                <p className="text-xs text-muted-foreground mt-1">{faq.answer}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium">Suggested Tags</Label>
                            <CopyBtn 
                              text={generatedContent[i].suggestedTags.join(', ')} 
                              field={`tags-${i}`} 
                            />
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {generatedContent[i].suggestedTags.map((tag, ti) => (
                              <Badge key={ti} variant="outline" className="text-[10px]">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <span className={className}>{children}</span>;
}
