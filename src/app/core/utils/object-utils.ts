/**
 * Returns a shallow copy of the object without the specified keys.
 * @param obj The original object.
 * @param keysToRemove Array of keys to exclude from the result.
 */
export function omitKeys<T, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Omit<T, K> {
  const clone = { ...obj };
  for (const key of keys) {
    delete clone[key];
  }
  return clone;
}
