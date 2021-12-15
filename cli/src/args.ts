import { parse } from 'ts-command-line-args';


export interface NixtCliArgs{
    path: string;
    debug: boolean;
    verbose: boolean;
    list: boolean;
    help: boolean;
 }

 export const parseArgs = () => parse<NixtCliArgs>({
    path: { type: String, alias: 'p', description: 'Path to the test suite [required]' },
    debug: { type: Boolean, alias: 'd', description: 'Show nixt-developent relevant info' },
    verbose: { type: Boolean, alias: 'v', description: 'Show additional test info' },
    list: { type: Boolean, alias: 'l', description: `List, but don't run, tests` },
    help: { type: Boolean, alias: 'h', description: 'Prints this usage guide' },
},
{
    helpArg: 'help',
    headerContentSections: [{ header: 'nixt', content: 'Test-runner for nixlang.' }],
});

