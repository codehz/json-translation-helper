import { generate } from "./generate";
import { patch as patchFn } from "./patch";
import { createReadStream, createWriteStream, readFileSync } from "node:fs";
import arg from "arg";
import { parseCommands } from "minimist-subcommand";

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
  console.error("  generate [source-file] -p [patch-file]");
  console.error("  patch [source-file] -p [patch-file] -o [destination-file]");
  process.exit(1);
}

if (command === "generate") {
  let {
    _: [source],
    "--patch": patch,
  } = arg(
    {
      "--patch": String,
      "-p": "--patch",
    },
    { argv }
  );
  if (!source) {
    console.error("No source file specified");
    process.exit(1);
  }
  patch ??= source + ".patch.txt";
  generate(createReadStream(source), createWriteStream(patch));
} else if (command === "patch") {
  let {
    _: [source],
    "--patch": patch,
    "--output": output,
  } = arg(
    {
      "--patch": String,
      "--output": String,
      "-p": "--patch",
      "-o": "--output",
    },
    { argv }
  );
  if (!source) {
    console.error("No source file specified");
    process.exit(1);
  }
  patch ??= source + ".patch.txt";
  output ??= source + ".new";
  patchFn(
    createReadStream(source),
    createWriteStream(output),
    readFileSync(patch, { encoding: "utf-8" }).split("\n")
  );
}
