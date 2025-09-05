import { FormState } from '@/types/form';

const STORAGE_KEY = 'formBuilderState';

export function saveFormState(state: FormState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save form state:', error);
  }
}

export function loadFormState(): FormState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load form state:', error);
  }
  return null;
}

export function clearFormState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear form state:', error);
  }
}