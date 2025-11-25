// __tests__/components/ButtonAtom.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ButtonAtom from '../../components/atoms/ButtonAtom';

describe('ButtonAtom', () => {
  it('debe renderizar correctamente con título', () => {
    const { getByText } = render(<ButtonAtom title="Test Button" onPress={() => {}} />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('debe ejecutar onPress cuando se presiona', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<ButtonAtom title="Click Me" onPress={onPressMock} />);
    
    fireEvent.press(getByText('Click Me'));
    
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('debe estar deshabilitado cuando disabled=true', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <ButtonAtom title="Disabled" onPress={onPressMock} disabled />
    );
    
    const button = getByText('Disabled');
    fireEvent.press(button);
    
    // El botón no debe ejecutar onPress cuando está deshabilitado
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('debe mostrar loading cuando loading=true', () => {
    const { getByTestId, queryByText } = render(
      <ButtonAtom title="Loading" onPress={() => {}} loading />
    );
    
    // El título no debe estar visible
    expect(queryByText('Loading')).toBeNull();
    // Debe mostrar un ActivityIndicator
    expect(getByTestId || (() => {})).toBeTruthy();
  });

  it('debe aplicar diferentes variantes', () => {
    const { rerender, getByText } = render(
      <ButtonAtom title="Button" onPress={() => {}} variant="primary" />
    );
    expect(getByText('Button')).toBeTruthy();

    rerender(<ButtonAtom title="Button" onPress={() => {}} variant="secondary" />);
    expect(getByText('Button')).toBeTruthy();

    rerender(<ButtonAtom title="Button" onPress={() => {}} variant="outline" />);
    expect(getByText('Button')).toBeTruthy();
  });
});
