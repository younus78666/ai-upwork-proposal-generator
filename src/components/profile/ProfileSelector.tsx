'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Star, DollarSign } from 'lucide-react';

interface Profile {
  id: string;
  title: string;
  skills: string[];
  hourly_rate: number | null;
  is_default: boolean;
}

interface ProfileSelectorProps {
  selectedProfileId: string | null;
  onProfileSelect: (profileId: string | null, profile: Profile | null) => void;
}

export function ProfileSelector({ selectedProfileId, onProfileSelect }: ProfileSelectorProps) {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchProfiles = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, title, skills, hourly_rate, is_default')
        .eq('user_id', user.id)
        .order('order_index', { ascending: true });

      if (!error && data) {
        const parsedProfiles = data.map(p => ({
          ...p,
          skills: Array.isArray(p.skills) ? p.skills as string[] : []
        }));
        setProfiles(parsedProfiles);
        
        // Auto-select default profile if none selected
        if (!selectedProfileId) {
          const defaultProfile = parsedProfiles.find(p => p.is_default) || parsedProfiles[0];
          if (defaultProfile) {
            onProfileSelect(defaultProfile.id, defaultProfile);
          }
        }
      }
      setIsLoading(false);
    };

    fetchProfiles();
  }, [user, selectedProfileId, onProfileSelect]);

  const handleSelect = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId) || null;
    onProfileSelect(profileId, profile);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Your Profile</Label>
        <div className="h-12 bg-muted animate-pulse rounded-md" />
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="p-4 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-4 w-4" />
          <span className="text-sm">No profiles found. Create a profile first in your dashboard.</span>
        </div>
      </div>
    );
  }

  const selectedProfile = profiles.find(p => p.id === selectedProfileId);

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-foreground">
        Select Profile for This Job
      </Label>
      
      <Select value={selectedProfileId || ''} onValueChange={handleSelect}>
        <SelectTrigger className="w-full h-12">
          <SelectValue placeholder="Choose a profile..." />
        </SelectTrigger>
        <SelectContent>
          {profiles.map((profile) => (
            <SelectItem key={profile.id} value={profile.id}>
              <div className="flex items-center gap-2">
                <span>{profile.title}</span>
                {profile.is_default && (
                  <Badge variant="secondary" className="text-xs px-1.5">
                    <Star className="h-3 w-3 mr-0.5" />
                    Default
                  </Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Selected profile preview */}
      {selectedProfile && (
        <div className="p-3 bg-primary/5 rounded-lg border border-primary/10 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm">{selectedProfile.title}</span>
            {selectedProfile.hourly_rate && (
              <Badge variant="outline" className="text-xs">
                <DollarSign className="h-3 w-3 mr-0.5" />
                ${selectedProfile.hourly_rate}/hr
              </Badge>
            )}
          </div>
          {selectedProfile.skills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedProfile.skills.slice(0, 5).map((skill, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {selectedProfile.skills.length > 5 && (
                <Badge variant="secondary" className="text-xs">
                  +{selectedProfile.skills.length - 5} more
                </Badge>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
