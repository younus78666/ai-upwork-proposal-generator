'use client'
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Copy, Check, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface InputField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

interface AITemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  platform: string;
  input_schema: InputField[];
  prompt_template: string;
  output_format: string;
  character_limit: number | null;
  credit_cost: number;
  icon: string;
}

interface AITemplateDialogProps {
  template: AITemplate;
  isOpen: boolean;
  onClose: () => void;
}

const AITemplateDialog = ({ template, isOpen, onClose }: AITemplateDialogProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Parse input schema safely
  const inputSchema: InputField[] = Array.isArray(template.input_schema) 
    ? template.input_schema 
    : [];

  const generateMutation = useMutation({
    mutationFn: async () => {
      // Validate required fields
      const missingFields = inputSchema
        .filter(field => field.required && !inputs[field.name])
        .map(field => field.label);

      if (missingFields.length > 0) {
        throw new Error(`Please fill in: ${missingFields.join(', ')}`);
      }

      const { data, error } = await supabase.functions.invoke('generate-template', {
        body: {
          templateId: template.id,
          inputs,
          promptTemplate: template.prompt_template,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      return data.content;
    },
    onSuccess: async (content) => {
      setGeneratedContent(content);
      
      // Save generation to history
      if (user?.id) {
        await supabase.from('ai_template_generations').insert({
          user_id: user.id,
          template_id: template.id,
          inputs,
          output: content,
        });
        queryClient.invalidateQueries({ queryKey: ['ai-template-generations'] });
      }
      
      toast.success('Content generated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleInputChange = (name: string, value: string) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleCopy = async () => {
    if (!generatedContent) return;
    await navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setInputs({});
    setGeneratedContent(null);
  };

  const renderInputField = (field: InputField) => {
    const value = inputs[field.name] || '';

    if (field.type === 'select' && field.options) {
      return (
        <Select
          value={value}
          onValueChange={(val) => handleInputChange(field.name, val)}
        >
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (field.type === 'textarea') {
      return (
        <Textarea
          value={value}
          onChange={(e) => handleInputChange(field.name, e.target.value)}
          placeholder={field.placeholder}
          rows={3}
        />
      );
    }

    return (
      <Input
        type={field.type === 'number' ? 'number' : 'text'}
        value={value}
        onChange={(e) => handleInputChange(field.name, e.target.value)}
        placeholder={field.placeholder}
      />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>{template.name}</DialogTitle>
            <Badge variant="outline" className="capitalize">{template.platform}</Badge>
          </div>
          <DialogDescription>{template.description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* Input Form */}
            {!generatedContent && (
              <div className="space-y-4">
                {inputSchema.map(field => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>
                      {field.label}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                    {renderInputField(field)}
                  </div>
                ))}
              </div>
            )}

            {/* Generated Content */}
            {generatedContent && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Generated Content</Label>
                  {template.character_limit && (
                    <span className="text-xs text-muted-foreground">
                      {generatedContent.length} / {template.character_limit} chars
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="bg-muted rounded-lg p-4 whitespace-pre-wrap text-sm max-h-[400px] overflow-y-auto">
                    {generatedContent}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span>{template.credit_cost} credit{template.credit_cost > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2">
            {generatedContent ? (
              <>
                <Button variant="outline" onClick={handleReset} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Start Over
                </Button>
                <Button onClick={handleCopy} className="gap-2">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => generateMutation.mutate()}
                disabled={generateMutation.isPending}
                className="gap-2"
              >
                {generateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Generate
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AITemplateDialog;
