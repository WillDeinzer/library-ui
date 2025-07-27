"use client";

import { createTheme } from '@mantine/core';

export const theme = createTheme({
  headings: {
    fontFamily: 'Roboto, sans-serif',
    sizes: {
        h1: { fontSize: '1rem' },
    },
  },
  colors: {
    // Customize light theme colors
    blue: [
        '#e7f5ff', 
        '#d0ebff', 
        '#a5d8ff', 
        '#74c0fc', 
        '#4dabf7', 
        '#339af0', 
        '#228be6', 
        '#1c7ed6', 
        '#1971c2', 
        '#1864ab'
    ],
  },
});