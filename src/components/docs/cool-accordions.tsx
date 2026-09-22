import type React from 'react';
import { Accordions } from 'fumadocs-ui/components/accordion';
import { cn } from '@/lib/ui/cn';

type CoolAccordionsProps = {
  children?: React.ReactNode;
  className?: string;
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  value?: string[];
};

export function CoolAccordions({ className, ...props }: CoolAccordionsProps) {
  return <Accordions type="multiple" className={cn('border-0', className)} {...props} />;
}
