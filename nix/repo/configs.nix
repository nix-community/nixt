{
  inputs,
  cell,
}: let
  inherit (inputs) std;
  lib = inputs.nixpkgs.lib // builtins;
  presets = inputs.std-data-collection.data.configs;
in {
  editorconfig = lib.recursiveUpdate presets.editorconfig std.lib.cfg.editorconfig {
    data = {
      "{*.lock,package-lock.json}" = {
        charset = "unset";
        end_of_line = "unset";
        indent_size = "unset";
        indent_style = "unset";
        insert_final_newline = "unset";
        trim_trailing_whitespace = "unset";
      };
    };
  };
}
