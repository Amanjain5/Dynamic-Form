import React, { useState } from 'react';
import { Plus, Eye, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormContext } from '@/context/FormContext';
import { FieldType } from '@/types/form';
import { Field } from '@/components/Field';
import { Preview } from '@/components/Preview';
import { useToast } from '@/hooks/use-toast';

export function FormBuilder() {
  const { state, addField, resetForm, isFormValid } = useFormContext();
  const [selectedFieldType, setSelectedFieldType] = useState<FieldType>('text');
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const handleAddField = () => {
    addField(selectedFieldType);
    toast({
      title: "Field Added",
      description: `${selectedFieldType.charAt(0).toUpperCase() + selectedFieldType.slice(1)} field has been added to your form.`,
    });
  };

  const handleSubmit = () => {
    if (!isFormValid) {
      toast({
        title: "Form Invalid",
        description: "Please fill in all fields correctly before submitting.",
        variant: "destructive",
      });
      return;
    }
    setShowPreview(true);
  };

  const handleReset = () => {
    resetForm();
    toast({
      title: "Form Reset",
      description: "All fields have been removed from the form.",
    });
  };

  return (
    <div className="min-h-screen form-builder-gradient p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
            Dynamic Form Builder
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create custom forms with real-time validation and automatic persistence. 
            Add fields, configure them, and see your form come to life.
          </p>
        </div>

        {/* Controls */}
        <Card className="shadow-form-elevated border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Add New Field
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedFieldType} onValueChange={(value: FieldType) => setSelectedFieldType(value)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Field</SelectItem>
                  <SelectItem value="email">Email Field</SelectItem>
                  <SelectItem value="number">Number Field</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={handleAddField} className="flex-1 sm:flex-none">
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>
            
            {state.fields.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  className="flex-1 sm:flex-none"
                  size="lg"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Form ({state.fields.length} fields)
                </Button>
                
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                  className="flex-1 sm:flex-none"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form Fields */}
        {state.fields.length > 0 ? (
          <Card className="shadow-form border-0">
            <CardHeader>
              <CardTitle>Form Fields</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure your form fields below. Changes are saved automatically.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {state.fields.map((field, index) => (
                <Field key={field.id} field={field} index={index} />
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-form border-0 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">No fields yet</h3>
                <p className="text-muted-foreground max-w-sm">
                  Get started by adding your first form field using the controls above.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Preview Modal */}
      <Preview 
        isOpen={showPreview} 
        onClose={() => setShowPreview(false)} 
      />
    </div>
  );
}