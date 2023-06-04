# json-translation-helper

Extract text information from a json file for translation, and then reversely sync the translation back to the json file.

Basic Usage:

generate translation file:
```
bun run cli.ts generate <source-file> -p <output-patch-filename>
```

apply changes back to original file:
```
bun run cli.ts patch <source-file> -p <input-patch-filename> -o <output-file>
```

Advanced usage:

You can provide a filter function to filter out unwanted keys.

example:
```
export default (
  stack: ReadonlyArray<number | string | null>,
  token: string
) => {
  return stack.at(-1) === 'comments'; // filter out all comments.
}
```
The filter can be provided by '-f' options (Once this parameter is used in generate, you must also specify the same parameter in patch), example: `bun run cli.ts generate a.json -p a.txt -f ./filter.js`

Or for more complex filtering, using a "premark" file:
```
export default (
  stack: ReadonlyArray<number | string | null>,
  token: string
): ReadonlyArray<number | string | null> | undefined => {
  return stack.at(-1) === 'code' && ["102", "233"].includes(token);
}
```
It will filter out all object with key "code": "102".
The premark function can be provided by '-m' options, example: `bun run cli.ts generate a.json -p a.txt -m ./premark.js`

## Development

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run cli.ts
```

This project was created using `bun init` in bun v0.6.7. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
