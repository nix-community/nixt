{
  inputs,
  cell,
}: {
  default = cell.packages.nixt;
  nixt = cell.dream2nix.packages.${inputs.nixpkgs.system}.default;
}
