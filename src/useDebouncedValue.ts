
import { useEffect, useState } from 'react';
import { act, renderHook } from '@testing-library/react-native';

/*
 * useDebouncedValue returns the debounced value, which is updated only after the
 * specified debounce time has elapsed since the last change in the input value
 * or dependency. This helps prevent rapid, unnecessary updates in scenarios
 * where the input value or dependency is frequently changing. This is different
 * from other useDebounce because we returning the value based on changes to the
 * dependency and not the value which is related to how limit orders errors are
 * debounced based on user updates to amount value.
 *
 * */
export function useDebouncedValue<T, U>(
  value: T,
  dependency: U,
  debounceTime = 500,
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (debouncedValue !== value) {
        setDebouncedValue(value);
      }
    }, debounceTime);

    return () => clearTimeout(timeout);
  }, [dependency, value, debounceTime, debouncedValue]);

  return debouncedValue;
}


// TESTS
async function advanceTimersByTime(ms: number) {
  jest.advanceTimersByTime(ms);
  await Promise.resolve();
}

describe('useDebouncedValue', () => {
  beforeEach(() => {
    jest.useFakeTimers({ advanceTimers: true });
  });

  it('should return the initial value', () => {
    const { result } = renderHook(() => useDebouncedValue(true, 'initial'));
    expect(result.current).toBe(true);
  });

  it('should debounce the returned value as dependency changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, dependency }) => useDebouncedValue(value, dependency),
      {
        initialProps: { value: true, dependency: 'initial' },
      },
    );

    rerender({ value: true, dependency: 'updated' });
    expect(result.current).toBe(true);

    rerender({ value: false, dependency: 'updated2' });
    expect(result.current).toBe(true);

    await act(async () => {
      await advanceTimersByTime(400);
    });

    expect(result.current).toBe(true);

    await act(async () => {
      await advanceTimersByTime(100);
    });

    expect(result.current).toBe(false);
  });
});
