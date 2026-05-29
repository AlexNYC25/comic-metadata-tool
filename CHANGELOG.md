# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.3]
### Fixed
- Updated npm publish workflow to use the correct node/action versions

### Removed
- Removed old publish workflow that was using incorrect node/action versions and had issues with generating lock files

## [1.3.2]

### Fixed
- Updated workflow to generate the lock file if not provided
- Updated the gitignore file to allow lock files to be generated and committed to the repo, since they are needed for the publish workflow to run properly

## [1.3.1]

### Added
- Added a github action workflow to automatically publish to npm on new version tags

## [1.3.0]

### Added
- Added public write API with `writeComicFileMetadata` and write-related type exports
- Added metadata serialization support for ComicInfo.xml, CoMet.xml, and ComicBookInfo comment payloads
- Added ZIP archive in-place metadata mutation helpers for XML entries and archive comments
- Added RAR archive repack-based metadata writes for XML entries and archive comments
- Added 7z archive repack-based metadata writes for XML entries
- Added integration tests for write flows and unsupported archive write behavior

### Changed
- Added write orchestration service with default format resolution (mirror existing format, fallback to ComicInfo.xml)
- Updated write target handling to update all matching metadata entries when duplicate metadata files exist in an archive
- Updated README with write API usage, format resolution behavior, and archive write support requirements

## [1.2.1]

### Fixed
- Fixed typo repo wide from "pencillers" to "pencilers

## [1.2.0]

### Added
- Added expanded support for both esm and cjs during build process
- Separate typescript configs for esm, cjs and types
= Adds separate script to help with the build process to fix esm files for js

### Changed
- Updated exports to have proper main, module and types fields
- Updated main index.ts to export types/interfaces upfront
- Updated extraction process across all file types to only extract metadata file into memory instead of the whole file

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

- Fixed package.json to have correct main entry point from absolute path to relative path

### Changed

- Updated package.json to only upload dist, readme and license to npm

## [1.0.0] - 2025-05-25

### Added

- async function to parse metadata from comic book archives (cbz, cbr, cb7) in widely used formats
- tests and example metadata for development purposes

[unreleased]: https://github.com/AlexNYC25/comic-metadata-tool/compare/v1.3.3...HEAD
[1.3.3]: https://github.com/AlexNYC25/comic-metadata-tool/compare/v1.3.2...v1.3.3
[1.3.2]: https://github.com/AlexNYC25/comic-metadata-tool/compare/v1.3.1...v1.3.2
[1.3.1]: https://github.com/AlexNYC25/comic-metadata-tool/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/AlexNYC25/comic-metadata-tool/compare/v1.2.1...v1.3.0
[1.2.1]: https://github.com/AlexNYC25/comic-metadata-tool/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/AlexNYC25/comic-metadata-tool/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/AlexNYC25/comic-metadata-tool/compare/v1.0.4...v1.1.0
[1.0.4]: https://github.com/AlexNYC25/comic-metadata-tool/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/AlexNYC25/comic-metadata-tool/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/AlexNYC25/comic-metadata-tool/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/AlexNYC25/comic-metadata-tool/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/AlexNYC25/comic-metadata-tool/releases/tag/v1.0.0