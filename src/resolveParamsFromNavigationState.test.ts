import { resolveParamsFromNavigationState } from './resolveParamsFromNavigationState';

describe('resolveParamsFromNavigationState', () => {
  it('should resolve params from leaf route', () => {
    const state = {
      params: { foo: 'bar' },
    };

    const result = resolveParamsFromNavigationState<typeof state.params>(state);
    expect(result).toEqual({ foo: 'bar' });
  });

  it('should resolve params from nested state', () => {
    const state = {
      state: {
        params: { deep: true },
      },
    };

    const result =
      resolveParamsFromNavigationState<typeof state.state.params>(state);
    expect(result).toEqual({ deep: true });
  });

  it('should resolve params from nested state route state', () => {
    const state = {
      index: 0,
      routes: [
        {
          state: {
            params: { deep: true },
          },
        },
      ],
    };

    const result = resolveParamsFromNavigationState<{ deep: boolean }>(state);
    expect(result).toEqual({ deep: true });
  });

  it('should resolve params from nested routes recursively', () => {
    const state = {
      index: 0,
      routes: [
        {
          index: 0,
          routes: [
            {
              params: { nested: 'value' },
            },
          ],
        },
      ],
    };

    const result = resolveParamsFromNavigationState<{ nested: boolean }>(state);
    expect(result).toEqual({ nested: 'value' });
  });

  it('should return undefined for state without params or index', () => {
    const state = {
      someOtherKey: true,
    };

    const result = resolveParamsFromNavigationState(state);
    expect(result).toBeUndefined();
  });

  it('should return undefined for malformed state object', () => {
    const result = resolveParamsFromNavigationState(
      null as unknown as Record<string, unknown>,
    );
    expect(result).toBeUndefined();

    const result2 = resolveParamsFromNavigationState(
      undefined as unknown as Record<string, unknown>,
    );
    expect(result2).toBeUndefined();

    const result3 = resolveParamsFromNavigationState({ index: 0 });
    expect(result3).toBeUndefined();
  });
});
