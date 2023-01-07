{ inputs, cell }:
{
  default = cell.packages.nixt;
  nixt = cell.dream2nix.outputs.packages.${inputs.nixpkgs.system}.default;
}
