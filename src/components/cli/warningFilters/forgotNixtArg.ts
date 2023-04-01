export function forgotNixtArg(lines: string[]) {
  if (lines.length > 0) {
    if (
      lines.some((l) => l.includes(`called with unexpected argument 'nixt'`))
    ) {
      return [
        `Import error: called with unexpected argument 'nixt'`,
        `Did you forgot to add the 'nixt' argument to your test expression?`,
      ];
    }
  }
  return [];
}
