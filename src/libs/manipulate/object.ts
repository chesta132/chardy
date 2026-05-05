/**
 * Only pick some fields in object, other properties will deleted.
 *
 * @param data - Object to initiate.
 * @param picks - Keys of data to pick.
 * @returns The object with only picked properties.
 */
export const pick = <T extends Record<string, any>, Z extends (keyof T)[] = []>(data: T, picks?: Z): Pick<T, Z[number]> => {
  const pickedData = { ...data };
  if (picks)
    for (const pick of Object.keys(pickedData)) {
      if (!picks.includes(pick as keyof object)) {
        delete pickedData[pick as keyof object];
      }
    }
  return pickedData;
};

/**
 * Only omit some fields in object, other properties will remain.
 *
 * @param data - Object to initiate.
 * @param omits - Keys of data to omit.
 * @returns The object with omitted properties.
 */
export const omit = <T extends Record<string, any>, Z extends (keyof T)[] = []>(data: T, omits?: Z): Omit<T, Z[number]> => {
  const omittedData = { ...data };
  if (omits)
    for (const omit of omits) {
      delete omittedData[omit];
    }
  return omittedData;
};

/**
 * Creates a new object with the same keys as the given data,
 * but all values replaced with a fixed type/value.
 *
 * @param data - Array of strings or object to get the keys from
 * @param value - The value or type to assign to each key
 * @returns A new object where each key has the same value `value`
 *
 * @example
 * ```ts
 * // From array
 * const arr = ['foo', 'bar', 'baz'] as const;
 * const rec1 = record(arr, 0); // { foo: number; bar: number; baz: number }
 * // rec1 = { foo: 0, bar: 0, baz: 0 }
 *
 * // From object
 * const obj = { foo: 1, bar: "yo" };
 * const rec2 = record(obj, false); // { foo: boolean; bar: boolean }
 * // rec2 = { foo: false, bar: false }
 * ```
 */
export function record<K extends string, Z>(data: Record<K, any> | K[], value: Z): Record<K, Z> {
  if (Array.isArray(data)) {
    const builded = {} as Record<(typeof data)[number], Z>;
    data.forEach((k: keyof typeof builded) => {
      builded[k] = value;
    });
    return builded;
  } else {
    const builded = { ...data } as Record<string, any>;
    Object.keys(builded).forEach((key) => {
      builded[key] = value;
    });
    return builded;
  }
}

type DeepMerge<T, U> = Omit<T, keyof U> &
  Omit<U, keyof T> & {
    [K in keyof T & keyof U]: T[K] extends Record<string, unknown> ? (U[K] extends Record<string, unknown> ? DeepMerge<T[K], U[K]> : U[K]) : U[K];
  };

type DeepMergeAll<T extends readonly unknown[]> = T extends readonly [infer First]
  ? First
  : T extends readonly [infer First, infer Second, ...infer Rest]
    ? DeepMergeAll<[DeepMerge<First, Second>, ...Rest]>
    : never;

export function deepMerge<T extends object, U extends object>(a: T, b: U): DeepMerge<T, U> {
  const result = { ...a } as Record<string, unknown>;

  for (const key in b) {
    const bVal = b[key as keyof U];
    const aVal = result[key];

    if (aVal && typeof aVal === "object" && !Array.isArray(aVal) && bVal && typeof bVal === "object" && !Array.isArray(bVal)) {
      result[key] = deepMerge(aVal as object, bVal as object);
    } else {
      result[key] = bVal;
    }
  }

  return result as DeepMerge<T, U>;
}

export function deepMergeAll<T extends readonly object[]>(...objects: T): DeepMergeAll<T> {
  return objects.reduce((acc, obj) => deepMerge(acc, obj)) as DeepMergeAll<T>;
}

export const compareObj = <T extends Record<string, any>>(data1: T, data2: T, keys: (keyof T)[]) => {
  for (const key of keys) {
    if (data1[key] !== data2[key]) {
      return false;
    }
  }
  return true;
};

export const nullishToStr = (data: Record<string, any>) => {
  const result = { ...data };
  for (const [key, val] of Object.entries(data)) {
    if (!val) result[key] = "";
  }
  return result;
};

export const falsyToNull = (data: Record<string, any>) => {
  const result = { ...data };
  for (const [key, val] of Object.entries(data)) {
    if (!val) result[key] = null;
  }
  return result;
};
