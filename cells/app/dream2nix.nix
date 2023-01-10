{
  inputs,
  cell,
}: let
  inherit (inputs) std dream2nix self;
in
  dream2nix.lib.makeFlakeOutputs {
    systems = [inputs.nixpkgs.system];
    config.projectRoot = self;
    source = std.incl self [
      (self + /package.json)
      (self + /package-lock.json)
      (self + /tsconfig.json)
      (self + /src)
      (self + /nix)
    ];
    settings = [
      {
        subsystemInfo.nodejs = 18;
      }
    ];
  }
