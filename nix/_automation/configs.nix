{
  inputs,
  cell,
}: let
  inherit (inputs) nixpkgs;
  inherit (inputs.std) std;
in {
  editorconfig = std.nixago.editorconfig {
    configData = {
      root = true;

      "*" = {
        charset = "utf-8";
        end_of_line = "lf";
        indent_size = 2;
        indent_style = "space";
        insert_final_newline = true;
        max_line_length = 120;
        trim_trailing_whitespace = true;
      };

      "*.md" = {
        max_line_length = "off";
        trim_trailing_whitespace = false;
      };

      "*.{diff,patch}" = {
        end_of_line = "unset";
        insert_final_newline = "unset";
        indent_size = "unset";
        trim_trailing_whitespace = "unset";
      };

      "{LICENSES/**,LICENSE,*.lock,package-lock.json}" = {
        charset = "unset";
        end_of_line = "unset";
        indent_size = "unset";
        indent_style = "unset";
        insert_final_newline = "unset";
        trim_trailing_whitespace = "unset";
      };
    };
    hook.mode = "copy";
  };
  treefmt = std.nixago.treefmt {
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
  lefthook = std.nixago.lefthook {
    configData = {
      pre-commit.commands = {
        treefmt = {
          run = "${nixpkgs.treefmt}/bin/treefmt --fail-on-change {staged_files}";
          skip = ["merge" "rebase"];
        };
        editorconfig-checker = {
          run = "${nixpkgs.editorconfig-checker}/bin/editorconfig-checker {staged_files}";
          skip = ["merge" "rebase"];
        };
      };
    };
  };
}
