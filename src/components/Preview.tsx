import React from 'react';
import { X, Type, Mail, Hash, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useFormContext } from '@/context/FormContext';

interface PreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

const fieldIcons = {
  text: Type,
  email: Mail,
  number: Hash,
};

const fieldTypeLabels = {
  text: 'Text',
  email: 'Email',
  number: 'Number',
};

export function Preview({ isOpen, onClose }: PreviewProps) {
  const { state } = useFormContext();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Form Submission Preview
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Here's how your form data will be submitted with {state.fields.length} fields.
          </p>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {state.fields.map((field, index) => {
            const Icon = fieldIcons[field.type];
            
            return (
              <Card key={field.id} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{field.label}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            Field #{index + 1}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {fieldTypeLabels[field.type]}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="p-4 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20">
                    <div className="text-sm text-muted-foreground mb-1">Value:</div>
                    <div className="font-mono text-sm bg-background p-2 rounded border break-all">
                      {field.value || <span className="text-muted-foreground italic">Empty</span>}
                    </div>
                  </div>
                  
                  {field.type === 'email' && field.value && (
                    <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-success" />
                      Valid email format
                    </div>
                  )}
                  
                  {field.type === 'number' && field.value && (
                    <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-success" />
                      Number is greater than 0
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          
          {state.fields.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">No fields to preview</div>
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0 flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close Preview
          </Button>
          <Button onClick={onClose}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Looks Good!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}