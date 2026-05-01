'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Filter, Save } from 'lucide-react';

interface UpworkFiltersData {
  id?: string;
  min_budget: number | null;
  max_budget: number | null;
  min_client_rating: number | null;
  payment_verified_only: boolean;
  job_types: string[];
  auto_generate_proposals: boolean;
  is_active: boolean;
  keywords_include: string[];
  keywords_exclude: string[];
}

const defaultFilters: UpworkFiltersData = {
  min_budget: null,
  max_budget: null,
  min_client_rating: null,
  payment_verified_only: false,
  job_types: ['fixed', 'hourly'],
  auto_generate_proposals: true,
  is_active: true,
  keywords_include: [],
  keywords_exclude: [],
};

export function UpworkFilters() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [filters, setFilters] = useState<UpworkFiltersData>(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [keywordsIncludeText, setKeywordsIncludeText] = useState('');
  const [keywordsExcludeText, setKeywordsExcludeText] = useState('');

  useEffect(() => {
    if (user) {
      fetchFilters();
    }
  }, [user]);

  const fetchFilters = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('upwork_filters')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const keywordsInc = (data as any).keywords_include || [];
        const keywordsExc = (data as any).keywords_exclude || [];
        
        setFilters({
          id: data.id,
          min_budget: data.min_budget,
          max_budget: data.max_budget,
          min_client_rating: data.min_client_rating,
          payment_verified_only: data.payment_verified_only,
          job_types: data.job_types || ['fixed', 'hourly'],
          auto_generate_proposals: data.auto_generate_proposals,
          is_active: data.is_active,
          keywords_include: keywordsInc,
          keywords_exclude: keywordsExc,
        });
        setKeywordsIncludeText(keywordsInc.join(', '));
        setKeywordsExcludeText(keywordsExc.join(', '));
      }
    } catch (error) {
      console.error('Error fetching Upwork filters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const parseKeywords = (text: string): string[] => {
    return text
      .split(',')
      .map((k) => k.trim().toLowerCase())
      .filter((k) => k.length > 0);
  };

  const handleSave = async () => {
    if (!user) return;

    const keywordsInclude = parseKeywords(keywordsIncludeText);
    const keywordsExclude = parseKeywords(keywordsExcludeText);

    setIsSaving(true);
    try {
      if (filters.id) {
        // Update existing filters
        const { error } = await supabase
          .from('upwork_filters')
          .update({
            min_budget: filters.min_budget,
            max_budget: filters.max_budget,
            min_client_rating: filters.min_client_rating,
            payment_verified_only: filters.payment_verified_only,
            job_types: filters.job_types,
            auto_generate_proposals: filters.auto_generate_proposals,
            is_active: filters.is_active,
            keywords_include: keywordsInclude,
            keywords_exclude: keywordsExclude,
            updated_at: new Date().toISOString(),
          } as any)
          .eq('id', filters.id);

        if (error) throw error;
      } else {
        // Create new filters
        const { data, error } = await supabase
          .from('upwork_filters')
          .insert({
            user_id: user.id,
            min_budget: filters.min_budget,
            max_budget: filters.max_budget,
            min_client_rating: filters.min_client_rating,
            payment_verified_only: filters.payment_verified_only,
            job_types: filters.job_types,
            auto_generate_proposals: filters.auto_generate_proposals,
            is_active: filters.is_active,
            keywords_include: keywordsInclude,
            keywords_exclude: keywordsExclude,
          } as any)
          .select()
          .single();

        if (error) throw error;
        setFilters((prev) => ({ ...prev, id: data.id }));
      }

      setFilters((prev) => ({
        ...prev,
        keywords_include: keywordsInclude,
        keywords_exclude: keywordsExclude,
      }));

      toast({
        title: 'Filters Saved',
        description: 'Your Upwork job filters have been updated.',
      });
    } catch (error) {
      console.error('Error saving filters:', error);
      toast({
        title: 'Error',
        description: 'Failed to save filters.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleJobTypeChange = (type: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      job_types: checked
        ? [...prev.job_types, type]
        : prev.job_types.filter((t) => t !== type),
    }));
  };

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <CardTitle>Job Filters</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="filters-active" className="text-sm text-muted-foreground">
              Active
            </Label>
            <Switch
              id="filters-active"
              checked={filters.is_active}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, is_active: checked }))
              }
            />
          </div>
        </div>
        <CardDescription>
          Filter incoming Upwork jobs by keywords, budget, client rating, and job type
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Keywords Include */}
        <div className="space-y-2">
          <Label htmlFor="keywords-include" className="text-sm font-medium">
            Include Keywords
          </Label>
          <Textarea
            id="keywords-include"
            placeholder="react, typescript, frontend (comma-separated)"
            value={keywordsIncludeText}
            onChange={(e) => setKeywordsIncludeText(e.target.value)}
            className="h-20"
          />
          <p className="text-xs text-muted-foreground">
            Only show jobs containing at least one of these keywords in title or description
          </p>
        </div>

        {/* Keywords Exclude */}
        <div className="space-y-2">
          <Label htmlFor="keywords-exclude" className="text-sm font-medium">
            Exclude Keywords
          </Label>
          <Textarea
            id="keywords-exclude"
            placeholder="wordpress, php, magento (comma-separated)"
            value={keywordsExcludeText}
            onChange={(e) => setKeywordsExcludeText(e.target.value)}
            className="h-20"
          />
          <p className="text-xs text-muted-foreground">
            Skip jobs containing any of these keywords
          </p>
        </div>

        {/* Budget Range */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Budget Range</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-budget" className="text-xs text-muted-foreground">
                Minimum ($)
              </Label>
              <Input
                id="min-budget"
                type="number"
                placeholder="No minimum"
                value={filters.min_budget ?? ''}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    min_budget: e.target.value ? Number(e.target.value) : null,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-budget" className="text-xs text-muted-foreground">
                Maximum ($)
              </Label>
              <Input
                id="max-budget"
                type="number"
                placeholder="No maximum"
                value={filters.max_budget ?? ''}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    max_budget: e.target.value ? Number(e.target.value) : null,
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* Client Rating */}
        <div className="space-y-2">
          <Label htmlFor="min-rating" className="text-sm font-medium">
            Minimum Client Rating
          </Label>
          <Input
            id="min-rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            placeholder="No minimum (0-5)"
            value={filters.min_client_rating ?? ''}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                min_client_rating: e.target.value ? Number(e.target.value) : null,
              }))
            }
          />
        </div>

        {/* Job Types */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Job Types</Label>
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="job-type-fixed"
                checked={filters.job_types.includes('fixed')}
                onCheckedChange={(checked) =>
                  handleJobTypeChange('fixed', checked as boolean)
                }
              />
              <Label htmlFor="job-type-fixed" className="text-sm">
                Fixed Price
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="job-type-hourly"
                checked={filters.job_types.includes('hourly')}
                onCheckedChange={(checked) =>
                  handleJobTypeChange('hourly', checked as boolean)
                }
              />
              <Label htmlFor="job-type-hourly" className="text-sm">
                Hourly
              </Label>
            </div>
          </div>
        </div>

        {/* Payment Verified */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">Payment Verified Only</Label>
            <p className="text-xs text-muted-foreground">
              Only show jobs from clients with verified payment
            </p>
          </div>
          <Switch
            checked={filters.payment_verified_only}
            onCheckedChange={(checked) =>
              setFilters((prev) => ({ ...prev, payment_verified_only: checked }))
            }
          />
        </div>

        {/* Auto Generate Proposals */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">Auto-Generate Proposals</Label>
            <p className="text-xs text-muted-foreground">
              Automatically generate proposal drafts for matching jobs
            </p>
          </div>
          <Switch
            checked={filters.auto_generate_proposals}
            onCheckedChange={(checked) =>
              setFilters((prev) => ({ ...prev, auto_generate_proposals: checked }))
            }
          />
        </div>

        {/* Save Button */}
        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Filters
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
