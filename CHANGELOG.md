# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2024-03-07
### Changed

- `Strategy` now verifies an `address` and `channel`, rather than a `ticket`.
This implements the more commonly used form of out-of-band authenticaiton in
which a user receives a code on a secondary channel (such as SMS) and inputs it
into the authentication session on the primary channel.  Alternate modes of
operation in which user input occurs on the secondary channel will be
implemented in a separate strategy.

### Removed

- Removed `Gateway` class and associated functionality, which will be moved to
the higher-level [`@authnomicon/oob`](https://github.com/authnomicon/oob)
framework.

## [0.0.2] - 2017-11-03
### Fixed

- `Strategy` throws `TypeError` when constructed without arguments, due to
gateway being required.

## [0.0.1] - 2017-11-03

- Initial release.

[Unreleased]: https://github.com/jaredhanson/passport-oob/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/jaredhanson/passport-oob/compare/v0.0.2...v0.1.0
[0.0.2]: https://github.com/jaredhanson/passport-oob/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/jaredhanson/passport-oob/releases/tag/v0.0.1
