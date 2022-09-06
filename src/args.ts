import { parse } from 'ts-command-line-args';

import { injectable } from 'inversify';
import { IArgParser } from './interfaces';

import { CliArgs } from './types';

@injectable()
export class ArgParser implements IArgParser {
    run(): CliArgs {
        const parsedArgs = parse<CliArgs>({
            path: { type: String, alias: 'p', optional: true, defaultOption: true, defaultValue: ".", description: 'Path to the test suite' },
            watch: { type: Boolean, alias: 'w', optional: true, description: 'Watch for changes at path' },
            verbose: { type: Boolean, alias: 'v', optional: true, multiple: true, defaultValue: [false, false], description: 'Show additional test info' },
            list: { type: Boolean, alias: 'l', optional: true, description: `List, but don't run, tests` },
            debug: { type: Boolean, alias: 'd', optional: true, description: 'Show nixt-developent relevant info' },
            help: { type: Boolean, alias: 'h', optional: true, description: 'Prints this usage guide' },
        },
            {
                helpArg: 'help',
                headerContentSections: [{ header: 'nixt', content: 'Test-runner for nixlang.' }],
            });
        return parsedArgs;
    }
}
