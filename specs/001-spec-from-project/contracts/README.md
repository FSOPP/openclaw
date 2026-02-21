# Contracts: Spec from Project — `/speckit.discover`

This directory defines the interfaces and contracts for the discover command.
Since the feature is implemented as an agent prompt + shell script (no REST API
or service boundary), contracts are expressed as **CLI interface contracts** and
**file format contracts**.

## Contract Index

| Contract               | Type             | File                                                   |
| ---------------------- | ---------------- | ------------------------------------------------------ |
| Setup Script CLI       | Shell script I/O | [setup-discover-cli.md](setup-discover-cli.md)         |
| Spec Output Format     | File format      | [spec-output-format.md](spec-output-format.md)         |
| Agent Prompt Interface | Prompt contract  | [agent-prompt-interface.md](agent-prompt-interface.md) |
