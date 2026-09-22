import type React from 'react';

export type CoolIcon = React.ComponentType<{
  'aria-hidden'?: boolean;
  className?: string;
  weight?: 'Filled' | 'Outline';
}>;

export type CoolActionType = 'primary' | 'secondary' | 'tertiary';
