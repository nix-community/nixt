import fs from 'fs';
import { getTestSet, getTestSpec } from './nix';
import { TestData, TestResult, TestRunner, TestSet, TestSpec } from './types';
import { italic } from './colors';
import { basename } from 'path';

export function dirFiles(path: string) {
  // if path doesn't exist return empty array
  if (!fs.existsSync(path)) {
    return [];
  }

  const stats = fs.statSync(path);

  // if path is filename, return it as a single-element array
  if (stats.isFile()) {
    return [path];
  }

  // if path is a directory, return all files in it
  if (stats.isDirectory()) {
    return fs.readdirSync(path)
    .map(file => `${path}/${file}`)
    .filter(file => fs.statSync(file).isFile());
  }

  return [];
}

export function nixFiles(path: string) {
  const files = dirFiles(path);
  return files.filter(file => file.endsWith('.test.nix'));
}

export function testFiles<T extends TestData>(path: string, spec: TestRunner<T>): TestResult<T> {
  const files = nixFiles(path);
  const results: T[] = [];
  const importFailures = [];
  for (const file of files) {
    try {
      const result = spec(file);
      results.push(result);
    } catch (e) {
      const error = e as Error;
      if (error.message.includes("called with unexpected argument 'nixt'")) {
        importFailures.push({ file, error: new Error(`Expression called with unexpected argument 'nixt'.\n     ${italic('Did you forget to declare "nixt" as a parameter?')}`)})
      } else {
        importFailures.push({ file, error });
      }
    }
  }
  return { results, importFailures };
}

export function testSpecs(path: string): TestResult<TestSpec> {
  return testFiles<TestSpec>(path, getTestSpec);
}

export function testSets(path: string): TestResult<TestSet> {
  return testFiles(path, getTestSet);
}