import { z } from 'zod';
import { FieldType } from '@/types/form';

const textSchema = z.string().min(1, 'Text field cannot be empty');
const emailSchema = z.string().email('Please enter a valid email address');
const numberSchema = z.string().refine(
  (val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  },
  'Number must be greater than 0'
);

export function validateField(type: FieldType, value: string): string | undefined {
  try {
    switch (type) {
      case 'text':
        textSchema.parse(value);
        break;
      case 'email':
        emailSchema.parse(value);
        break;
      case 'number':
        numberSchema.parse(value);
        break;
      default:
        break;
    }
    return undefined;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message;
    }
    return 'Invalid input';
  }
}