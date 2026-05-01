'use client'
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PortfolioItem } from './PortfolioTab';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Link, 
  FileText, 
  Image, 
  Loader2, 
  Upload,
  X
} from 'lucide-react';

interface PortfolioItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: PortfolioItem | null;
  onSuccess: () => void;
}

export function PortfolioItemDialog({
  open,
  onOpenChange,
  editingItem,
  onSuccess,
}: PortfolioItemDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [itemType, setItemType] = useState<'link' | 'document' | 'image'>('link');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [skills, setSkills] = useState('');

  useEffect(() => {
    if (editingItem) {
      setItemType(editingItem.item_type);
      setTitle(editingItem.title);
      setDescription(editingItem.description || '');
      setUrl(editingItem.url || '');
      setSkills(editingItem.skills_demonstrated?.join(', ') || '');
    } else {
      resetForm();
    }
  }, [editingItem, open]);

  const resetForm = () => {
    setItemType('link');
    setTitle('');
    setDescription('');
    setUrl('');
    setFile(null);
    setSkills('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const uploadFile = async (): Promise<string | null> => {
    if (!file || !user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('portfolio-files')
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    return fileName;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a title for this portfolio item',
        variant: 'destructive',
      });
      return;
    }

    if (itemType === 'link' && !url.trim()) {
      toast({
        title: 'URL required',
        description: 'Please enter a URL for this link',
        variant: 'destructive',
      });
      return;
    }

    if ((itemType === 'document' || itemType === 'image') && !file && !editingItem?.file_path) {
      toast({
        title: 'File required',
        description: 'Please upload a file',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      let filePath = editingItem?.file_path || null;
      
      // Upload new file if provided
      if (file) {
        // Delete old file if exists
        if (editingItem?.file_path) {
          await supabase.storage.from('portfolio-files').remove([editingItem.file_path]);
        }
        filePath = await uploadFile();
      }

      const skillsArray = skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const itemData = {
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        item_type: itemType,
        url: itemType === 'link' ? url.trim() : null,
        file_path: filePath,
        skills_demonstrated: skillsArray,
      };

      if (editingItem) {
        const { error } = await supabase
          .from('portfolio_items')
          .update(itemData)
          .eq('id', editingItem.id);

        if (error) throw error;

        toast({
          title: 'Item updated',
          description: 'Portfolio item has been updated',
        });
      } else {
        const { data: insertedItem, error } = await supabase
          .from('portfolio_items')
          .insert(itemData)
          .select()
          .single();

        if (error) throw error;

        toast({
          title: 'Item added',
          description: 'Portfolio item has been created. Generating case study...',
        });

        // Trigger AI case study generation in background
        if (insertedItem) {
          supabase.functions.invoke('generate-case-study', {
            body: {
              portfolioItemId: insertedItem.id,
              title: insertedItem.title,
              description: insertedItem.description,
              url: insertedItem.url,
              itemType: insertedItem.item_type,
            }
          }).then(async ({ data }) => {
            if (data) {
              await supabase
                .from('portfolio_items')
                .update({
                  case_study_title: data.caseStudyTitle,
                  case_study_description: data.caseStudyDescription,
                  skills_demonstrated: data.skillsDemonstrated,
                  project_outcome: data.projectOutcome,
                })
                .eq('id', insertedItem.id);
            }
          }).catch(err => {
            console.error('Case study generation failed:', err);
          });
        }
      }

      onSuccess();
      resetForm();
    } catch (error) {
      console.error('Error saving portfolio item:', error);
      toast({
        title: 'Error',
        description: 'Failed to save portfolio item',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
          </DialogTitle>
          <DialogDescription>
            {editingItem 
              ? 'Update your portfolio item details'
              : 'Add a link, document, or image. AI will generate a case study automatically.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {!editingItem && (
            <Tabs value={itemType} onValueChange={(v) => setItemType(v as typeof itemType)} className="mb-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="link" className="flex items-center gap-1">
                  <Link className="h-4 w-4" />
                  Link
                </TabsTrigger>
                <TabsTrigger value="document" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Document
                </TabsTrigger>
                <TabsTrigger value="image" className="flex items-center gap-1">
                  <Image className="h-4 w-4" />
                  Image
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          <div className="space-y-4">
            {/* URL Input for Links */}
            {itemType === 'link' && (
              <div className="space-y-2">
                <Label htmlFor="url">URL *</Label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/my-project"
                  disabled={isLoading}
                />
              </div>
            )}

            {/* File Upload for Documents/Images */}
            {(itemType === 'document' || itemType === 'image') && (
              <div className="space-y-2">
                <Label>
                  {itemType === 'document' ? 'Document' : 'Image'} 
                  {!editingItem?.file_path && ' *'}
                </Label>
                {file ? (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    {itemType === 'document' ? (
                      <FileText className="h-5 w-5 text-orange-500" />
                    ) : (
                      <Image className="h-5 w-5 text-green-500" />
                    )}
                    <span className="flex-1 text-sm truncate">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setFile(null)}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : editingItem?.file_path ? (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    {itemType === 'document' ? (
                      <FileText className="h-5 w-5 text-orange-500" />
                    ) : (
                      <Image className="h-5 w-5 text-green-500" />
                    )}
                    <span className="flex-1 text-sm text-muted-foreground">
                      Current file (upload new to replace)
                    </span>
                  </div>
                ) : null}
                <div className="relative">
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    accept={itemType === 'document' 
                      ? '.pdf,.doc,.docx' 
                      : 'image/jpeg,image/png,image/webp,image/gif'}
                    disabled={isLoading}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label
                    htmlFor="file-upload"
                    className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {itemType === 'document' 
                        ? 'Upload PDF, DOC, or DOCX'
                        : 'Upload JPG, PNG, WebP, or GIF'}
                    </span>
                  </Label>
                </div>
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Project name or title"
                disabled={isLoading}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the project or work"
                rows={3}
                disabled={isLoading}
              />
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills">Skills (Optional)</Label>
              <Input
                id="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="WordPress, Technical SEO, Speed Optimization"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Comma-separated list of skills demonstrated in this work
              </p>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingItem ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                editingItem ? 'Update Item' : 'Add Item'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
