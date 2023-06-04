import { ReadStream, WriteStream } from "node:fs";
import { chain } from "stream-chain";
import { parser } from "stream-json";
import Assembler from "stream-json/Assembler";
import { replace } from "stream-json/filters/Replace";
import { PatchOptions } from "./types";
import { createFilter } from "./filter";

export function patch(
  input: ReadStream,
  output: WriteStream,
  patches: string[],
  options: PatchOptions
) {
  const pipeline = chain([
    input,
    parser(),
    replace({
      filter: createFilter(options),
      replacement(_, token) {
        // console.log('here', patches);
        return [{ name: "stringValue", value: patches.shift() }];
      },
    }),
  ]);
  pipeline.on("error", console.error);
  const asm = Assembler.connectTo(pipeline);
  asm.on("done", () => {
    const text = JSON.stringify(asm.current, null, 2);
    output.write(text);
  });
}
