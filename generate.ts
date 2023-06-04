import { ReadStream, WriteStream } from "node:fs";
import { chain } from "stream-chain";
import { parser } from "stream-json";
import { pick } from "stream-json/filters/Pick";
import { streamValues } from "stream-json/streamers/StreamValues";

export function generate(input: ReadStream, output: WriteStream) {
  return chain([
    input,
    parser(),
    pick({
      filter(_stack, token) {
        return token.name === "stringValue" && !!token.value;
      },
    }),
    streamValues(),
    (data) => data.value + "\n",
    output,
  ]);
}
