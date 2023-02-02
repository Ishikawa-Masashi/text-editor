/**
 * Dictionary of booleans.
 *
 * @internal
 */
export type IDictionary = Record<string, boolean>;

/**
 * Serializable object.
 *
 * @internal
 */
export interface ISerializableObject {
  toString?: () => string;
  [key: string]: unknown;
}

/**
 * Css input type.
 *
 * @internal
 */
export type IArgs = string | ISerializableObject | IDictionary;

/**
 * Concatination helper, which can merge class names together. Skips over falsey values.
 *
 * @public
 */
export function classes(...args: IArgs[]): string {
  const classes = [];

  for (const arg of args) {
    if (!arg) {
      continue;
    }

    if (typeof arg === 'string') {
      classes.push(arg);
    } else if (
      Object.hasOwn(arg, 'toString') &&
      typeof arg.toString === 'function'
    ) {
      classes.push(arg.toString());
    } else {
      for (const key in arg) {
        if (arg[key]) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}
