---
title: Node.js Versioning
description: How to pin specific Node.js minor and patch versions in Nixpacks using nixpkgs archive overrides.
---

# Node.js Versioning in Nixpacks

Nixpacks only supports **major version** specification for Node.js. This page explains the limitation and provides a workaround for pinning specific minor or patch versions.

## Understanding the Limitation

According to the [Nixpacks Node provider documentation](https://nixpacks.com/docs/providers/node?utm_source=coolify.io):

> "Only a major version can be specified. For example, `18.x` or `20`."

When you specify a Node.js version via:

- `NIXPACKS_NODE_VERSION` environment variable
- `engines.node` in `package.json`
- `.nvmrc` or `.node-version` files

You can only control the **major version** (e.g., `20`, `22`). The specific minor and patch version (e.g., `22.13.1` vs `22.14.0`) is determined by the nixpkgs archive that Nixpacks uses internally.

## The Problem

You set `"node": ">=22"` in your `package.json` or `NIXPACKS_NODE_VERSION=22`, but your application needs Node 22.14.0 specifically. Nixpacks may instead provide 22.12.0 or another patch version from its default nixpkgs archive—causing runtime issues if your code depends on features from a newer patch.

## Workaround

To pin a specific minor/patch version, you can override the nixpkgs archive in your `nixpacks.toml` file. Create this file in your repository root:

```toml
[phases.setup]
nixpkgsArchive = '51ad838b03a05b1de6f9f2a0fffecee64a9788ee'
```

The `nixpkgsArchive` value is a commit SHA from the [NixOS/nixpkgs repository](https://github.com/NixOS/nixpkgs?utm_source=coolify.io). Each commit contains specific package versions, so by pinning a commit, you control the exact versions available.

## Finding the Right Archive Commit

To find a nixpkgs commit containing your required Node.js version:

1. Browse the [NixOS/nixpkgs repository](https://github.com/NixOS/nixpkgs?utm_source=coolify.io)
2. Search for files like `v20.nix`, `v22.nix`, or `v24.nix` (the Node.js version definition files)
3. Check the commit history for when your desired version was added
4. Copy the full commit SHA

**Some verified commits for Node.js:**

- `51ad838b03a05b1de6f9f2a0fffecee64a9788ee` → Node 22.13.1
- `bf744fe90419885eefced41b3e5ae442d732712d` → Node 22.x versions
- `ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7` → Node 22.14.0 (unstable branch)

Learn more in the Nixpacks docs on [nixpkgs archive](https://nixpacks.com/docs/configuration/file#nixpkgs-archive?utm_source=coolify.io).

## Node.js Version Reference (SHA256 Hashes)

The following tables list Node.js versions and their SHA256 hashes from the nixpkgs history. These can help you verify you're getting the expected version when working with nixpkgs archives.

::: warning USE AT YOUR OWN RISK
These hashes are provided for reference only. They have not been verified for accuracy nor stability. Test thoroughly before using in production.
:::

### Node.js 20.x

| Version | SHA256                                                             |
| ------- | :------------------------------------------------------------------ |
| 20.0.0  | `sha256-dFDnV5Vo99HLOYGFz85HLaKDeyqjbFliCyLOS5d7XLU=`              |
| 20.1.0  | `sha256-YA+eEYYJlYFLkSKxrFMY9q1WQnR4Te7ZjYqSBmSUNrU=`              |
| 20.2.0  | `sha256-IlI98jFsNVaXFP8fabBTwuKGztRgiYQX3uRpRe/N+Yk=`              |
| 20.3.0  | `sha256-G6jUlCPtOnVykGa7PqJkk+6ct9ZWjvlIWX/J70VPdDU=`              |
| 20.3.1  | `sha256-EqgtswZpeVm0OJs1Gl+XhImGsTE/mQGw4LPYz08/mZE=`              |
| 20.4.0  | `sha256-Cb0Lc8UmtjwCnV3f2IXRCWLnrYfJdblFg8H4zpDuU0g=`              |
| 20.5.0  | `sha256-yzJ1aVje8cBOBpp5txtSymHtFZDBfyz6HuOvZB9y4Fg=`              |
| 20.5.1  | `sha256-Q5xxqi84woYWV7+lOOmRkaVxJYBmy/1FSFhgScgTQZA=`              |
| 20.6.0  | `sha256-nvtcunqPSxjTiw19N6mzDe1zOQyE44DPTeianTCn1vo=`              |
| 20.6.1  | `sha256-Ouxeco2qOIAMNDsSkiHTSIBkolKaObtUZ7xVviJsais=`              |
| 20.7.0  | `sha256-P8/c0FxGFRdIBZZZZnTfhbNc/OWX3QrjP1QW/E3xK+o=`              |
| 20.8.0  | `sha256-QSvoR65t9hAQup2jzD5r5bZ6oALjVOkZ9Z7INgNxcEw=`              |
| 20.8.1  | `sha256-95nGb2pjhruKwsdaN490DEVel/H+lkOT3TnJ+fbvvHA=`              |
| 20.9.0  | `sha256-oj2WgQq/BFVCazSdR85TEPMwlbe8BXG5zFEPSBw6RRk=`              |
| 20.10.0 | `sha256-MuslbuvYys1VdOZjHlS0K+fsjr4lrUeoymhUA7rRVTU=`              |
| 20.11.0 | `sha256-MYB+vu6wScU/F2XkqVrtaUdqS2lt0QDLU5q2aNeVC0A=`              |
| 20.11.1 | `sha256-d4E+2/P38W0tNdM1NEPe5OYdXuhNnjE4x1OKPAylIJ4=`              |
| 20.12.0 | `sha256-duU0bOv9WBUo9pn3ZPTRpuh8uBi2lnCPI13ctiWg940=`              |
| 20.12.1 | `sha256-aEDUkLpNHVFlXg++EgmVahXbQFUQ1+oWa62YqMnTek4=`              |
| 20.12.2 | `sha256-18vMX7+zHpAB8/AVC77aWavl3XE3qqYnOVjNWc41ztc=`              |
| 20.14.0 | `sha256-CGVQKPDYQ26IFj+RhgRNY10/Nqhe5Sjza9BbbF5Gwbs=`              |
| 20.15.0 | `sha256-D0p6BRw12V65BejLKqQ8XUArExIDkI/mM+s8+gUO+Qc=`              |
| 20.15.1 | `sha256-/dU6VynZNmkaKhFRBG+0iXchy4sPyir5V4I6m0D+DDQ=`              |
| 20.16.0 | `cd6c8fc3ff2606aadbc7155db6f7e77247d2d0065ac18e2f7f049095584b8b46` |
| 20.17.0 | `9abf03ac23362c60387ebb633a516303637145cb3c177be3348b16880fd8b28c` |
| 20.18.0 | `7d9433e91fd88d82ba8de86e711ec41907638e227993d22e95126b02f6cd714a` |
| 20.18.1 | `91df43f8ab6c3f7be81522d73313dbdd5634bbca228ef0e6d9369fe0ab8cccd0` |
| 20.18.2 | `69bf81b70f3a95ae0763459f02860c282d7e3a47567c8afaf126cc778176a882` |
| 20.18.3 | `0674f16f3bc284c11724cd3f7c2a43f7c2c13d2eb7a872dd0db198f3d588c5f2` |
| 20.19.0 | `5ac2516fc905b6a0bc1a33e7302937eac664a820b887cc86bd48c035fba392d7` |
| 20.19.1 | `5587b23e907d0c7af2ea8a8deb33ec50010453b46dbb3df5987c5678eee5ed51` |
| 20.19.2 | `4a7ff611d5180f4e420204fa6f22f9f9deb2ac5e98619dd9a4de87edf5b03b6e` |
| 20.19.3 | `99be7b9d268d48b93be568a23240398ceacb0782dc7055b9972305c000b0e292` |
| 20.19.4 | `b87fd7106013d3906706913ffc63a4403715fbb272c4f83ff4338527353eec0f` |
| 20.19.5 | `230c899f4e2489c4b8d2232edd6cc02f384fb2397c2a246a22e415837ee5da51` |
| 20.19.6 | `2026f9ff52c286d7c7d99932b21be313d1736aea524c5aff1748d41ab0bd9a20` |

### Node.js 22.x

| Version | SHA256                                                             |
| ------- | :------------------------------------------------------------------ |
| 22.0.0  | `sha256-IuKPv/MfaQc7gCTLQnReUQX4QEHzR1smC5fVoUEDnRo=`              |
| 22.1.0  | `sha256-nX1fQNnb1iYMmbXklLX5vHVejw/6xw4SGtzl+0QvI8s=`              |
| 22.2.0  | `sha256-iJkIqIKNFISRDX5lm2qlet6NUo/w45Dpp372WadihHQ=`              |
| 22.3.0  | `0k0h4s9s2y0ms3g6xhynsqsrkl9hz001dmj6j0gpc5x5vk8mpf5z`             |
| 22.4.0  | `sha256-KStDAITy8ykT3H2k6y+8iWklJ3Kp0b/ormxLSpjKOtM=`              |
| 22.4.1  | `sha256-ZfyFf1qoJWqvyQCzRMARXJrq4loCVB/Vzg29Tf0cX7k=`              |
| 22.5.1  | `924f381a32cf26b6bedbe95feedde348450f4fd321283d3bf3f7965aa45ce831` |
| 22.6.0  | `37259d618d5565ca55acc2585045c7e1c5b9965a3d4eb44c0a237fdae84b9d44` |
| 22.7.0  | `1e0b6f2f2ca4fb0b4644a11363169daf4b7c42f00e5a53d2c65a9fdc463e7d88` |
| 22.8.0  | `f130e82176d1ee0702d99afc1995d0061bf8ed357c38834a32a08c9ef74f1ac7` |
| 22.9.0  | `a55aeb368dee93432f610127cf94ce682aac07b93dcbbaadd856df122c9239df` |
| 22.10.0 | `3180710d3130ad9df01466abf010e408d41b374be54301d1480d10eca73558e0` |
| 22.11.0 | `bbf0297761d53aefda9d7855c57c7d2c272b83a7b5bad4fea9cb29006d8e1d35` |
| 22.12.0 | `fe1bc4be004dc12721ea2cb671b08a21de01c6976960ef8a1248798589679e16` |
| 22.13.1 | `cfce282119390f7e0c2220410924428e90dadcb2df1744c0c4a0e7baae387cc2` |
| 22.14.0 | `c609946bf793b55c7954c26582760808d54c16185d79cb2fb88065e52de21914` |
| 22.15.0 | `e7c4226d1d92f33ad854d6da4f7e519e77690b8e73f93496881f8c539174d9df` |
| 22.15.1 | `c19f0177d21c621746625e5f37590bd0d79a72043b77b53784cba5f145e7263e` |
| 22.16.0 | `720894f323e5c1ac24968eb2676660c90730d715cb7f090be71a668662a17c37` |
| 22.17.0 | `7a3ef2aedb905ea7926e5209157266e2376a5db619d9ac0cba3c967f6f5db4f9` |
| 22.17.1 | `327415fd76fcebb98133bf56e2d90e3ac048b038fac2676f03b6db91074575b9` |
| 22.18.0 | `120e0f74419097a9fafae1fd80b9de7791a587e6f1c48c22b193239ccd0f7084` |
| 22.19.0 | `0272acfce50ce9ad060288321b1092719a7f19966f81419835410c59c09daa46` |
| 22.20.0 | `ff7a6a6e8a1312af5875e40058351c4f890d28ab64c32f12b2cc199afa22002d` |
| 22.21.1 | `487d73fd4db00dc2420d659a8221b181a7937fbc5bc73f31c30b1680ad6ded6a` |

### Node.js 24.x

| Version     | SHA256                                                             |
| ----------- | :------------------------------------------------------------------ |
| 24.0.0-rc.2 | `729fca42bb7266031dd020f3935423ea8d4b4e2d119b34b608f1d079e5c1621a` |
| 24.0.0-rc.3 | `9bbca08fba05f075a20f734ea80b195a4a39218476b60b32db79e1d393fda20b` |
| 24.0.0      | `914f3f1b03f84a0994d7357f190ff13c038800c693b6c06da2290eb588c82761` |
| 24.0.1      | `70271026971808409a7ed6444360d5fe3ef4146c1ca53f2ca290c60d214be84e` |
| 24.0.2      | `1597075afc06e5c6145d0bfbd77e2072c2ec0ab71ac4950cf008b2641374cd71` |
| 24.1.0      | `c8171b2aeccb28c8c5347f273a25adae172fb2a65bc8c975bc22ec58949d0eaf` |
| 24.2.0      | `40143d43efbdeeb9537995f532126c494d63a31da332acb5022f76f00afc62ab` |
| 24.3.0      | `eb688ef8a63fda9ebc0b5f907609a46e26db6d9aceefc0832009a98371e992ed` |
| 24.4.0      | `42fa8079da25a926013cd89b9d3467d09110e4fbb0c439342ebe4dd6ecc26bbb` |
| 24.4.1      | `adb79ca0987486ed66136213da19ff17ef6724dcb340c320e010c9442101652f` |
| 24.5.0      | `f1ba96204724bd1c6de7758e08b3718ba0b45d87fb3bebd7e30097874ccc8130` |
| 24.6.0      | `8ad5c387b5d55d8f3b783b0f1b21bae03a3b3b10ac89a25d266cffa7b795e842` |
| 24.7.0      | `cf74a77753b629ffebd2e38fb153a21001b2b7a3c365c0ec7332b120b98c7251` |
| 24.8.0      | `1c03b362ebf4740d4758b9a3d3087e3de989f54823650ec80b47090ef414b2e0` |
| 24.9.0      | `f17bc4cb01f59098c34a288c1bb109a778867c14eeb0ebbd608d0617b1193bbf` |
| 24.10.0     | `f17e36cb2cc8c34a9215ba57b55ce791b102e293432ed47ad63cbaf15f78678f` |
| 24.11.0     | `cf9c906d46446471f955b1f2c6ace8a461501d82d27e1ae8595dcb3b0e2c312a` |
| 24.11.1     | `ea4da35f1c9ca376ec6837e1e30cee30d491847fe152a3f0378dc1156d954bbd` |
| 24.12.0     | `6d3e891a016b90f6c6a19ea5cbc9c90c57eef9198670ba93f04fa82af02574ae` |

### Node.js 25.x

| Version | SHA256                                                             |
| ------- | :------------------------------------------------------------------ |
| 25.2.1  | `aa7c4ac1076dc299a8949b8d834263659b2408ec0e5bba484673a8ce0766c8b9` |
