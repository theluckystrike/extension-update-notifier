# Contributing to extension-update-notifier

Thanks for your interest in contributing. This document covers the basics.


GETTING STARTED

1. Fork the repository on GitHub.
2. Clone your fork locally.

```bash
git clone https://github.com/YOUR_USERNAME/extension-update-notifier.git
cd extension-update-notifier
npm install
```

3. Create a branch for your change.

```bash
git checkout -b my-change
```


DEVELOPMENT WORKFLOW

Build the project.

```bash
npm run build
```

Run in watch mode during development.

```bash
npm run dev
```

Run tests before submitting.

```bash
npm test
```

Run the linter.

```bash
npm run lint
```


SUBMITTING CHANGES

1. Keep commits focused on a single change.
2. Write clear commit messages that describe what changed and why.
3. Push your branch and open a pull request against the main branch.
4. Describe the change in the PR body. Include before/after behavior if relevant.


CODE STYLE

- TypeScript strict mode is enabled.
- Follow the existing patterns in src/ for naming and structure.
- No external runtime dependencies. This library runs inside Chrome extensions and must stay lightweight.


REPORTING ISSUES

Use the GitHub issue tracker. Include the following where possible.

- Steps to reproduce the problem
- Expected behavior vs actual behavior
- Chrome version and manifest version
- Relevant error messages or console output


FEATURE REQUESTS

Open an issue describing the use case and why the feature would be useful. Include code examples if you can.


LICENSE

By contributing, you agree that your contributions will be licensed under the MIT License.
