import { PortfolioItem } from './PortfolioTab';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  RefreshCw, 
  ExternalLink, 
  Star, 
  StarOff,
  Link,
  FileText,
  Image,
  Loader2
} from 'lucide-react';

interface PortfolioItemCardProps {
  item: PortfolioItem;
  onEdit: () => void;
  onDelete: () => void;
  onRegenerateCaseStudy: () => void;
  onToggleFeatured: (featured: boolean) => void;
  isGenerating: boolean;
}

export function PortfolioItemCard({
  item,
  onEdit,
  onDelete,
  onRegenerateCaseStudy,
  onToggleFeatured,
  isGenerating,
}: PortfolioItemCardProps) {
  const getTypeIcon = () => {
    switch (item.item_type) {
      case 'link':
        return <Link className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
    }
  };

  const getTypeColor = () => {
    switch (item.item_type) {
      case 'link':
        return 'bg-blue-500/10 text-blue-500';
      case 'document':
        return 'bg-orange-500/10 text-orange-500';
      case 'image':
        return 'bg-green-500/10 text-green-500';
    }
  };

  return (
    <Card className={`border-border/50 transition-all hover:shadow-md ${item.is_featured ? 'ring-2 ring-yellow-500/50' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded ${getTypeColor()}`}>
              {getTypeIcon()}
            </div>
            {item.is_featured && (
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              {item.url && (
                <DropdownMenuItem onClick={() => window.open(item.url!, '_blank')}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Link
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={onRegenerateCaseStudy} disabled={isGenerating}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                Regenerate Case Study
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleFeatured(!item.is_featured)}>
                {item.is_featured ? (
                  <>
                    <StarOff className="h-4 w-4 mr-2" />
                    Unfeature
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4 mr-2" />
                    Feature
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem 
                    onSelect={(e) => e.preventDefault()}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Portfolio Item?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete "{item.title}" and its case study. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <h3 className="font-semibold text-base line-clamp-1">{item.title}</h3>
        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Case Study Section */}
        {item.case_study_title ? (
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-primary">AI Case Study</span>
              {isGenerating && (
                <Loader2 className="h-3 w-3 animate-spin text-primary" />
              )}
            </div>
            <h4 className="font-medium text-sm line-clamp-1">{item.case_study_title}</h4>
            {item.case_study_description && (
              <p className="text-xs text-muted-foreground line-clamp-3">
                {item.case_study_description}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            {isGenerating ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground">Generating case study...</span>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onRegenerateCaseStudy}
                className="text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Generate Case Study
              </Button>
            )}
          </div>
        )}

        {/* Skills */}
        {item.skills_demonstrated && item.skills_demonstrated.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.skills_demonstrated.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {item.skills_demonstrated.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{item.skills_demonstrated.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* Outcome */}
        {item.project_outcome && (
          <p className="text-xs text-green-600 dark:text-green-400 line-clamp-1">
            ✓ {item.project_outcome}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
