// React 19 requires this flag to properly wrap state updates in act()
// Without it, react-hook-form state updates cause "overlapping act() calls" warnings
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
