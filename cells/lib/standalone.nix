{
  inputs,
  cell,
}: {
  # Enables support for the "standalone" style which uses
  # {nixt, pkgs ? import <nixpkgs> {}}: functions as seen in non-flake projects.
  inject = path: import path {nixt = cell.nixt;};
}
