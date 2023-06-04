import { Stack, Token } from "stream-json/filters/FilterBase";
import { PatchOptions } from "./types";

export function createFilter({ filters, premarks }: PatchOptions) {
  let premarked: Stack | undefined = undefined;
  return (stack: Stack, token: Token) => {
    if (premarked) {
      if (stack.length >= premarked.length) {
        if (premarked.every((x, i) => x === stack[i])) {
          return false;
        }
      } else {
        premarked = undefined;
      }
    }
    const ret = token.name === "stringValue" && !!token.value;
    if (ret) {
      if (filters.some((x) => !x(stack, token.value as string))) return false;
    } else if (token.value != null) {
      for (const premark of premarks) {
        const ret = premark(stack, token.value);
        if (ret) {
          premarked = ret;
          return false;
        }
      }
    }
    return ret;
  };
}
