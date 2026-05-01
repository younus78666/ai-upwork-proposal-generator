'use client'
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useProfileSEOVersions, GeneratedContent, CompetitorAnalysis, ProfileSections, ProfileVariation, ProfileTitle, PersonalInfo } from '@/hooks/useProfileSEOVersions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

import { SavedVersionsPanel } from './seo/SavedVersionsPanel';
import { ApiKeySetup } from './seo/ApiKeySetup';
import { PortfolioContentGenerator } from './seo/PortfolioContentGenerator';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Search,
  Sparkles,
  Copy,
  Check,
  Loader2,
  Target,
  FileText,
  Briefcase,
  GraduationCap,
  FolderOpen,
  Tag,
  Lightbulb,
  ArrowRight,
  X,
  Plus,
  Users,
  BarChart3,
  Type,
  Clock,
  AlertCircle,
  Layers,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Zap,
  Award,
  BookOpen,
  ListChecks,
  Heart,
  Trophy,
  Wrench,
  MessageCircle,
  Star,
} from 'lucide-react';


interface KeywordSuggestion {
  keyword: string;
  reason: string;
  expectedCompetition: string;
  clientIntent: string;
}

interface KeywordSuggestions {
  primarySuggestions: KeywordSuggestion[];
  secondarySuggestions: KeywordSuggestion[];
  nicheOpportunities: KeywordSuggestion[];
  avoidKeywords: { keyword: string; reason: string }[];
}

interface KeywordCluster {
  name: string;
  description: string;
  keywords: string[];
  nicheScore: number;
  upworkFit: string;
  suggestedPlatforms: string[];
}

interface ClusteringResult {
  clusters: KeywordCluster[];
  recommendation: {
    bestClusterForUpwork: string;
    reason: string;
    otherClustersAdvice: string;
  };
}

interface CompetitorProfile {
  title: string;
  description: string;
}

interface ExtendedGeneratedContent extends GeneratedContent {
  profileTitles?: ProfileTitle[];
  profileVariations?: ProfileVariation[];
  competitorAnalysis?: CompetitorAnalysis | null;
  profileSections?: ProfileSections | null;
}

export function ProfileSEOTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [longTail1, setLongTail1] = useState('');
  const [longTail2, setLongTail2] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<ExtendedGeneratedContent | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<KeywordSuggestions | null>(null);
  const [openaiApiKey, setOpenaiApiKey] = useState<string | null>(null);
  
  // Clustering state
  const [isClustering, setIsClustering] = useState(false);
  const [clusteringResult, setClusteringResult] = useState<ClusteringResult | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<KeywordCluster | null>(null);

  // Competitor profiles state
  const [competitorProfiles, setCompetitorProfiles] = useState<CompetitorProfile[]>([
    { title: '', description: '' }
  ]);
  const [expandedCompetitors, setExpandedCompetitors] = useState<number[]>([0]);

  // Personal info state
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    education: '',
    experience: '',
    upworkStats: '',
    personalStory: ''
  });
  const [expandedPersonalInfo, setExpandedPersonalInfo] = useState<boolean>(true);
  const [isGeneratingPersonalInfo, setIsGeneratingPersonalInfo] = useState(false);

  // Selected variation for display
  const [selectedVariation, setSelectedVariation] = useState<string>('story-first');

  const {
    versions,
    isLoading: isLoadingVersions,
    isSaving,
    saveVersion,
    deleteVersion,
    setActiveVersion,
    convertToGeneratedContent,
  } = useProfileSEOVersions();

  const handleApiKeyChange = useCallback((key: string | null) => {
    setOpenaiApiKey(key);
  }, []);

  const handleAddBulkKeywords = () => {
    const lines = keywordInput
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !keywords.includes(line));
    
    if (lines.length > 0) {
      setKeywords([...keywords, ...lines]);
      setKeywordInput('');
      toast({
        title: `Added ${lines.length} keywords`,
        description: `Total keywords: ${keywords.length + lines.length}`,
      });
    } else if (keywordInput.trim()) {
      toast({
        title: 'No new keywords',
        description: 'All keywords already added or input is empty',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleGenerate = async () => {
    if (!longTail1 || !longTail2) {
      toast({
        title: 'Missing keywords',
        description: 'Please enter both long-tail keywords',
        variant: 'destructive',
      });
      return;
    }

    if (!openaiApiKey) {
      toast({
        title: 'API Key Required',
        description: 'Please add your OpenAI API key first',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Filter out empty competitor profiles
      const validCompetitors = competitorProfiles.filter(p => p.title.trim() || p.description.trim());
      
      const { data, error } = await supabase.functions.invoke('optimize-profile-seo', {
        body: {
          openaiApiKey,
          keywords,
          longTailKeyword1: longTail1,
          longTailKeyword2: longTail2,
          userId: user?.id,
          competitorProfiles: validCompetitors.length > 0 ? validCompetitors : undefined,
          personalInfo: (personalInfo.education || personalInfo.experience || personalInfo.upworkStats || personalInfo.personalStory) 
            ? personalInfo 
            : undefined,
        },
      });

      if (error) throw error;

      setGeneratedContent(data);
      setStep(4);
      toast({
        title: 'Profile content generated',
        description: 'Your optimized Upwork profile content is ready',
      });
    } catch (error) {
      console.error('Error generating profile:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate profile content',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };


  const handleSuggestKeywords = async () => {
    if (keywords.length === 0) {
      toast({
        title: 'No keywords',
        description: 'Please add at least one keyword first',
        variant: 'destructive',
      });
      return;
    }

    if (!openaiApiKey) {
      toast({
        title: 'API Key Required',
        description: 'Please add your OpenAI API key first',
        variant: 'destructive',
      });
      return;
    }

    setIsSuggesting(true);
    setSuggestions(null);

    try {
      const { data, error } = await supabase.functions.invoke('suggest-keywords', {
        body: { 
          openaiApiKey,
          keywords,
        },
      });

      if (error) throw error;

      if (data?.success && data?.data) {
        setSuggestions(data.data);
        toast({
          title: 'Suggestions ready',
          description: 'AI has generated keyword recommendations',
        });
      } else {
        throw new Error(data?.error || 'Failed to generate suggestions');
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate keyword suggestions',
        variant: 'destructive',
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleClusterKeywords = async () => {
    if (keywords.length < 3) {
      toast({
        title: 'Need more keywords',
        description: 'Please add at least 3 keywords to cluster',
        variant: 'destructive',
      });
      return;
    }

    if (!openaiApiKey) {
      toast({
        title: 'API Key Required',
        description: 'Please add your OpenAI API key first',
        variant: 'destructive',
      });
      return;
    }

    setIsClustering(true);
    setClusteringResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('cluster-keywords', {
        body: { openaiApiKey, keywords },
      });

      if (error) throw error;

      if (data?.success && data?.data) {
        setClusteringResult(data.data);
        setStep(2);
        toast({
          title: 'Keywords clustered',
          description: `Found ${data.data.clusters.length} distinct niches`,
        });
      } else {
        throw new Error(data?.error || 'Failed to cluster keywords');
      }
    } catch (error) {
      console.error('Error clustering keywords:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to cluster keywords',
        variant: 'destructive',
      });
    } finally {
      setIsClustering(false);
    }
  };

  const handleSelectCluster = (cluster: KeywordCluster) => {
    setSelectedCluster(cluster);
    // Update keywords to only include the selected cluster's keywords
    setKeywords(cluster.keywords);
    setStep(3);
    toast({
      title: 'Niche selected',
      description: `Focusing on "${cluster.name}" for your Upwork profile`,
    });
  };

  const handleGeneratePersonalInfo = async () => {
    if (keywords.length === 0 && !selectedCluster) {
      toast({
        title: 'No keywords selected',
        description: 'Please add keywords or select a niche cluster first',
        variant: 'destructive',
      });
      return;
    }

    setIsGeneratingPersonalInfo(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-personal-info', {
        body: {
          keywords,
          longTail1,
          longTail2,
          selectedCluster,
        },
      });

      if (error) throw error;

      if (data?.success && data?.data) {
        setPersonalInfo(data.data);
        toast({
          title: 'Personal info generated',
          description: 'Review and customize the content to match your real experience',
        });
      } else {
        throw new Error(data?.error || 'Failed to generate personal info');
      }
    } catch (error) {
      console.error('Error generating personal info:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate personal info',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingPersonalInfo(false);
    }
  };

  const applySuggestion = (keyword: string, target: 'primary' | 'secondary') => {
    if (target === 'primary') {
      setLongTail1(keyword);
    } else {
      setLongTail2(keyword);
    }
    toast({
      title: 'Applied',
      description: `Set as ${target} keyword`,
    });
  };

  const handleLoadVersion = (version: typeof versions[0]) => {
    const content = convertToGeneratedContent(version);
    setKeywords(version.keywords);
    setLongTail1(version.long_tail_keyword_1);
    setLongTail2(version.long_tail_keyword_2);
    setGeneratedContent(content);
    setStep(4);
    toast({
      title: 'Version loaded',
      description: `Loaded "${version.name}"`,
    });
  };

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-500 bg-green-500/10';
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'high':
        return 'text-orange-500 bg-orange-500/10';
      case 'very_high':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      toast({
        title: 'Copied',
        description: 'Content copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copyToClipboard(text, field)}
      className="h-8"
    >
      {copiedField === field ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          Upwork Profile SEO Optimizer
        </h1>
        <p className="text-muted-foreground mt-1">
          Optimize your Upwork profile with semantic keywords and long-tail strategy
        </p>
      </div>

      {/* API Key Setup */}
      <ApiKeySetup onKeyChange={handleApiKeyChange} />

      {/* Progress Steps */}
      <div className="flex items-center gap-2 flex-wrap">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                step >= s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {s}
            </div>
            <span className={`text-sm ${step >= s ? 'text-foreground' : 'text-muted-foreground'}`}>
              {s === 1 && 'Find Keywords'}
              {s === 2 && 'Choose Niche'}
              {s === 3 && 'Long-tail Strategy'}
              {s === 4 && 'Generated Content'}
            </span>
            {s < 4 && <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />}
          </div>
        ))}
      </div>

      {/* Step 1: Keyword Research */}
      {step === 1 && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Step 1: Find Your Keywords
                </CardTitle>
                <CardDescription>
                  Go to Upwork and type your main skill in the search bar. Note all the autocomplete suggestions that appear.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    How to find Upwork autocomplete keywords:
                  </h4>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Go to Upwork.com and click on "Find Talent" or the search bar</li>
                    <li>Type your main skill (e.g., "WordPress")</li>
                    <li>Note all the autocomplete suggestions that appear</li>
                    <li>Add each suggestion below as a keyword</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <Label>Add Keywords from Upwork Autocomplete</Label>
                  <Textarea
                    placeholder={`Paste keywords here, one per line:
WordPress design
WordPress expert
WordPress developer
WordPress theme customization
WordPress plugin development
...`}
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    rows={6}
                    className="font-mono text-sm"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      Paste multiple keywords, one per line. Duplicates will be ignored.
                    </p>
                    <Button onClick={handleAddBulkKeywords} disabled={!keywordInput.trim()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add All Keywords
                    </Button>
                  </div>
                </div>

                {keywords.length > 0 && (
                  <div className="space-y-2">
                    <Label>Your Keywords ({keywords.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {keywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary" className="px-3 py-1">
                          {keyword}
                          <button
                            onClick={() => handleRemoveKeyword(keyword)}
                            className="ml-2 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}



                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleClusterKeywords}
                    disabled={keywords.length < 3 || !openaiApiKey || isClustering}
                  >
                    {isClustering ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing Niches...
                      </>
                    ) : (
                      <>
                        <Layers className="h-4 w-4 mr-2" />
                        Cluster Keywords & Choose Niche
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Saved Versions Sidebar */}
          <div className="lg:col-span-1">
            <SavedVersionsPanel
              versions={versions}
              isLoading={isLoadingVersions}
              isSaving={isSaving}
              generatedContent={null}
              keywords={keywords}
              onSave={saveVersion}
              onDelete={deleteVersion}
              onSetActive={setActiveVersion}
              onLoad={handleLoadVersion}
            />
          </div>
        </div>
      )}

      {/* Step 2: Choose Niche / Cluster */}
      {step === 2 && clusteringResult && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Step 2: Choose Your Upwork Niche
              </CardTitle>
              <CardDescription>
                Upwork profiles perform best when focused on ONE specific niche. Select the cluster that best represents your expertise.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Important Warning */}
              <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/20">
                <CardContent className="pt-4">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="font-medium text-amber-800 dark:text-amber-200">
                        Why Focus on One Niche?
                      </h4>
                      <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                        <li>• Upwork's algorithm ranks profiles that are <strong>specific to a problem</strong></li>
                        <li>• Trying to rank for multiple unrelated niches = ranking poorly for all</li>
                        <li>• Use <strong>Fiverr, LinkedIn, or your website</strong> for other niches</li>
                        <li>• One focused profile converts better than a broad generalist profile</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Recommendation */}
              {clusteringResult.recommendation && (
                <Card className="border-primary/30 bg-primary/5">
                  <CardContent className="pt-4">
                    <div className="flex gap-3">
                      <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <h4 className="font-medium">
                          Recommended: {clusteringResult.recommendation.bestClusterForUpwork}
                        </h4>
                        <p className="text-sm text-muted-foreground">{clusteringResult.recommendation.reason}</p>
                        <p className="text-xs text-muted-foreground italic">{clusteringResult.recommendation.otherClustersAdvice}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Cluster Cards */}
              <div className="grid md:grid-cols-2 gap-4">
                {clusteringResult.clusters.map((cluster, index) => (
                  <Card 
                    key={index} 
                    className={`cursor-pointer transition-all hover:border-primary/50 ${
                      clusteringResult.recommendation.bestClusterForUpwork === cluster.name 
                        ? 'ring-2 ring-primary/30' 
                        : ''
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{cluster.name}</CardTitle>
                        <Badge 
                          variant={cluster.nicheScore >= 7 ? "default" : cluster.nicheScore >= 5 ? "secondary" : "outline"}
                          className="text-xs"
                        >
                          Niche Score: {cluster.nicheScore}/10
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">{cluster.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {cluster.keywords.slice(0, 6).map((kw, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {kw}
                          </Badge>
                        ))}
                        {cluster.keywords.length > 6 && (
                          <Badge variant="outline" className="text-xs">
                            +{cluster.keywords.length - 6} more
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-xs">
                        <span className="font-medium">Upwork Fit: </span>
                        <span className="text-muted-foreground">{cluster.upworkFit}</span>
                      </div>
                      
                      <div className="text-xs">
                        <span className="font-medium">Platforms: </span>
                        <span className="text-muted-foreground">{cluster.suggestedPlatforms.join(', ')}</span>
                      </div>

                      <Button 
                        onClick={() => handleSelectCluster(cluster)} 
                        className="w-full mt-2"
                        variant={clusteringResult.recommendation.bestClusterForUpwork === cluster.name ? "default" : "outline"}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Select This Niche
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back to Keywords
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Long-tail Keyword Strategy */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Step 3: Choose Long-tail Keywords
            </CardTitle>
            <CardDescription>
              {selectedCluster ? (
                <>Focusing on <strong>"{selectedCluster.name}"</strong> niche. Now choose 2 specific long-tail keywords.</>
              ) : (
                'High-competition keywords are harder to rank for. Choose 2 long-tail keywords that represent your specific expertise.'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
              <h4 className="font-medium mb-2">Your focused keywords:</h4>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <Badge key={keyword} variant="outline">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            {/* AI Keyword Suggestions */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI Keyword Suggestions
                </CardTitle>
                <CardDescription>
                  Get AI-powered long-tail keyword recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleSuggestKeywords}
                  disabled={isSuggesting || keywords.length === 0 || !openaiApiKey}
                  variant="outline"
                  className="w-full"
                >
                  {isSuggesting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Suggestions...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Get Smart Keyword Suggestions
                    </>
                  )}
                </Button>

                {suggestions && (
                  <Tabs defaultValue="primary" className="w-full">
                    <TabsList className="grid grid-cols-4 h-auto">
                      <TabsTrigger value="primary" className="text-xs py-1.5">Primary</TabsTrigger>
                      <TabsTrigger value="secondary" className="text-xs py-1.5">Secondary</TabsTrigger>
                      <TabsTrigger value="niche" className="text-xs py-1.5">Niche</TabsTrigger>
                      <TabsTrigger value="avoid" className="text-xs py-1.5">Avoid</TabsTrigger>
                    </TabsList>

                    <TabsContent value="primary" className="mt-3 space-y-2">
                      {suggestions.primarySuggestions.map((item, i) => (
                        <div key={i} className="p-3 bg-background rounded-lg border border-border/50">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="font-medium text-sm">{item.keyword}</span>
                            <div className="flex gap-1">
                              <Badge className={`${getCompetitionColor(item.expectedCompetition)} border-0 text-[10px]`}>
                                {item.expectedCompetition}
                              </Badge>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 px-2 text-xs"
                                onClick={() => applySuggestion(item.keyword, 'primary')}
                              >
                                Use
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">{item.reason}</p>
                          <p className="text-[10px] text-primary/70">👤 {item.clientIntent}</p>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="secondary" className="mt-3 space-y-2">
                      {suggestions.secondarySuggestions.map((item, i) => (
                        <div key={i} className="p-3 bg-background rounded-lg border border-border/50">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="font-medium text-sm">{item.keyword}</span>
                            <div className="flex gap-1">
                              <Badge className={`${getCompetitionColor(item.expectedCompetition)} border-0 text-[10px]`}>
                                {item.expectedCompetition}
                              </Badge>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 px-2 text-xs"
                                onClick={() => applySuggestion(item.keyword, 'secondary')}
                              >
                                Use
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">{item.reason}</p>
                          <p className="text-[10px] text-primary/70">👤 {item.clientIntent}</p>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="niche" className="mt-3 space-y-2">
                      {suggestions.nicheOpportunities.map((item, i) => (
                        <div key={i} className="p-3 bg-background rounded-lg border border-green-500/20">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="font-medium text-sm text-green-600">{item.keyword}</span>
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 px-2 text-xs"
                                onClick={() => applySuggestion(item.keyword, 'primary')}
                              >
                                Primary
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 px-2 text-xs"
                                onClick={() => applySuggestion(item.keyword, 'secondary')}
                              >
                                Secondary
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">{item.reason}</p>
                          <p className="text-[10px] text-green-600/70">💎 {item.clientIntent}</p>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="avoid" className="mt-3 space-y-2">
                      {suggestions.avoidKeywords.map((item, i) => (
                        <div key={i} className="p-3 bg-red-500/5 rounded-lg border border-red-500/20">
                          <span className="font-medium text-sm text-red-500">{item.keyword}</span>
                          <p className="text-xs text-muted-foreground mt-1">⚠️ {item.reason}</p>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Long-tail Keyword 1 (Primary Focus)</Label>
                <Input
                  placeholder="e.g., WooCommerce Store Developer"
                  value={longTail1}
                  onChange={(e) => setLongTail1(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This will be your main positioning keyword
                </p>
              </div>
              <div className="space-y-2">
                <Label>Long-tail Keyword 2 (Secondary Focus)</Label>
                <Input
                  placeholder="e.g., WordPress Speed Optimization Expert"
                  value={longTail2}
                  onChange={(e) => setLongTail2(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  A complementary skill that expands your market
                </p>
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
              <h4 className="font-medium mb-2 text-primary">💡 Pro Tips:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Choose keywords with less competition but good demand</li>
                <li>Be specific: "E-commerce WordPress Developer" vs just "WordPress Developer"</li>
                <li>Both keywords should be related but target different client needs</li>
              </ul>
            </div>

            {/* Personal Information Section */}
            <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20">
              <Collapsible open={expandedPersonalInfo} onOpenChange={setExpandedPersonalInfo}>
                <CardHeader className="pb-3">
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Heart className="h-4 w-4 text-green-600 dark:text-green-400" />
                        Your Personal Info (Makes Profile Authentic)
                      </CardTitle>
                      <CardDescription className="text-left mt-1">
                        Add your story to make the profile sound natural and genuine - not like AI wrote it
                      </CardDescription>
                    </div>
                    {expandedPersonalInfo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    {/* Generate Button */}
                    <Button
                      onClick={handleGeneratePersonalInfo}
                      disabled={keywords.length === 0 || isGeneratingPersonalInfo}
                      variant="outline"
                      className="w-full border-dashed border-green-500/50 hover:bg-green-500/10 hover:border-green-500"
                    >
                      {isGeneratingPersonalInfo ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating Authentic Story...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2 text-green-600" />
                          Generate Naturally Written Personal Info
                        </>
                      )}
                    </Button>
                    {keywords.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center">
                        Add keywords in Step 1 to enable AI generation
                      </p>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          Education & Certifications
                        </Label>
                        <Textarea
                          placeholder="e.g., I completed my B.S.C.S. in 2022 from University of Karachi. Top scorer in Automata and Data Structure. Also have Google Web Designer certification..."
                          value={personalInfo.education}
                          onChange={(e) => setPersonalInfo(prev => ({ ...prev, education: e.target.value }))}
                          rows={3}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          Work Experience & Companies
                        </Label>
                        <Textarea
                          placeholder="e.g., Started as Junior PHP/WordPress Developer in Karachi. Then worked with a Canadian company where I learned SEO and faced new challenges for E-Commerce clients..."
                          value={personalInfo.experience}
                          onChange={(e) => setPersonalInfo(prev => ({ ...prev, experience: e.target.value }))}
                          rows={3}
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm flex items-center gap-2">
                          <Trophy className="h-4 w-4" />
                          Upwork Stats & Achievements
                        </Label>
                        <Textarea
                          placeholder="e.g., 99% Job Success Rate, Top Rated badge, 2500+ hours, 400+ projects delivered, Expert-Vetted status..."
                          value={personalInfo.upworkStats}
                          onChange={(e) => setPersonalInfo(prev => ({ ...prev, upworkStats: e.target.value }))}
                          rows={2}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          Your Story & Journey
                        </Label>
                        <Textarea
                          placeholder="e.g., I started exploring SEO when I worked with David. That's when I discovered things university never taught me. Now I love using AI tools like Lovable to design unique websites..."
                          value={personalInfo.personalStory}
                          onChange={(e) => setPersonalInfo(prev => ({ ...prev, personalStory: e.target.value }))}
                          rows={2}
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      💡 The more personal details you share, the more natural and authentic your profile will sound. This is what makes clients trust you!
                    </p>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Competitor Profiles Section */}
            <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  Competitor Analysis (Optional)
                </CardTitle>
                <CardDescription>
                  Add up to 3 competitor profiles to compare and analyze. Our AI will score each profile and show what makes yours better.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {competitorProfiles.map((profile, index) => (
                  <Collapsible 
                    key={index}
                    open={expandedCompetitors.includes(index)}
                    onOpenChange={(open) => {
                      setExpandedCompetitors(prev => 
                        open ? [...prev, index] : prev.filter(i => i !== index)
                      );
                    }}
                  >
                    <div className="border rounded-lg bg-background">
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm">
                            Competitor {index + 1}
                            {profile.title && `: ${profile.title.substring(0, 30)}${profile.title.length > 30 ? '...' : ''}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {(profile.title || profile.description) && (
                            <Badge variant="secondary" className="text-xs">
                              {profile.title ? 'Title' : ''}{profile.title && profile.description ? ' + ' : ''}{profile.description ? 'Desc' : ''}
                            </Badge>
                          )}
                          {expandedCompetitors.includes(index) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="p-3 pt-0 space-y-3">
                          <div className="space-y-2">
                            <Label className="text-xs">Profile Title</Label>
                            <Input
                              placeholder="e.g., Senior WordPress Developer | 10+ Years Experience"
                              value={profile.title}
                              onChange={(e) => {
                                const updated = [...competitorProfiles];
                                updated[index].title = e.target.value;
                                setCompetitorProfiles(updated);
                              }}
                            />
                            <p className="text-xs text-muted-foreground">
                              {profile.title.length} characters
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Profile Description (Full)</Label>
                            <Textarea
                              placeholder="Paste the competitor's full profile description here..."
                              value={profile.description}
                              onChange={(e) => {
                                const updated = [...competitorProfiles];
                                updated[index].description = e.target.value;
                                setCompetitorProfiles(updated);
                              }}
                              rows={6}
                              className="text-sm"
                            />
                            <p className="text-xs text-muted-foreground">
                              {profile.description.length} characters
                            </p>
                          </div>
                          {index > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => {
                                setCompetitorProfiles(prev => prev.filter((_, i) => i !== index));
                                setExpandedCompetitors(prev => prev.filter(i => i !== index).map(i => i > index ? i - 1 : i));
                              }}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          )}
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
                
                {competitorProfiles.length < 3 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newIndex = competitorProfiles.length;
                      setCompetitorProfiles(prev => [...prev, { title: '', description: '' }]);
                      setExpandedCompetitors(prev => [...prev, newIndex]);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Competitor Profile ({competitorProfiles.length}/3)
                  </Button>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back to Niche Selection
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={!longTail1 || !longTail2 || isGenerating || !openaiApiKey}
                className="gradient-primary text-primary-foreground"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Optimized Profile
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Generated Content */}
      {step === 4 && generatedContent && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Keyword Strategy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 flex-wrap mb-4">
                  <Badge variant="default" className="px-4 py-2 text-sm">
                    🎯 {generatedContent.longTailKeyword1}
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-sm">
                    🎯 {generatedContent.longTailKeyword2}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{generatedContent.keywordStrategy}</p>
              </CardContent>
            </Card>

            <Tabs defaultValue="titles" className="w-full">
              <TabsList className="grid grid-cols-4 lg:grid-cols-8">
                <TabsTrigger value="titles">Titles</TabsTrigger>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="catalog">Catalog</TabsTrigger>
                <TabsTrigger value="experience" className="hidden lg:inline-flex">Experience</TabsTrigger>
                <TabsTrigger value="education" className="hidden lg:inline-flex">Education</TabsTrigger>
                <TabsTrigger value="topskills" className="hidden lg:inline-flex">Top Skills</TabsTrigger>
              </TabsList>

              <TabsContent value="titles">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Type className="h-5 w-5" />
                      Profile Title Suggestions
                    </CardTitle>
                    <CardDescription>
                      Maximum 70 characters for Upwork profile titles
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {generatedContent.profileTitles?.map((item, i) => (
                        <div key={i} className="p-3 bg-muted/50 rounded-lg border border-border/50">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="font-medium text-sm">{item.title}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant={item.charCount <= 70 ? "secondary" : "destructive"} className="text-xs">
                                {item.charCount}/70
                              </Badge>
                              <CopyButton text={item.title} field={`title-${i}`} />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{item.strategy}</p>
                        </div>
                      )) || (
                        <p className="text-muted-foreground text-sm">No profile titles generated</p>
                      )}
                    </div>

                    {/* Post-Implementation Guidance */}
                    <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/20">
                      <CardContent className="pt-4">
                        <div className="flex gap-3">
                          <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                          <div className="space-y-2">
                            <h4 className="font-medium text-amber-800 dark:text-amber-200">
                              Important: Changes Take Time
                            </h4>
                            <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                              <li>• <strong>Wait 14 days</strong> after updating your profile title to see ranking changes</li>
                              <li>• Upwork's algorithm needs time to re-index your profile</li>
                              <li>• <strong>Consistently update portfolio</strong> with new projects (aim for 1-2 per week)</li>
                              <li>• <strong>Add project catalog items</strong> to show productized services</li>
                              <li>• Keep applying to jobs with your new keywords to signal relevance</li>
                              <li>• Monitor your profile views in Upwork's analytics</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="description">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      5 Profile Variations
                    </CardTitle>
                    <CardDescription>
                      Each variation has a different angle - choose the one that fits your style best (max 5000 characters)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {generatedContent.profileVariations && generatedContent.profileVariations.length > 0 ? (
                      <Tabs value={selectedVariation} onValueChange={setSelectedVariation}>
                        <TabsList className="grid grid-cols-5 mb-4">
                          {generatedContent.profileVariations.map((v) => (
                            <TabsTrigger key={v.variationType} value={v.variationType} className="text-xs">
                              {v.variationType === 'story-first' && <Heart className="h-3 w-3 mr-1" />}
                              {v.variationType === 'results-first' && <Trophy className="h-3 w-3 mr-1" />}
                              {v.variationType === 'problem-solver' && <Wrench className="h-3 w-3 mr-1" />}
                              {v.variationType === 'technical-expert' && <Zap className="h-3 w-3 mr-1" />}
                              {v.variationType === 'friendly-consultant' && <MessageCircle className="h-3 w-3 mr-1" />}
                              {v.variationType.split('-')[0]}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        {generatedContent.profileVariations.map((variation) => (
                          <TabsContent key={variation.variationType} value={variation.variationType}>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">{variation.variationName}</h4>
                                  <p className="text-xs text-muted-foreground">{variation.variationDescription}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant={variation.charCount <= 5000 ? "secondary" : "destructive"}>
                                    {variation.charCount}/5000
                                  </Badge>
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <Star className="h-3 w-3" />
                                    {variation.score}/10
                                  </Badge>
                                  <CopyButton text={variation.profileDescription} field={`var-${variation.variationType}`} />
                                </div>
                              </div>
                              <ScrollArea className="h-[350px] border rounded-lg p-4">
                                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                  {variation.profileDescription}
                                </div>
                              </ScrollArea>
                              {variation.taskList && (
                                <div className="p-3 bg-muted/50 rounded-lg border">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-medium text-sm flex items-center gap-2">
                                      <ListChecks className="h-4 w-4" />
                                      Task List (Unique to this variation)
                                    </h5>
                                    <CopyButton text={variation.taskList} field={`task-${variation.variationType}`} />
                                  </div>
                                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{variation.taskList}</p>
                                </div>
                              )}
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{generatedContent.profileDescription.length}/5000</Badge>
                          <CopyButton text={generatedContent.profileDescription} field="description" />
                        </div>
                        <ScrollArea className="h-[400px]">
                          <div className="whitespace-pre-wrap text-sm leading-relaxed pr-4">
                            {generatedContent.profileDescription}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        Skills Tags
                      </CardTitle>
                      <CardDescription>
                        Recommended skills for your profile
                      </CardDescription>
                    </div>
                    <CopyButton text={generatedContent.skillsTags.join(', ')} field="skills" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {generatedContent.skillsTags.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="px-3 py-1.5">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="portfolio">
                <PortfolioContentGenerator
                  titles={generatedContent.portfolioTitles}
                  type="portfolio"
                  keywords={keywords}
                  openaiApiKey={openaiApiKey}
                />
              </TabsContent>

              <TabsContent value="catalog">
                <PortfolioContentGenerator
                  titles={generatedContent.projectCatalogTitles}
                  type="catalog"
                  keywords={keywords}
                  openaiApiKey={openaiApiKey}
                />
              </TabsContent>

              <TabsContent value="experience">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Experience Titles
                      </CardTitle>
                      <CardDescription>
                        Job titles for your experience section
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {generatedContent.experienceTitles.map((title, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-sm">{title}</span>
                          <CopyButton text={title} field={`exp-${i}`} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Education Titles
                      </CardTitle>
                      <CardDescription>
                        Titles for certifications and education
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {generatedContent.educationTitles.map((title, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-sm">{title}</span>
                          <CopyButton text={title} field={`edu-${i}`} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="topskills">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Top Skills (Bold for Upwork)
                      </CardTitle>
                      <CardDescription>
                        {generatedContent.topSkillsBold.length}/233 characters - Copy and paste to Upwork (bold will work!)
                      </CardDescription>
                    </div>
                    <CopyButton text={generatedContent.topSkillsBold} field="topskills" />
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-muted/50 rounded-lg border">
                      <p className="text-sm whitespace-pre-wrap font-medium">
                        {generatedContent.topSkillsBold}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      ℹ️ This text uses Unicode bold characters that render as bold when pasted on Upwork
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Competitor Analysis Results */}
            {generatedContent.competitorAnalysis && (
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Competitor Comparison Analysis
                  </CardTitle>
                  <CardDescription>
                    How your generated profile compares to competitors
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Score Comparison Table */}
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Profile</TableHead>
                          <TableHead className="text-center">Title Score</TableHead>
                          <TableHead className="text-center">Description Score</TableHead>
                          <TableHead className="text-center">Overall</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {generatedContent.competitorAnalysis.profiles.map((comp, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                Competitor {comp.competitorNumber}
                              </div>
                              {comp.title && (
                                <p className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">
                                  {comp.title}
                                </p>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant={comp.titleScore >= 7 ? "default" : comp.titleScore >= 5 ? "secondary" : "outline"}>
                                {comp.titleScore}/10
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant={comp.descriptionScore >= 7 ? "default" : comp.descriptionScore >= 5 ? "secondary" : "outline"}>
                                {comp.descriptionScore}/10
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant={comp.overallScore >= 7 ? "default" : comp.overallScore >= 5 ? "secondary" : "outline"}>
                                {comp.overallScore}/10
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-green-50 dark:bg-green-900/20">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                              <Zap className="h-4 w-4" />
                              Your Generated Profile
                            </div>
                          </TableCell>
                          <TableCell className="text-center" colSpan={2}>—</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-green-600 hover:bg-green-700">
                              {generatedContent.competitorAnalysis.ourProfileScore}/10
                            </Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Competitor Strengths & Weaknesses */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {generatedContent.competitorAnalysis.profiles.map((comp, i) => (
                      <Card key={i} className="border-border/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Competitor {comp.competitorNumber} Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">Strengths:</p>
                            <ul className="text-xs text-muted-foreground space-y-0.5">
                              {comp.strengths.map((s, j) => (
                                <li key={j} className="flex items-start gap-1">
                                  <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">Weaknesses:</p>
                            <ul className="text-xs text-muted-foreground space-y-0.5">
                              {comp.weaknesses.map((w, j) => (
                                <li key={j} className="flex items-start gap-1">
                                  <X className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                                  {w}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-medium mb-1">Primary Keywords:</p>
                            <div className="flex flex-wrap gap-1">
                              {comp.primaryKeywords.map((kw, j) => (
                                <Badge key={j} variant="outline" className="text-[10px] px-1.5 py-0">
                                  {kw}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Our Advantages */}
                  <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2 text-green-700 dark:text-green-400">
                        <Award className="h-5 w-5" />
                        Your Profile Advantages
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <ul className="space-y-2">
                        {generatedContent.competitorAnalysis.advantagesOverCompetitors.map((adv, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            {adv}
                          </li>
                        ))}
                      </ul>
                      
                      <div className="pt-2 border-t">
                        <p className="text-xs font-medium mb-2">Your Primary Keywords:</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {generatedContent.competitorAnalysis.ourPrimaryKeywords.map((kw, i) => (
                            <Badge key={i} variant="default" className="text-xs">
                              {kw}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs font-medium mb-2">Your Secondary Keywords:</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {generatedContent.competitorAnalysis.ourSecondaryKeywords.map((kw, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {kw}
                            </Badge>
                          ))}
                        </div>
                        {generatedContent.competitorAnalysis.keywordCoverage?.wordpressTerms && (
                          <>
                            <p className="text-xs font-medium mb-2">WordPress Terms Included:</p>
                            <div className="flex flex-wrap gap-1">
                              {generatedContent.competitorAnalysis.keywordCoverage.wordpressTerms.map((term, i) => (
                                <Badge key={i} variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20">
                                  {term}
                                </Badge>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            )}

            {/* Extra Profile Sections */}
            {generatedContent.profileSections && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ListChecks className="h-5 w-5" />
                    Extra Profile Sections
                  </CardTitle>
                  <CardDescription>
                    Ready-to-use content for your Upwork profile sections
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Case Studies */}
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      Case Studies
                    </h4>
                    {generatedContent.profileSections.caseStudies.map((cs, i) => (
                      <div key={i} className="p-3 bg-muted/50 rounded-lg border">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm">{cs.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{cs.summary}</p>
                          </div>
                          <CopyButton text={`${cs.title}\n${cs.summary}`} field={`cs-${i}`} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Job Experience */}
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                      Job Experience
                    </h4>
                    {generatedContent.profileSections.jobExperience.map((exp, i) => (
                      <div key={i} className="p-3 bg-muted/50 rounded-lg border">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm">{exp.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{exp.summary}</p>
                          </div>
                          <CopyButton text={`${exp.title}\n${exp.summary}`} field={`exp-sec-${i}`} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Education */}
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      Education & Certifications
                    </h4>
                    {generatedContent.profileSections.education.map((edu, i) => (
                      <div key={i} className="p-3 bg-muted/50 rounded-lg border">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm">{edu.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{edu.summary}</p>
                          </div>
                          <CopyButton text={`${edu.title}\n${edu.summary}`} field={`edu-sec-${i}`} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Skill Bullet Points */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium flex items-center gap-2">
                        <Tag className="h-4 w-4 text-primary" />
                        Skill Bullet Points
                      </h4>
                      <CopyButton 
                        text={generatedContent.profileSections.skillBulletPoints.join('\n')} 
                        field="skill-bullets" 
                      />
                    </div>
                    <div className="space-y-2">
                      {generatedContent.profileSections.skillBulletPoints.map((bullet, i) => (
                        <div key={i} className="flex items-start justify-between p-2 bg-muted/50 rounded-lg">
                          <span className="text-sm">{bullet}</span>
                          <CopyButton text={bullet} field={`bullet-${i}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-start">
              <Button variant="outline" onClick={() => {
                setStep(1);
                setClusteringResult(null);
                setSelectedCluster(null);
              }}>
                Start Over with New Keywords
              </Button>
            </div>
          </div>

          {/* Saved Versions Sidebar */}
          <div className="lg:col-span-1">
            <SavedVersionsPanel
              versions={versions}
              isLoading={isLoadingVersions}
              isSaving={isSaving}
              generatedContent={generatedContent}
              keywords={keywords}
              onSave={saveVersion}
              onDelete={deleteVersion}
              onSetActive={setActiveVersion}
              onLoad={handleLoadVersion}
            />
          </div>
        </div>
      )}
    </div>
  );
}
