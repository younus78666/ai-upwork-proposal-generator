'use client'
import { useEffect } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { JobsTab } from '@/components/dashboard/JobsTab';
import { ProfilesTab } from '@/components/dashboard/ProfilesTab';
import { PortfolioTab } from '@/components/dashboard/PortfolioTab';
import { ProfileSEOTab } from '@/components/dashboard/ProfileSEOTab';
import { SettingsTab } from '@/components/dashboard/SettingsTab';
import { NewJobTab } from '@/components/dashboard/NewJobTab';
import { JobDetailTab } from '@/components/dashboard/JobDetailTab';
import { JobChatTab } from '@/components/dashboard/JobChatTab';
import { JobGenerateTab } from '@/components/dashboard/JobGenerateTab';
import { TemplatesTab } from '@/components/dashboard/TemplatesTab';
import AITemplatesTab from '@/components/dashboard/AITemplatesTab';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams()
  const id = params?.id as string;

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Determine which tab to show based on the path
  const getTabContent = () => {
    const path = pathname;
    
    if (path === '/dashboard/profiles') {
      return (
        <div className="p-6">
          <ProfilesTab />
        </div>
      );
    }
    
    if (path === '/dashboard/portfolio') {
      return (
        <div className="p-6">
          <PortfolioTab />
        </div>
      );
    }
    
    if (path === '/dashboard/profile-seo') {
      return (
        <div className="p-6">
          <ProfileSEOTab />
        </div>
      );
    }
    
    if (path === '/dashboard/settings') {
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          <SettingsTab />
        </div>
      );
    }
    
    if (path === '/dashboard/templates') {
      return (
        <div className="p-6">
          <TemplatesTab />
        </div>
      );
    }
    
    if (path === '/dashboard/ai-templates') {
      return (
        <div className="p-6">
          <AITemplatesTab />
        </div>
      );
    }
    
    if (path === '/dashboard/new-job') {
      return (
        <div className="p-6">
          <NewJobTab />
        </div>
      );
    }
    
    if (path.match(/^\/dashboard\/job\/[^/]+\/chat$/)) {
      return (
        <div className="p-6">
          <JobChatTab />
        </div>
      );
    }
    
    if (path.match(/^\/dashboard\/job\/[^/]+\/generate$/)) {
      return (
        <div className="p-6">
          <JobGenerateTab />
        </div>
      );
    }
    
    if (path.match(/^\/dashboard\/job\/[^/]+$/)) {
      return (
        <div className="p-6">
          <JobDetailTab />
        </div>
      );
    }
    
    // Default: Jobs tab
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Jobs</h1>
        <JobsTab />
      </div>
    );
  };

  return <DashboardLayout>{getTabContent()}</DashboardLayout>;
}
