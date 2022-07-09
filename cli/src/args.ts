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
    path: { type: String, alias: 'p', defaultOption: true, defaultValue: ".", description: 'Path to the test suite' },
    watch: { type: Boolean, alias: 'w', description: 'Watch for changes at path' },
    verbose: { type: Boolean, alias: 'v', multiple: true, description: 'Show additional test info' },
    list: { type: Boolean, alias: 'l', description: `List, but don't run, tests` },
    debug: { type: Boolean, alias: 'd', description: 'Show nixt-developent relevant info' },
    help: { type: Boolean, alias: 'h', description: 'Prints this usage guide' },
},
    {
        helpArg: 'help',
        headerContentSections: [{ header: 'nixt', content: 'Test-runner for nixlang.' }],
    });
