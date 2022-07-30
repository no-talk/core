const ALIAS = "__metadata__";

type Target<T> = { new (): T; [ALIAS]?: any };

export class Metadata<T> {
  constructor(readonly args: T) {}
}

export class ClassMetadata<T> extends Metadata<T> {}

export class PropertyMetadata<T> extends Metadata<T> {
  constructor(args: T, readonly dist: string) {
    super(args);
  }
}

export type MetadataList = {
  readonly metadata: Metadata<unknown>;
  readonly next?: MetadataList;
};

export type Reducer<T> = (value: Record<string, unknown>, event: T, metadata: Metadata<unknown>) => Record<string, unknown>;

export const calculate = <T, Specification>(value: Record<string, unknown>, event: T, reducer: Reducer<T>, target: Target<Specification>) => {
  const recursion = (value: Record<string, unknown>, list?: MetadataList): Record<string, unknown> => {
    if (!list) {
      return value;
    }

    const { metadata, next } = list;

    return recursion(reducer(value, event, metadata), next);
  };

  return recursion(value, target.prototype[ALIAS]);
};

export const push = (target: any, metadata: Metadata<unknown>) => {
  const recursion = (list?: MetadataList): MetadataList => {
    if (!list) {
      return {
        metadata,
      };
    }

    const { next } = list;

    return {
      ...list,
      next: recursion(next),
    };
  };

  target[ALIAS] = recursion(target[ALIAS]);
};
