let
  holonixPath = builtins.fetchTarball "https://github.com/holochain/holonix/archive/1f19ee64fe32f0bbed71257bcb396a8028baa622.tar.gz";
  holonix = import (holonixPath) {
    holochainVersionId = "v0_0_126";
  };
  nixpkgs = holonix.pkgs;
in nixpkgs.mkShell {
  inputsFrom = [ holonix.main ];
  packages = with nixpkgs; [
    # Additional packages go here
    nodejs-16_x
  ];
}