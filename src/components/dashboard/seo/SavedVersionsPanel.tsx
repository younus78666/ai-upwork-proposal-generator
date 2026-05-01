'use client'
import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Save, 
  History, 
  Trash2, 
  Check,
  Loader2,
  FileText,
  Star
} from 'lucide-react';
import { ProfileSEOVersion, GeneratedContent } from '@/hooks/useProfileSEOVersions';

interface SavedVersionsPanelProps {
  versions: ProfileSEOVersion[];
  isLoading: boolean;
  isSaving: boolean;
  generatedContent: GeneratedContent | null;
  keywords: string[];
  onSave: (name: string, keywords: string[], content: GeneratedContent) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onSetActive: (id: string) => Promise<boolean>;
  onLoad: (version: ProfileSEOVersion) => void;
}

export function SavedVersionsPanel({
  versions,
  isLoading,
  isSaving,
  generatedContent,
  keywords,
  onSave,
  onDelete,
  onSetActive,
  onLoad,
}: SavedVersionsPanelProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSave = async () => {
    if (!versionName.trim() || !generatedContent) return;

    const success = await onSave(versionName.trim(), keywords, generatedContent);
    if (success) {
      setVersionName('');
      setSaveDialogOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    await onDelete(id);
    setDeleteId(null);
  };

  return (
    <div className="space-y-4">
      {/* Save Button */}
      {generatedContent && (
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full gradient-primary text-primary-foreground">
              <Save className="h-4 w-4 mr-2" />
              Save This Version
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Profile Version</DialogTitle>
              <DialogDescription>
                Give this version a name so you can compare it later
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="version-name">Version Name</Label>
                <Input
                  id="version-name"
                  placeholder="e.g., WordPress Focus v1, E-commerce Specialist"
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">This will save:</p>
                <ul className="list-disc list-inside space-y-0.5 text-xs">
                  <li>Keywords: {keywords.slice(0, 3).join(', ')}{keywords.length > 3 ? '...' : ''}</li>
                  <li>Long-tail keywords: {generatedContent.longTailKeyword1}, {generatedContent.longTailKeyword2}</li>
                  <li>Profile description ({generatedContent.profileDescription.length} chars)</li>
                  <li>{generatedContent.skillsTags.length} skills, portfolio titles, and more</li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!versionName.trim() || isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Version
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Saved Versions List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <History className="h-4 w-4" />
            Saved Versions
          </CardTitle>
          <CardDescription>
            {versions.length} saved version{versions.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No saved versions yet</p>
              <p className="text-xs">Generate content and save it to compare later</p>
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-2 pr-4">
                {versions.map((version) => (
                  <div
                    key={version.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      version.is_active
                        ? 'bg-primary/10 border-primary/30'
                        : 'bg-muted/50 border-border/50 hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">{version.name}</span>
                          {version.is_active && (
                            <Badge variant="default" className="text-[10px] px-1.5">
                              <Star className="h-3 w-3 mr-0.5" />
                              Active
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(version.created_at), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-2">
                      {version.keywords.slice(0, 3).map((kw, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0">
                          {kw}
                        </Badge>
                      ))}
                      {version.keywords.length > 3 && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          +{version.keywords.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs flex-1"
                        onClick={() => onLoad(version)}
                      >
                        Load
                      </Button>
                      {!version.is_active && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => onSetActive(version.id)}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Set Active
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-destructive hover:text-destructive"
                        onClick={() => handleDelete(version.id)}
                        disabled={deleteId === version.id}
                      >
                        {deleteId === version.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
