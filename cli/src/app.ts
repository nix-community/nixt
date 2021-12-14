import path from 'path';

import { NixtCliArgs, parseArgs } from './args';
import { testSets, testSpecs } from './discovery';
import { ListingRenderer, ResultsRenderer } from './rendering';
import { TestResult, TestSet, TestSpec } from './types';

export class NixtApp {
    args: NixtCliArgs;
    absoluteTestPath: string;
    absolutePath: string;
    nixPath: string;

    constructor() {
        this.args = parseArgs();
        this.absoluteTestPath = path.resolve(this.args.path);
        this.absolutePath = path.resolve(__filename);
        this.nixPath = path.resolve(this.absolutePath, '../../nix');
    }

    run() {
        const getter = this.args.list
            ? testSpecs
            : testSets;

        const files = getter(this.absoluteTestPath);

        const renderer = this.args.list
            ? new ListingRenderer(files as TestResult<TestSpec>, this.absolutePath, this.args.verbose)
            : new ResultsRenderer(files as TestResult<TestSet>, this.absolutePath, this.args.verbose);

        renderer.render();
    }
}