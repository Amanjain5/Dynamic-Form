export type FieldType = 'text' | 'email' | 'number';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  value: string;
  error?: string;
}

export interface FormState {
  fields: FormField[];
}