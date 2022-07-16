import { parse } from 'ts-command-line-args';


export interface NixtCliArgs {
    path: string;
    watch: boolean;
    verbose: boolean[];
    list: boolean;
    debug: boolean;
    help: boolean;
}

export const parseArgs = () => parse<NixtCliArgs>({
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
