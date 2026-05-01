'use client'
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Sparkles, Bookmark, Loader2 } from "lucide-react";
import { toast } from "sonner";
import AITemplateCard from "./AITemplateCard";
import AITemplateDialog from "./AITemplateDialog";

interface AITemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  platform: string;
  input_schema: any[];
  prompt_template: string;
  output_format: string;
  character_limit: number | null;
  credit_cost: number;
  icon: string;
  is_active: boolean;
}

const AITemplatesTab = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<AITemplate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch templates
  const { data: templates = [], isLoading: templatesLoading } = useQuery({
    queryKey: ['ai-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as AITemplate[];
    },
  });

  // Fetch bookmarks
  const { data: bookmarks = [] } = useQuery({
    queryKey: ['ai-template-bookmarks', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('ai_template_bookmarks')
        .select('template_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data.map(b => b.template_id);
    },
    enabled: !!user?.id,
  });

  // Toggle bookmark mutation
  const toggleBookmark = useMutation({
    mutationFn: async (templateId: string) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const isBookmarked = bookmarks.includes(templateId);
      
      if (isBookmarked) {
        const { error } = await supabase
          .from('ai_template_bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('template_id', templateId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('ai_template_bookmarks')
          .insert({ user_id: user.id, template_id: templateId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-template-bookmarks'] });
    },
    onError: (error) => {
      toast.error('Failed to update bookmark');
      console.error(error);
    },
  });

  // Filter templates based on search and tab
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'bookmarked') return matchesSearch && bookmarks.includes(template.id);
    return matchesSearch && template.platform === activeTab;
  });

  // Get unique platforms for tabs
  const platforms = [...new Set(templates.map(t => t.platform))];

  const handleOpenTemplate = (template: AITemplate) => {
    setSelectedTemplate(template);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTemplate(null);
  };

  if (templatesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Templates</h1>
            <p className="text-muted-foreground">
              Generate optimized content for freelance platforms with AI
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="all" className="capitalize">
            All Tools
          </TabsTrigger>
          <TabsTrigger value="bookmarked" className="capitalize">
            <Bookmark className="h-3 w-3 mr-1" />
            Saved
          </TabsTrigger>
          {platforms.map(platform => (
            <TabsTrigger key={platform} value={platform} className="capitalize">
              {platform}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {activeTab === 'bookmarked' 
            ? "No saved templates yet. Click the bookmark icon on any template to save it."
            : "No templates found matching your search."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map(template => (
            <AITemplateCard
              key={template.id}
              template={template}
              isBookmarked={bookmarks.includes(template.id)}
              onBookmark={() => toggleBookmark.mutate(template.id)}
              onGenerate={() => handleOpenTemplate(template)}
            />
          ))}
        </div>
      )}

      {/* Generation Dialog */}
      {selectedTemplate && (
        <AITemplateDialog
          template={selectedTemplate}
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
        />
      )}
    </div>
  );
};

export default AITemplatesTab;
