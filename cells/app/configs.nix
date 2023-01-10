{
  inputs,
  cell,
}: let
  inherit (inputs) std nixpkgs;
in {
  treefmt = std.std.nixago.treefmt {
    packages = [
      nixpkgs.alejandra
      nixpkgs.nodePackages.prettier
    ];
    configData.formatter = {
      nix = {
        command = "alejandra";
        includes = ["*.nix"];
      };
      prettier = {
        command = "prettier";
        includes = ["*.md" "*.ts" "*.json"];
      };
    };
  };
  editorconfig = std.presets.nixago.editorconfig;
  lefthook = std.std.nixago.lefthook {
    configData = {
      pre-commit.commands = {
        treefmt.run = "${nixpkgs.treefmt}/bin/treefmt {staged_files}";
        editorconfig-checker.run = "${nixpkgs.editorconfig-checker}/bin/editorconfig-checker {staged_files}";
      };
    };
  };
}
