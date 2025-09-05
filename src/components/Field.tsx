import React from 'react';
import { Trash2, Hash, Mail, Type, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useFormContext } from '@/context/FormContext';
import { FormField } from '@/types/form';
import { cn } from '@/lib/utils';

interface FieldProps {
  field: FormField;
  index: number;
}

const fieldIcons = {
  text: Type,
  email: Mail,
  number: Hash,
};

export function Field({ field, index }: FieldProps) {
  const { removeField, updateField } = useFormContext();
  const Icon = fieldIcons[field.type];
  
  const hasError = !!field.error;
  const hasValue = field.value.trim() !== '';
  const isValid = hasValue && !hasError;

  return (
    <Card className={cn(
      "transition-form border-2",
      hasError ? "border-destructive/30 bg-destructive/5" : 
      isValid ? "border-success/30 bg-success/5" : 
      "border-border"
    )}>
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg transition-form",
              hasError ? "bg-destructive text-destructive-foreground" :
              isValid ? "bg-success text-success-foreground" :
              "bg-primary text-primary-foreground"
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">
                Field #{index + 1} • {field.type.toUpperCase()}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {isValid && (
                  <>
                    <CheckCircle className="h-3 w-3 text-success" />
                    <span>Valid</span>
                  </>
                )}
                {hasError && (
                  <>
                    <AlertCircle className="h-3 w-3 text-destructive" />
                    <span>Invalid</span>
                  </>
                )}
                {!hasValue && !hasError && (
                  <span>Empty</span>
                )}
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeField(field.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Form Controls */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`label-${field.id}`} className="text-sm font-medium">
              Field Label
            </Label>
            <Input
              id={`label-${field.id}`}
              value={field.label}
              onChange={(e) => updateField(field.id, { label: e.target.value })}
              placeholder="Enter field label"
              className="transition-form"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`value-${field.id}`} className="text-sm font-medium">
              Field Value
            </Label>
            <div className="relative">
              <Input
                id={`value-${field.id}`}
                type={field.type === 'number' ? 'number' : field.type}
                value={field.value}
                onChange={(e) => updateField(field.id, { value: e.target.value })}
                placeholder={`Enter ${field.type} value`}
                className={cn(
                  "transition-form pr-10",
                  hasError && "border-destructive focus-visible:ring-destructive",
                  isValid && "border-success focus-visible:ring-success"
                )}
              />
              {isValid && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-success" />
              )}
              {hasError && (
                <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive" />
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {hasError && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{field.error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}