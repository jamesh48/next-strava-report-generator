import React from 'react';

export interface RadioColumnProps {
  title: string;
  radioValues: RadioValueProps[];
  isLoaded: boolean;
  format?: string;
  distance?: number;
  customDistance?: boolean;
  placeholder?: string;
  setCallback: React.MouseEventHandler<HTMLInputElement>;
}

export type RadioValueProps = {
  type: string;
  id: string;
  name: string;
  value?: string | undefined;
  labelText?: string | undefined;
};
