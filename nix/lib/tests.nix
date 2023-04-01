{
  inputs,
  cell,
}: let
  inherit (inputs.cells.lib) nixt;
in
  nixt.grow {
    blocks = [(import ./nixt.spec.nix {inherit inputs cell;})];
  }
