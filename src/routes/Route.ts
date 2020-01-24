import React from 'react';

export interface RouteType {
  name: string;
  path: string;
  icon: React.ComponentType;
  component: React.ComponentType | null;

  collapse: boolean;
  views: {
    name: string,
    path: string,
    icon: React.ComponentType,
    component: React.ComponentType
  }[] | null;
}
