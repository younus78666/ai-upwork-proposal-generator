'use client'
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, X, Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/types/database';

interface ProfileFormData {
  title: string;
  overview: string;
  skills: string[];
  hourly_rate: number | null;
  experience: string;
  portfolio_links: string[];
  availability: string;
  is_default: boolean;
  portfolio_website: string;
  display_name: string;
}

interface ProfileFormProps {
  profile?: UserProfile | null;
  onClose: () => void;
  onSave: () => void;
}

const availabilityOptions = [
  'Full-time',
  'Part-time',
  'As needed',
  'Hourly',
  'Contract',
];

export function ProfileForm({ profile, onClose, onSave }: ProfileFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [portfolioInput, setPortfolioInput] = useState('');

  // Type guard for extended profile with new fields
  const extendedProfile = profile as (UserProfile & { portfolio_website?: string; display_name?: string }) | null | undefined;

  const [formData, setFormData] = useState<ProfileFormData>({
    title: profile?.title || '',
    overview: profile?.overview || '',
    skills: profile?.skills || [],
    hourly_rate: profile?.hourly_rate || null,
    experience: profile?.experience || '',
    portfolio_links: profile?.portfolio_links || [],
    availability: profile?.availability || 'As needed',
    is_default: profile?.is_default || false,
    portfolio_website: extendedProfile?.portfolio_website || '',
    display_name: extendedProfile?.display_name || '',
  });

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const handleAddPortfolioLink = () => {
    if (portfolioInput.trim() && !formData.portfolio_links.includes(portfolioInput.trim())) {
      setFormData({
        ...formData,
        portfolio_links: [...formData.portfolio_links, portfolioInput.trim()],
      });
      setPortfolioInput('');
    }
  };

  const handleRemovePortfolioLink = (link: string) => {
    setFormData({
      ...formData,
      portfolio_links: formData.portfolio_links.filter((l) => l !== link),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a profile title',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      if (formData.is_default) {
        // Unset all other defaults
        await supabase
          .from('profiles')
          .update({ is_default: false })
          .eq('user_id', user!.id);
      }

      const profileData = {
        user_id: user!.id,
        title: formData.title,
        overview: formData.overview || null,
        skills: formData.skills,
        hourly_rate: formData.hourly_rate,
        experience: formData.experience || null,
        portfolio_links: formData.portfolio_links,
        availability: formData.availability,
        is_default: formData.is_default,
        portfolio_website: formData.portfolio_website || null,
        display_name: formData.display_name || null,
      };

      if (profile) {
        // Update existing
        const { error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', profile.id);

        if (error) throw error;

        toast({
          title: 'Profile updated',
          description: 'Your profile has been saved',
        });
      } else {
        // Create new
        const { error } = await supabase.from('profiles').insert(profileData);

        if (error) throw error;

        toast({
          title: 'Profile created',
          description: 'Your new profile has been added',
        });
      }

      onSave();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>{profile ? 'Edit Profile' : 'Create Profile'}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              placeholder="e.g., John Smith"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Your name as it appears in proposals (e.g., "Best, John")
            </p>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Profile Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Senior React Developer"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              This appears as your professional title in proposals
            </p>
          </div>

          {/* Portfolio Website */}
          <div className="space-y-2">
            <Label htmlFor="portfolio_website">Portfolio Website URL</Label>
            <Input
              id="portfolio_website"
              type="url"
              placeholder="https://yourportfolio.com"
              value={formData.portfolio_website}
              onChange={(e) => setFormData({ ...formData, portfolio_website: e.target.value })}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Your main portfolio URL. This will be included in generated proposals.
            </p>
          </div>

          {/* Overview */}
          <div className="space-y-2">
            <Label htmlFor="overview">Professional Overview</Label>
            <Textarea
              id="overview"
              placeholder="Describe your expertise, background, and what makes you stand out..."
              value={formData.overview}
              onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
              disabled={isLoading}
              rows={4}
            />
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddSkill}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill, idx) => (
                  <Badge key={idx} variant="secondary" className="pl-2 pr-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Hourly Rate & Availability */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
              <Input
                id="hourly_rate"
                type="number"
                placeholder="e.g., 75"
                value={formData.hourly_rate || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hourly_rate: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label>Availability</Label>
              <Select
                value={formData.availability}
                onValueChange={(value) =>
                  setFormData({ ...formData, availability: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availabilityOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label htmlFor="experience">Experience & Achievements</Label>
            <Textarea
              id="experience"
              placeholder="Describe your relevant experience, past projects, and notable achievements..."
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              disabled={isLoading}
              rows={4}
            />
          </div>

          {/* Portfolio Links */}
          <div className="space-y-2">
            <Label>Portfolio Links</Label>
            <div className="flex gap-2">
              <Input
                placeholder="https://..."
                value={portfolioInput}
                onChange={(e) => setPortfolioInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPortfolioLink();
                  }
                }}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddPortfolioLink}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.portfolio_links.length > 0 && (
              <div className="space-y-1 mt-2">
                {formData.portfolio_links.map((link, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-sm bg-muted rounded-md px-2 py-1"
                  >
                    <span className="flex-1 truncate">{link}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePortfolioLink(link)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Default Profile */}
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="is_default">Set as default profile</Label>
              <p className="text-xs text-muted-foreground">
                This profile will be pre-selected when creating new proposals
              </p>
            </div>
            <Switch
              id="is_default"
              checked={formData.is_default}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_default: checked })
              }
              disabled={isLoading}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="gradient-primary text-primary-foreground btn-glow"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
