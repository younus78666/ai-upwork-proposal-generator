'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface PersonalInfo {
  education: string;
  workExperience: string;
  upworkStats: string;
  personalStory: string;
}

export function usePersonalInfo() {
  const { user } = useAuth();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    education: '',
    workExperience: '',
    upworkStats: '',
    personalStory: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadPersonalInfo();
    }
  }, [user]);

  const loadPersonalInfo = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_personal_info')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPersonalInfo({
          education: data.education || '',
          workExperience: data.work_experience || '',
          upworkStats: data.upwork_stats || '',
          personalStory: data.personal_story || ''
        });
      }
    } catch (error) {
      console.error('Error loading personal info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePersonalInfo = async (info: PersonalInfo) => {
    if (!user) {
      toast.error('Please login to save personal info');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('user_personal_info')
        .upsert({
          user_id: user.id,
          education: info.education,
          work_experience: info.workExperience,
          upwork_stats: info.upworkStats,
          personal_story: info.personalStory
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      setPersonalInfo(info);
      toast.success('Personal info saved!');
    } catch (error) {
      console.error('Error saving personal info:', error);
      toast.error('Failed to save personal info');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    personalInfo,
    setPersonalInfo,
    isLoading,
    isSaving,
    savePersonalInfo,
    loadPersonalInfo
  };
}
