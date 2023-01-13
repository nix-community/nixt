{
  inputs,
  cell,
}: let
  inherit (inputs.cells.lib) nixt;
in
  nixt.grow {
    blocks = [
      (nixt.stack ./nixt.spec.nix (import ./nixt.spec.nix {inherit inputs cell;}))
    ];
  }
