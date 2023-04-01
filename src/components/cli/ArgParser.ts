import { provide } from "inversify-binding-decorators";
import meow from "meow";
import { IArgParser } from "../../interfaces.js";
import { CliArgs } from "../../types.js";

@provide(IArgParser)
export class ArgParser implements IArgParser {
  public run(): CliArgs {
    const meowResult = meow(
      `
Usage
  $ nixt [options] <paths>

Options
  --list, -l          List tests at path
  --watch, -w         Watch paths for changes
  --verbose, -v, -vv  Show additional details, can be set twice for trace
  --recurse           Search path recursively (Default: true)
    --no-recurse        Do not search recursively
  --debug, -d         For developers, show debug info
  --help, -h          Show this menu
`,
      {
        importMeta: import.meta,
        flags: {
          watch: {
            type: "boolean",
            alias: "w",
            default: false,
          },
          verbose: {
            type: "boolean",
            alias: "v",
            isMultiple: true,
            default: [false, false],
          },
          list: {
            type: "boolean",
            alias: "l",
            default: false,
          },
          recurse: {
            type: "boolean",
            default: true,
          },
          debug: {
            type: "boolean",
            alias: "d",
            default: false,
          },
          help: {
            type: "boolean",
            alias: "h",
            default: false,
          },
        },
      }
    );

    let parsedArgs: CliArgs;

    if (meowResult.input.length > 0) {
      parsedArgs = {
        paths: meowResult.input,
        ...meowResult.flags,
      };
    } else {
      parsedArgs = {
        paths: [],
        ...meowResult.flags,
      };
    }

    return parsedArgs;
  }
}
