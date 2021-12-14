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
    debug: { type: Boolean, alias: 'd' },
    verbose: { type: Boolean, alias: 'v' },
    list: { type: Boolean, alias: 'l' },
    help: { type: Boolean, alias: 'h', description: 'Prints this usage guide' },
},
{
    helpArg: 'help',
    headerContentSections: [{ header: 'nixt', content: 'Simple nixlang test-runner' }],
});

