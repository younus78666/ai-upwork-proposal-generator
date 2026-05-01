import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Sparkles, User, FileText, Target, Package, Briefcase, HelpCircle, DollarSign, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface AITemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  platform: string;
  credit_cost: number;
  icon: string;
}

interface AITemplateCardProps {
  template: AITemplate;
  isBookmarked: boolean;
  onBookmark: () => void;
  onGenerate: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  user: User,
  'file-text': FileText,
  target: Target,
  package: Package,
  briefcase: Briefcase,
  'help-circle': HelpCircle,
  'dollar-sign': DollarSign,
  'message-square': MessageSquare,
  sparkles: Sparkles,
};

const categoryColors: Record<string, string> = {
  profile: 'bg-blue-500/10 text-blue-500',
  catalog: 'bg-green-500/10 text-green-500',
  portfolio: 'bg-purple-500/10 text-purple-500',
  communication: 'bg-orange-500/10 text-orange-500',
};

const AITemplateCard = ({ template, isBookmarked, onBookmark, onGenerate }: AITemplateCardProps) => {
  const IconComponent = iconMap[template.icon] || Sparkles;
  const categoryColor = categoryColors[template.category] || 'bg-muted text-muted-foreground';

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", categoryColor)}>
              <IconComponent className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base line-clamp-1">{template.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs capitalize">
                  {template.platform}
                </Badge>
                <Badge variant="secondary" className="text-xs capitalize">
                  {template.category}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 shrink-0",
              isBookmarked && "text-yellow-500"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onBookmark();
            }}
          >
            <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="line-clamp-2 min-h-[40px]">
          {template.description}
        </CardDescription>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            <span>{template.credit_cost} credit{template.credit_cost > 1 ? 's' : ''}</span>
          </div>
          <Button onClick={onGenerate} size="sm" className="gap-2">
            <Sparkles className="h-3 w-3" />
            Generate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AITemplateCard;
