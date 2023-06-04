export type FilterFn = (
  stacks: ReadonlyArray<number | string | null>,
  token: string
) => boolean;

export type PremarkFn = (
  stacks: ReadonlyArray<number | string | null>,
  token: string | boolean
) => string[] | null;

export type PatchOptions = {
  filters: FilterFn[];
  premarks: PremarkFn[];
};
