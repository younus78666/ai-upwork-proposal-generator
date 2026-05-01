'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Plus,
  Edit2,
  Trash2,
  Star,
  DollarSign,
  Clock,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProfileForm } from '@/components/profile/ProfileForm';
import type { UserProfile } from '@/types/database';

const MAX_PROFILES = 5;

export function ProfilesTab() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProfiles = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('order_index', { ascending: true });

      if (error) throw error;

      setProfiles(
        (data || []).map((p) => ({
          ...p,
          skills: (p.skills || []) as string[],
          portfolio_links: (p.portfolio_links || []) as string[],
        }))
      );
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profiles',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [user]);

  const handleDeleteProfile = async (profileId: string) => {
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', profileId);
      if (error) throw error;

      setProfiles(profiles.filter((p) => p.id !== profileId));
      toast({
        title: 'Profile deleted',
        description: 'The profile has been removed',
      });
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete profile',
        variant: 'destructive',
      });
    }
  };

  const handleSetDefault = async (profileId: string) => {
    try {
      // Unset all defaults first
      await supabase
        .from('profiles')
        .update({ is_default: false })
        .eq('user_id', user!.id);

      // Set new default
      const { error } = await supabase
        .from('profiles')
        .update({ is_default: true })
        .eq('id', profileId);

      if (error) throw error;

      setProfiles(
        profiles.map((p) => ({
          ...p,
          is_default: p.id === profileId,
        }))
      );

      toast({
        title: 'Default profile updated',
        description: 'This profile will be used by default for new proposals',
      });
    } catch (error) {
      console.error('Error setting default:', error);
      toast({
        title: 'Error',
        description: 'Failed to update default profile',
        variant: 'destructive',
      });
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProfile(null);
    fetchProfiles();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (showForm || editingProfile) {
    return (
      <ProfileForm
        profile={editingProfile}
        onClose={handleFormClose}
        onSave={handleFormClose}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Your Profiles</h2>
          <p className="text-sm text-muted-foreground">
            Create up to {MAX_PROFILES} different profiles for various job types
          </p>
        </div>
        {profiles.length < MAX_PROFILES && (
          <Button
            onClick={() => setShowForm(true)}
            className="gradient-primary text-primary-foreground btn-glow"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Profile
          </Button>
        )}
      </div>

      {/* Profiles Grid */}
      {profiles.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
            <User className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No profiles yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first profile to personalize your proposals
          </p>
          <Button
            onClick={() => setShowForm(true)}
            className="gradient-primary text-primary-foreground btn-glow"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Profile
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {profiles.map((profile) => (
            <Card
              key={profile.id}
              className={`border-border/50 transition-colors ${
                profile.is_default ? 'ring-2 ring-primary/50' : ''
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{profile.title}</CardTitle>
                      {profile.is_default && (
                        <Badge variant="default" className="bg-primary/20 text-primary text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Default
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!profile.is_default && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleSetDefault(profile.id)}
                        title="Set as default"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditingProfile(profile)}
                      title="Edit profile"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteProfile(profile.id)}
                      title="Delete profile"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.overview && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {profile.overview}
                  </p>
                )}

                <div className="flex flex-wrap gap-1">
                  {profile.skills.slice(0, 5).map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {profile.skills.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{profile.skills.length - 5}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {profile.hourly_rate && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5" />
                      <span>${profile.hourly_rate}/hr</span>
                    </div>
                  )}
                  {profile.availability && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{profile.availability}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {profiles.length >= MAX_PROFILES && (
        <p className="text-sm text-muted-foreground text-center">
          You've reached the maximum of {MAX_PROFILES} profiles
        </p>
      )}
    </div>
  );
}
