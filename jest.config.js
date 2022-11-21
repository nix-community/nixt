export default {
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  transform: {
    '\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        astTransformers: {
          before: [
            'node_modules/ts-jest-mock-import-meta'
          ]
        },
        diagnostics: {
          ignoreCodes: [1343]
        }
      }
    ]
  }
}
