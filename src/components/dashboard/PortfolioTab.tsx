'use client'
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PortfolioItemCard } from './PortfolioItemCard';
import { PortfolioItemDialog } from './PortfolioItemDialog';
import { Plus, Link, FileText, Image, Loader2, Briefcase } from 'lucide-react';

export interface PortfolioItem {
  id: string;
  user_id: string;
  profile_id: string | null;
  title: string;
  description: string | null;
  item_type: 'link' | 'document' | 'image';
  url: string | null;
  file_path: string | null;
  thumbnail_url: string | null;
  case_study_title: string | null;
  case_study_description: string | null;
  skills_demonstrated: string[];
  project_outcome: string | null;
  metrics: Record<string, unknown>;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export function PortfolioTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const fetchItems = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('user_id', user.id)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = (data || []).map(item => ({
        ...item,
        skills_demonstrated: Array.isArray(item.skills_demonstrated) 
          ? item.skills_demonstrated 
          : [],
        metrics: typeof item.metrics === 'object' && item.metrics !== null
          ? item.metrics
          : {}
      })) as PortfolioItem[];
      
      setItems(transformedData);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load portfolio items',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      const item = items.find(i => i.id === id);
      
      // Delete file from storage if exists
      if (item?.file_path) {
        await supabase.storage.from('portfolio-files').remove([item.file_path]);
      }

      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems(items.filter(i => i.id !== id));
      toast({
        title: 'Item deleted',
        description: 'Portfolio item has been removed',
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete portfolio item',
        variant: 'destructive',
      });
    }
  };

  const handleRegenerateCaseStudy = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    setIsGenerating(id);
    try {
      const { data, error } = await supabase.functions.invoke('generate-case-study', {
        body: { 
          portfolioItemId: id,
          title: item.title,
          description: item.description,
          url: item.url,
          itemType: item.item_type
        }
      });

      if (error) throw error;

      // Update the item with new case study
      const { error: updateError } = await supabase
        .from('portfolio_items')
        .update({
          case_study_title: data.caseStudyTitle,
          case_study_description: data.caseStudyDescription,
          skills_demonstrated: data.skillsDemonstrated,
          project_outcome: data.projectOutcome,
        })
        .eq('id', id);

      if (updateError) throw updateError;

      await fetchItems();
      toast({
        title: 'Case study regenerated',
        description: 'AI has updated the case study content',
      });
    } catch (error) {
      console.error('Error regenerating case study:', error);
      toast({
        title: 'Error',
        description: 'Failed to regenerate case study',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('portfolio_items')
        .update({ is_featured: isFeatured })
        .eq('id', id);

      if (error) throw error;

      setItems(items.map(item => 
        item.id === id ? { ...item, is_featured: isFeatured } : item
      ));
    } catch (error) {
      console.error('Error updating featured status:', error);
    }
  };

  const filteredItems = items.filter(item => {
    if (activeTab === 'all') return true;
    return item.item_type === activeTab;
  });

  const stats = {
    total: items.length,
    links: items.filter(i => i.item_type === 'link').length,
    documents: items.filter(i => i.item_type === 'document').length,
    images: items.filter(i => i.item_type === 'image').length,
    featured: items.filter(i => i.is_featured).length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground">
            Add your work samples and AI will generate case studies automatically
          </p>
        </div>
        <Button onClick={() => {
          setEditingItem(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Portfolio Item
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
            <p className="text-xs text-muted-foreground">Total Items</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Link className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold">{stats.links}</span>
            </div>
            <p className="text-xs text-muted-foreground">Links</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-orange-500" />
              <span className="text-2xl font-bold">{stats.documents}</span>
            </div>
            <p className="text-xs text-muted-foreground">Documents</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Image className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold">{stats.images}</span>
            </div>
            <p className="text-xs text-muted-foreground">Images</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">★</span>
              <span className="text-2xl font-bold">{stats.featured}</span>
            </div>
            <p className="text-xs text-muted-foreground">Featured</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="link">Links ({stats.links})</TabsTrigger>
          <TabsTrigger value="document">Documents ({stats.documents})</TabsTrigger>
          <TabsTrigger value="image">Images ({stats.images})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredItems.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No portfolio items yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Add links to your work, upload documents, or images.<br />
                  AI will automatically generate case studies for each item.
                </p>
                <Button onClick={() => {
                  setEditingItem(null);
                  setIsDialogOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Item
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map(item => (
                <PortfolioItemCard
                  key={item.id}
                  item={item}
                  onEdit={() => {
                    setEditingItem(item);
                    setIsDialogOpen(true);
                  }}
                  onDelete={() => handleDelete(item.id)}
                  onRegenerateCaseStudy={() => handleRegenerateCaseStudy(item.id)}
                  onToggleFeatured={(featured) => handleToggleFeatured(item.id, featured)}
                  isGenerating={isGenerating === item.id}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <PortfolioItemDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingItem={editingItem}
        onSuccess={() => {
          fetchItems();
          setIsDialogOpen(false);
          setEditingItem(null);
        }}
      />
    </div>
  );
}
