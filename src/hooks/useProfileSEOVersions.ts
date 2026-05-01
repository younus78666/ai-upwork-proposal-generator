'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ProfileSEOVersion {
  id: string;
  user_id: string;
  name: string;
  keywords: string[];
  long_tail_keyword_1: string;
  long_tail_keyword_2: string;
  profile_description: string;
  top_skills_bold: string | null;
  skills_tags: string[];
  portfolio_titles: string[];
  project_catalog_titles: string[];
  experience_titles: string[];
  education_titles: string[];
  keyword_strategy: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompetitorAnalysis {
  profiles: {
    competitorNumber: number;
    title: string;
    titleScore: number;
    descriptionScore: number;
    overallScore: number;
    primaryKeywords: string[];
    secondaryKeywords: string[];
    strengths: string[];
    weaknesses: string[];
  }[];
  ourProfileScore: number;
  ourPrimaryKeywords: string[];
  ourSecondaryKeywords: string[];
  advantagesOverCompetitors: string[];
  keywordCoverage: {
    wordpressTerms: string[];
  };
}

export interface ProfileSections {
  caseStudies: { title: string; summary: string }[];
  jobExperience: { title: string; summary: string }[];
  education: { title: string; summary: string }[];
  skillBulletPoints: string[];
}

export interface ProfileVariation {
  variationType: 'story-first' | 'results-first' | 'problem-solver' | 'technical-expert' | 'friendly-consultant';
  variationName: string;
  variationDescription: string;
  profileDescription: string;
  charCount: number;
  score: number;
  taskList: string;
}

export interface ProfileTitle {
  title: string;
  charCount: number;
  strategy: string;
}

export interface PersonalInfo {
  education?: string;
  experience?: string;
  upworkStats?: string;
  personalStory?: string;
}

export interface GeneratedContent {
  profileDescription: string;
  profileVariations?: ProfileVariation[];
  profileTitles?: ProfileTitle[];
  topSkillsBold: string;
  skillsTags: string[];
  portfolioTitles: string[];
  projectCatalogTitles: string[];
  experienceTitles: string[];
  educationTitles: string[];
  longTailKeyword1: string;
  longTailKeyword2: string;
  keywordStrategy: string;
  competitorAnalysis?: CompetitorAnalysis | null;
  profileSections?: ProfileSections | null;
}

export function useProfileSEOVersions() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [versions, setVersions] = useState<ProfileSEOVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchVersions = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profile_seo_versions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Parse JSONB fields
      const parsed = (data || []).map(v => ({
        ...v,
        keywords: v.keywords || [],
        skills_tags: Array.isArray(v.skills_tags) ? v.skills_tags : [],
        portfolio_titles: Array.isArray(v.portfolio_titles) ? v.portfolio_titles : [],
        project_catalog_titles: Array.isArray(v.project_catalog_titles) ? v.project_catalog_titles : [],
        experience_titles: Array.isArray(v.experience_titles) ? v.experience_titles : [],
        education_titles: Array.isArray(v.education_titles) ? v.education_titles : [],
      }));

      setVersions(parsed as ProfileSEOVersion[]);
    } catch (error) {
      console.error('Error fetching versions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load saved versions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveVersion = async (
    name: string,
    keywords: string[],
    content: GeneratedContent
  ): Promise<boolean> => {
    if (!user) return false;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profile_seo_versions')
        .insert({
          user_id: user.id,
          name,
          keywords,
          long_tail_keyword_1: content.longTailKeyword1,
          long_tail_keyword_2: content.longTailKeyword2,
          profile_description: content.profileDescription,
          top_skills_bold: content.topSkillsBold,
          skills_tags: content.skillsTags,
          portfolio_titles: content.portfolioTitles,
          project_catalog_titles: content.projectCatalogTitles,
          experience_titles: content.experienceTitles,
          education_titles: content.educationTitles,
          keyword_strategy: content.keywordStrategy,
        });

      if (error) throw error;

      toast({
        title: 'Version saved',
        description: `"${name}" has been saved`,
      });

      await fetchVersions();
      return true;
    } catch (error) {
      console.error('Error saving version:', error);
      toast({
        title: 'Error',
        description: 'Failed to save version',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteVersion = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('profile_seo_versions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Version deleted',
        description: 'The version has been removed',
      });

      await fetchVersions();
      return true;
    } catch (error) {
      console.error('Error deleting version:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete version',
        variant: 'destructive',
      });
      return false;
    }
  };

  const setActiveVersion = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // First, set all versions to inactive
      await supabase
        .from('profile_seo_versions')
        .update({ is_active: false })
        .eq('user_id', user.id);

      // Then set the selected version as active
      const { error } = await supabase
        .from('profile_seo_versions')
        .update({ is_active: true })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Active version updated',
        description: 'This version is now marked as active',
      });

      await fetchVersions();
      return true;
    } catch (error) {
      console.error('Error setting active version:', error);
      toast({
        title: 'Error',
        description: 'Failed to update active version',
        variant: 'destructive',
      });
      return false;
    }
  };

  const convertToGeneratedContent = (version: ProfileSEOVersion): GeneratedContent => ({
    profileDescription: version.profile_description,
    topSkillsBold: version.top_skills_bold || '',
    skillsTags: version.skills_tags,
    portfolioTitles: version.portfolio_titles,
    projectCatalogTitles: version.project_catalog_titles,
    experienceTitles: version.experience_titles,
    educationTitles: version.education_titles,
    longTailKeyword1: version.long_tail_keyword_1,
    longTailKeyword2: version.long_tail_keyword_2,
    keywordStrategy: version.keyword_strategy || '',
  });

  useEffect(() => {
    fetchVersions();
  }, [user]);

  return {
    versions,
    isLoading,
    isSaving,
    saveVersion,
    deleteVersion,
    setActiveVersion,
    convertToGeneratedContent,
    refetch: fetchVersions,
  };
}
