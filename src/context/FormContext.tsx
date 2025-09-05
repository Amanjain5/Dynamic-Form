import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { FormState, FormField, FieldType } from '@/types/form';
import { validateField } from '@/utils/validation';
import { saveFormState, loadFormState } from '@/utils/storage';

type FormAction =
  | { type: 'ADD_FIELD'; fieldType: FieldType }
  | { type: 'REMOVE_FIELD'; fieldId: string }
  | { type: 'UPDATE_FIELD'; fieldId: string; label?: string; value?: string }
  | { type: 'LOAD_STATE'; state: FormState }
  | { type: 'RESET_FORM' };

interface FormContextType {
  state: FormState;
  addField: (type: FieldType) => void;
  removeField: (id: string) => void;
  updateField: (id: string, updates: { label?: string; value?: string }) => void;
  resetForm: () => void;
  isFormValid: boolean;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'ADD_FIELD': {
      const newField: FormField = {
        id: generateId(),
        type: action.fieldType,
        label: `${action.fieldType.charAt(0).toUpperCase() + action.fieldType.slice(1)} Field`,
        value: '',
        error: undefined,
      };
      return { fields: [...state.fields, newField] };
    }
    
    case 'REMOVE_FIELD': {
      return {
        fields: state.fields.filter(field => field.id !== action.fieldId),
      };
    }
    
    case 'UPDATE_FIELD': {
      return {
        fields: state.fields.map(field => {
          if (field.id === action.fieldId) {
            const updatedField = { 
              ...field,
              ...(action.label !== undefined && { label: action.label }),
              ...(action.value !== undefined && { value: action.value })
            };
            const error = validateField(updatedField.type, updatedField.value);
            return { ...updatedField, error };
          }
          return field;
        }),
      };
    }
    
    case 'LOAD_STATE': {
      return action.state;
    }
    
    case 'RESET_FORM': {
      return { fields: [] };
    }
    
    default:
      return state;
  }
}

const initialState: FormState = { fields: [] };

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = loadFormState();
    if (savedState && savedState.fields.length > 0) {
      dispatch({ type: 'LOAD_STATE', state: savedState });
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (state.fields.length > 0) {
      saveFormState(state);
    }
  }, [state]);

  const addField = (type: FieldType) => {
    dispatch({ type: 'ADD_FIELD', fieldType: type });
  };

  const removeField = (id: string) => {
    dispatch({ type: 'REMOVE_FIELD', fieldId: id });
  };

  const updateField = (id: string, updates: { label?: string; value?: string }) => {
    dispatch({ type: 'UPDATE_FIELD', fieldId: id, ...updates });
  };

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
  };

  const isFormValid = state.fields.length > 0 && state.fields.every(field => 
    !field.error && field.value.trim() !== ''
  );

  return (
    <FormContext.Provider value={{
      state,
      addField,
      removeField,
      updateField,
      resetForm,
      isFormValid,
    }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}