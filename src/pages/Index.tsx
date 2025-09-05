import { FormProvider } from '@/context/FormContext';
import { FormBuilder } from '@/components/FormBuilder';

const Index = () => {
  return (
    <FormProvider>
      <FormBuilder />
    </FormProvider>
  );
};

export default Index;
