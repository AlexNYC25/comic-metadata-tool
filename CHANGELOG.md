# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0]

### Added
- Added option support to specify what kind of comic metadata file/data to parse

### Changed
- Updated interface representing comicinfo.xml's parsed data so that it's properties are in camel case to be uniform with other interfaces and interface standard

## [1.0.4] - 2025-07-14

### Fixed

- Fixed package export to export types as well

## [1.0.3] - 2025-07-13

### Added

- .d.ts files in dist, for better typescript support when using published package on npm

### Changed

- Updated the tsconfig.json to export .d.ts files generated during building

## [1.0.2] - 2025-06-07

### Added

- changelog to keep track of project
- MIT license file

### Changed

- Updated the readme to have example installation/usage


## [1.0.1] - 2025-05-25

### Fixed

- Fixed package.json to have correct main entry point from absolute path to relateive path

### Changed

- Updated package.json to only upload dist, readme and license to npm

## [1.0.0] - 2025-05-25

### Added

- async function to parse metadata from comic book archives (cbz, cbr, cb7) in widely used formats
- tests and example metadata for deveolpment purposes

[unreleased]: https://github.com/AlexNYC25/comic-metadata-tool/compare/v1.0.1...HEAD
[1.1.0]: https://github.com/AlexNYC25/comic-metadata-tool/compare/v1.0.4...v1.1.0
[1.0.4]: https://github.com/AlexNYC25/comic-metadata-tool/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/AlexNYC25/comic-metadata-tool/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/AlexNYC25/comic-metadata-tool/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/AlexNYC25/comic-metadata-tool/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/AlexNYC25/comic-metadata-tool/releases/tag/v1.0.0