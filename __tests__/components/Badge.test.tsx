// __tests__/components/Badge.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { Badge } from '../../components/atoms/Badge';

describe('Badge', () => {
  it('debe renderizar con texto', () => {
    const { getByText } = render(<Badge>Test Badge</Badge>);
    expect(getByText('Test Badge')).toBeTruthy();
  });

  it('debe usar variant por defecto', () => {
    const { getByText } = render(<Badge>Default</Badge>);
    const badge = getByText('Default');
    expect(badge).toBeTruthy();
  });

  it('debe renderizar variant success', () => {
    const { getByText } = render(<Badge variant="success">Success</Badge>);
    expect(getByText('Success')).toBeTruthy();
  });

  it('debe renderizar variant error', () => {
    const { getByText } = render(<Badge variant="error">Error</Badge>);
    expect(getByText('Error')).toBeTruthy();
  });

  it('debe renderizar variant warning', () => {
    const { getByText } = render(<Badge variant="warning">Warning</Badge>);
    expect(getByText('Warning')).toBeTruthy();
  });

  it('debe renderizar variant info', () => {
    const { getByText } = render(<Badge variant="info">Info</Badge>);
    expect(getByText('Info')).toBeTruthy();
  });
});
