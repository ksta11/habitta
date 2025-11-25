// __tests__/components/Label.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import Label from '../../components/atoms/Label';

describe('Label', () => {
  it('debe renderizar texto correctamente', () => {
    const { getByText } = render(<Label text="Test Label" />);
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('debe renderizar con variant error', () => {
    const { getByText } = render(<Label text="Error" variant="error" />);
    expect(getByText('Error')).toBeTruthy();
  });

  it('debe renderizar con variant success', () => {
    const { getByText } = render(<Label text="Success" variant="success" />);
    expect(getByText('Success')).toBeTruthy();
  });

  it('debe renderizar con variant warning', () => {
    const { getByText } = render(<Label text="Warning" variant="warning" />);
    expect(getByText('Warning')).toBeTruthy();
  });

  it('debe renderizar con tamaño pequeño', () => {
    const { getByText } = render(<Label text="Small" size="sm" />);
    expect(getByText('Small')).toBeTruthy();
  });

  it('debe renderizar con tamaño grande', () => {
    const { getByText } = render(<Label text="Large" size="lg" />);
    expect(getByText('Large')).toBeTruthy();
  });

  it('debe renderizar con peso bold', () => {
    const { getByText } = render(<Label text="Bold" weight="bold" />);
    expect(getByText('Bold')).toBeTruthy();
  });
});
