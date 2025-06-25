type PossibleState = Record<string, unknown>;

// eslint-disable-next-line @cbhq/func-declaration-in-module
const safeAccess = <ExpectedType>(
  obj: unknown,
  key: string,
): obj is ExpectedType => {
  return !!obj && typeof obj === 'object' && key in obj;
};

// eslint-disable-next-line @cbhq/func-declaration-in-module
export const resolveParamsFromNavigationState = <
  ParamsType extends PossibleState,
>(
  state: PossibleState,
): ParamsType | undefined => {
  if (
    safeAccess<{ routes: []; index: number }>(state, 'index') &&
    typeof state.index === 'number' &&
    safeAccess<{ routes: []; index: number }>(state, 'routes')
  ) {
    return resolveParamsFromNavigationState(state.routes[state.index]);
  }

  if (safeAccess<{ state: PossibleState }>(state, 'state')) {
    return resolveParamsFromNavigationState(state.state);
  }

  if (
    safeAccess<{ params: ParamsType }>(state, 'params') &&
    !('index' in state)
  ) {
    return state?.params;
  }

  return undefined;
};
