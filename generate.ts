import { ReadStream, WriteStream } from "node:fs";
import { chain } from "stream-chain";
import { parser } from "stream-json";
import { pick } from "stream-json/filters/Pick";
import { streamValues } from "stream-json/streamers/StreamValues";
import { PatchOptions } from "./types";
import { Stack } from "stream-json/filters/FilterBase";
import { createFilter } from "./filter";

export function generate(
  input: ReadStream,
  output: WriteStream,
  options: PatchOptions
) {
  return chain([
    input,
    parser(),
    pick({
      filter: createFilter(options),
    }),
    streamValues(),
    (data) => data.value + "\n",
    output,
  ]);
}
