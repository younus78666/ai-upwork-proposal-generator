'use client'
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Loader2,
  RefreshCw,
  DollarSign,
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  Users,
  Briefcase,
  FileText,
  Tag,
} from 'lucide-react';

interface ScrapedJobData {
  isAvailable: boolean;
  title?: string;
  description?: string;
  budget?: string;
  jobType?: string;
  experienceLevel?: string;
  duration?: string;
  clientCountry?: string;
  clientPaymentVerified?: boolean;
  clientRating?: number;
  clientTotalSpent?: string;
  clientHires?: number;
  skills?: string[];
  proposalsCount?: string;
  projectLength?: string;
  clientJobsPosted?: number;
}

interface JobDescriptionCardProps {
  jobId: string;
  description: string | null;
  jobLink: string | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  jobType?: string | null;
  clientName?: string | null;
  onJobUpdated?: () => void;
}

// Parse and clean email description
function cleanEmailDescription(rawDescription: string): {
  mainDescription: string;
  extractedData: {
    budget?: string;
    jobType?: string;
    skills?: string[];
    clientInfo?: string;
    postedDate?: string;
  };
} {
  let text = rawDescription;
  
  // Remove common email cruft
  const removePatterns = [
    /New job alert.*?Check it out.*?proposal!/gi,
    /Hi,?\s*\w+!?\s*This job looks like a match for you\./gi,
    /You received this email because.*$/gis,
    /If you no longer want to get these alerts.*$/gis,
    /Freelancer Plus members have access.*$/gis,
    /Notifications are sent based on.*$/gis,
    /Privacy Policy:.*$/gis,
    /Contact Support:.*$/gis,
    /©\s*\d{4}[-–]\d{4}\s*Upwork.*$/gi,
    /Upwork®?\s*Global\s*LLC.*$/gi,
    /\d+\s+Lytton Ave.*?CA\s*\d+/gi,
    /View job details:?\s*https?:\/\/[^\s]+/gi,
    /https:\/\/www\.upwork\.com\/ab\/notifications[^\s]*/gi,
    /https:\/\/www\.upwork\.com\/legal[^\s]*/gi,
    /https:\/\/support\.upwork\.com[^\s]*/gi,
  ];
  
  for (const pattern of removePatterns) {
    text = text.replace(pattern, '');
  }
  
  // Extract useful data before cleaning URLs
  const extractedData: {
    budget?: string;
    jobType?: string;
    skills?: string[];
    clientInfo?: string;
    postedDate?: string;
  } = {};
  
  // Extract budget
  const budgetMatch = text.match(/(?:Budget|Fixed)[:\s]*\$?([\d,]+)(?:\s*[-–]\s*\$?([\d,]+))?/i);
  if (budgetMatch) {
    extractedData.budget = budgetMatch[2] 
      ? `$${budgetMatch[1]} - $${budgetMatch[2]}`
      : `$${budgetMatch[1]}`;
  }
  
  // Extract job type
  if (text.match(/\b(Fixed|Fixed-price)\b/i)) {
    extractedData.jobType = 'Fixed Price';
  } else if (text.match(/\bHourly\b/i)) {
    extractedData.jobType = 'Hourly';
  }
  
  // Extract experience level
  const expMatch = text.match(/\b(Entry|Intermediate|Expert)\s*(Level)?/i);
  if (expMatch) {
    extractedData.clientInfo = expMatch[1] + ' Level';
  }
  
  // Extract skills (words followed by Upwork links are often skills)
  const skillMatches = text.match(/(\w[\w\s&.+-]{1,30}):\s*https:\/\/www\.upwork\.com\/jobs/gi);
  if (skillMatches) {
    extractedData.skills = skillMatches
      .map(s => s.split(':')[0].trim())
      .filter(s => s.length > 1 && s.length < 30);
  }
  
  // Extract posted date
  const dateMatch = text.match(/Posted on\s*(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})/i);
  if (dateMatch) {
    extractedData.postedDate = dateMatch[1];
  }
  
  // Remove all URLs
  text = text.replace(/https?:\/\/[^\s<>"{}|\\^`[\]]+/gi, '');
  
  // Remove URL parameters and fragments
  text = text.replace(/[?&][a-z_]+=[\w%.-]+/gi, '');
  
  // Remove common email tracking IDs
  text = text.replace(/\b[a-f0-9]{20,}\b/gi, '');
  text = text.replace(/mailgun-id%7[^\s]*/gi, '');
  text = text.replace(/frkscc=[^\s]*/gi, '');
  
  // Remove standalone symbols and numbers that are artifacts
  text = text.replace(/\+\d+:\s*/g, '');
  text = text.replace(/\bmore:\s*/gi, '');
  
  // Clean up formatting
  text = text.replace(/[-–]{3,}/g, '\n\n');
  text = text.replace(/\s{3,}/g, '\n\n');
  text = text.replace(/(\n\s*){3,}/g, '\n\n');
  text = text.trim();
  
  // Try to extract the main job description (after title, before footer)
  const descriptionStart = text.search(/(?:I'm looking|We are looking|Looking for|We need|Need|Seeking|Wanted)/i);
  if (descriptionStart > 0) {
    text = text.substring(descriptionStart);
  }
  
  return {
    mainDescription: text,
    extractedData,
  };
}

export function JobDescriptionCard({
  jobId,
  description,
  jobLink,
  budgetMin,
  budgetMax,
  jobType,
  clientName,
  onJobUpdated,
}: JobDescriptionCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapedJobData | null>(null);
  const [hasScraped, setHasScraped] = useState(false);

  // Auto-scrape on mount if job has a link
  useEffect(() => {
    if (jobLink && !hasScraped && !scrapedData) {
      handleScrapeJob();
    }
  }, [jobLink]);

  const handleScrapeJob = async () => {
    if (!jobLink) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('scrape-upwork-job', {
        body: { url: jobLink, job_id: jobId },
      });

      if (error) throw error;

      if (data) {
        setScrapedData(data);
        setHasScraped(true);
        
        // Update job in database with scraped description
        if (data.description && data.description.length > 100) {
          await supabase
            .from('jobs')
            .update({ 
              description: data.description,
              budget_min: data.budget ? parseInt(data.budget.replace(/[^\d]/g, '')) : budgetMin,
            })
            .eq('id', jobId);
          
          onJobUpdated?.();
        }
      }
    } catch (error) {
      console.error('Error scraping job:', error);
      // Don't show toast for auto-scrape failures
    } finally {
      setIsLoading(false);
    }
  };

  // Use scraped data or clean email description
  const displayData = scrapedData || (description ? cleanEmailDescription(description) : null);
  const cleanedDescription = scrapedData?.description || 
    (displayData && 'mainDescription' in displayData ? displayData.mainDescription : description);
  
  // Combine scraped data with existing data
  const displayBudget = scrapedData?.budget || 
    (budgetMin && budgetMax ? `$${budgetMin} - $${budgetMax}` : 
     budgetMin ? `$${budgetMin}` : 
     (displayData && 'extractedData' in displayData ? displayData.extractedData.budget : null));
  
  const displayJobType = scrapedData?.jobType || jobType || 
    (displayData && 'extractedData' in displayData ? displayData.extractedData.jobType : null);
  
  const displaySkills = scrapedData?.skills || 
    (displayData && 'extractedData' in displayData ? displayData.extractedData.skills : null);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Job Details
          </CardTitle>
          {jobLink && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleScrapeJob}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-1">{hasScraped ? 'Refresh' : 'Fetch Details'}</span>
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Quick Info Badges */}
        <div className="flex flex-wrap gap-2">
          {displayBudget && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {displayBudget}
            </Badge>
          )}
          {displayJobType && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              {displayJobType}
            </Badge>
          )}
          {scrapedData?.experienceLevel && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              {scrapedData.experienceLevel}
            </Badge>
          )}
          {scrapedData?.duration && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {scrapedData.duration}
            </Badge>
          )}
          {scrapedData?.proposalsCount && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {scrapedData.proposalsCount} proposals
            </Badge>
          )}
        </div>

        {/* Client Info */}
        {(scrapedData?.clientCountry || scrapedData?.clientRating || scrapedData?.clientPaymentVerified !== undefined) && (
          <>
            <Separator />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {scrapedData?.clientCountry && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{scrapedData.clientCountry}</span>
                </div>
              )}
              {scrapedData?.clientPaymentVerified && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Payment Verified</span>
                </div>
              )}
              {scrapedData?.clientRating && (
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{scrapedData.clientRating.toFixed(1)} rating</span>
                </div>
              )}
              {scrapedData?.clientTotalSpent && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>{scrapedData.clientTotalSpent} spent</span>
                </div>
              )}
              {scrapedData?.clientHires && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{scrapedData.clientHires} hires</span>
                </div>
              )}
              {scrapedData?.clientJobsPosted && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{scrapedData.clientJobsPosted} jobs posted</span>
                </div>
              )}
            </div>
          </>
        )}

        {/* Skills */}
        {displaySkills && displaySkills.length > 0 && (
          <>
            <Separator />
            <div>
              <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                <Tag className="h-4 w-4" />
                Skills Required
              </div>
              <div className="flex flex-wrap gap-2">
                {displaySkills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Description */}
        <Separator />
        <div>
          <h4 className="text-sm font-medium mb-2">Description</h4>
          {isLoading && !cleanedDescription ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Fetching complete job details...</span>
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                {cleanedDescription || 'No description available'}
              </div>
            </div>
          )}
        </div>

        {/* Scraped indicator */}
        {hasScraped && scrapedData && (
          <div className="text-xs text-muted-foreground flex items-center gap-1 pt-2">
            <CheckCircle2 className="h-3 w-3" />
            Details fetched from Upwork
          </div>
        )}
      </CardContent>
    </Card>
  );
}
