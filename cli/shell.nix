{ pkgs ? import <nixpkgs> {} }:
let
  nodeEnv = pkgs.callPackage ./node-env.nix { };
  nodePackages = pkgs.callPackage ./node-packages.nix {
    globalBuildInputs = with pkgs; [ zsh coreutils ];
    inherit nodeEnv;
  };
in nodePackages.shell.overrideAttrs (oldAttrs: rec {
    shellHook = oldAttrs.shellHook + ''
        rm -fr node_modules
        ln -s $NODE_PATH node_modules

        abort() {
            rm -fr node_modules
        }

        trap abort EXIT
    '';
})