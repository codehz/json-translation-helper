import { generate } from "./generate";
import { patch as patchFn } from "./patch";
import { createReadStream, createWriteStream, readFileSync } from "node:fs";
import arg from "arg";
import { parseCommands } from "minimist-subcommand";
import { FilterFn, PremarkFn } from "./types";

const {
  commands: [command = ""],
  argv,
} = parseCommands(
  {
    commands: {
      generate: null,
      patch: null,
    },
  },
  process.argv.slice(2)
);

if (!command) {
  console.error("No command specified");
  console.error("Help:");
  console.error("  generate [source-file] -p [patch-file] -e [exclude-keys]");
  console.error(
    "  patch [source-file] -p [patch-file] -e [exclude-keys] -o [destination-file]"
  );
  process.exit(1);
}

if (command === "generate") {
  let {
    _: [source],
    "--patch": patch,
    "--filter": filtersSrc = [],
    "--premark": premarksSrc = [],
  } = arg(
    {
      "--patch": String,
      "--filter": [String],
      "--premark": [String],
      "-p": "--patch",
      "-f": "--filter",
      "-m": "--premark",
    },
    { argv }
  );
  if (!source) {
    console.error("No source file specified");
    process.exit(1);
  }
  patch ??= source + ".patch.txt";
  const filters = await Promise.all(
    filtersSrc.map(async (x) => (await import(x)).default as FilterFn)
  );
  const premarks = await Promise.all(
    premarksSrc.map(async (x) => (await import(x)).default as PremarkFn)
  );
  generate(createReadStream(source), createWriteStream(patch), {
    filters,
    premarks,
  });
} else if (command === "patch") {
  let {
    _: [source],
    "--patch": patch,
    "--output": output,
    "--filter": filtersSrc = [],
    "--premark": premarksSrc = [],
  } = arg(
    {
      "--patch": String,
      "--output": String,
      "--filter": [String],
      "--premark": [String],
      "-p": "--patch",
      "-o": "--output",
      "-f": "--filter",
      "-m": "--premark",
    },
    { argv }
  );
  if (!source) {
    console.error("No source file specified");
    process.exit(1);
  }
  patch ??= source + ".patch.txt";
  output ??= source + ".new";
  const filters = await Promise.all(
    filtersSrc.map(async (x) => (await import(x)).default as FilterFn)
  );
  const premarks = await Promise.all(
    premarksSrc.map(async (x) => (await import(x)).default as PremarkFn)
  );
  patchFn(
    createReadStream(source),
    createWriteStream(output),
    readFileSync(patch, { encoding: "utf-8" }).split("\n"),
    {
      filters,
      premarks,
    }
  );
}
