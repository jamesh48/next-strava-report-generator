import React from 'react';

export interface RadiosProps {
  setSport: React.MouseEventHandler<HTMLInputElement>;
  setDistance: React.MouseEventHandler<HTMLInputElement>;
  setFormat: React.MouseEventHandler<HTMLInputElement>;
  setTitleQuery: React.ChangeEventHandler<HTMLInputElement>;
  setFromDateQuery: React.ChangeEventHandler<HTMLInputElement>;
  setToDateQuery: React.ChangeEventHandler<HTMLInputElement>;
  titleQuery: string;
  sport: string;
  customDistance: boolean;
  distance: number;
  format: string;
}

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

export interface AdditionalFilterProps {
  setTitleQuery: React.ChangeEventHandler<HTMLInputElement>;
  setFromDateQuery: React.ChangeEventHandler<HTMLInputElement>;
  setToDateQuery: React.ChangeEventHandler<HTMLInputElement>;
  titleQuery: string;
}
