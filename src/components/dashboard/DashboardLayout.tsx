'use client'
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Briefcase,
  User,
  Settings,
  LogOut,
  Plus,
  Menu,
  X,
  Zap,
  ChevronLeft,
  FileText,
  Sparkles,
  FolderOpen,
  Target,
  Gift,
  X as XIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { id: 'jobs', label: 'My Jobs', icon: Briefcase, path: '/dashboard' },
  { id: 'portfolio', label: 'Portfolio', icon: FolderOpen, path: '/dashboard/portfolio' },
  { id: 'profile-seo', label: 'Profile SEO', icon: Target, path: '/dashboard/profile-seo' },
  { id: 'ai-templates', label: 'AI Templates', icon: Sparkles, path: '/dashboard/ai-templates' },
  { id: 'templates', label: 'Proposal Templates', icon: FileText, path: '/dashboard/templates' },
  { id: 'profiles', label: 'Profiles', icon: User, path: '/dashboard/profiles' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFreeBanner, setShowFreeBanner] = useState(false);
  const { signOut, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // 60-day free period: Apr 27 2026 → Jun 26 2026
  const FREE_UNTIL = new Date('2026-06-26');
  const daysLeft = Math.max(0, Math.ceil((FREE_UNTIL.getTime() - Date.now()) / 86400000));

  useEffect(() => {
    const dismissed = localStorage.getItem('free_banner_dismissed');
    if (!dismissed && daysLeft > 0) setShowFreeBanner(true);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/dashboard/';
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col border-r border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300',
          isSidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        {/* Logo */}
        <div className="h-16 border-b border-border/50 flex items-center justify-between px-4">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg gradient-primary">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-sm">Ultimate Freelancers</span>
            </div>
          ) : (
            <div className="p-1.5 rounded-lg gradient-primary mx-auto">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <ChevronLeft
              className={cn(
                'h-4 w-4 transition-transform',
                !isSidebarOpen && 'rotate-180'
              )}
            />
          </Button>
        </div>

        {/* New Job Button */}
        <div className="p-3">
          <Button
            onClick={() => router.push('/dashboard/new-job')}
            className={cn(
              'w-full gradient-primary text-primary-foreground btn-glow',
              !isSidebarOpen && 'p-2'
            )}
          >
            <Plus className="h-4 w-4" />
            {isSidebarOpen && <span className="ml-2">New Proposal</span>}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={isActive(item.path) ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start',
                !isSidebarOpen && 'justify-center px-2',
                isActive(item.path) && 'bg-primary/10 text-primary'
              )}
              onClick={() => router.push(item.path)}
            >
              <item.icon className="h-4 w-4" />
              {isSidebarOpen && <span className="ml-2">{item.label}</span>}
            </Button>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-border/50">
          {isSidebarOpen && (
            <p className="text-xs text-muted-foreground mb-2 truncate px-2">
              {user?.email}
            </p>
          )}
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start text-muted-foreground hover:text-destructive',
              !isSidebarOpen && 'justify-center px-2'
            )}
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            {isSidebarOpen && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-sm border-b border-border/50 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg gradient-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm">Ultimate Freelancers</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm pt-16">
          <div className="p-4 space-y-2">
            <Button
              onClick={() => {
                router.push('/dashboard/new-job');
                setIsMobileMenuOpen(false);
              }}
              className="w-full gradient-primary text-primary-foreground btn-glow mb-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Proposal
            </Button>
            
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={isActive(item.path) ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  isActive(item.path) && 'bg-primary/10 text-primary'
                )}
                onClick={() => {
                  router.push(item.path);
                  setIsMobileMenuOpen(false);
                }}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            ))}

            <div className="pt-4 border-t border-border/50 mt-4">
              <p className="text-xs text-muted-foreground mb-2 px-2">
                {user?.email}
              </p>
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:pt-0 pt-16 overflow-auto flex flex-col">
        {/* 60-day free banner */}
        {showFreeBanner && (
          <div className="bg-gradient-to-r from-violet-600 to-primary text-white px-4 py-2.5 flex items-center justify-between gap-3 text-sm shrink-0">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 shrink-0" />
              <span className="font-medium">Everything is free for {daysLeft} more days</span>
              <span className="hidden sm:inline text-white/80">. No payment needed. Just add your own API key in Settings to generate proposals.</span>
            </div>
            <button
              onClick={() => {
                setShowFreeBanner(false);
                localStorage.setItem('free_banner_dismissed', '1');
              }}
              className="text-white/70 hover:text-white shrink-0"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
