# Nx NestJS DDD

Nx NestJS DDD is a project that contains many generators to generate a NestJS code base on Domain Driven Design and Clean Architecture using Nx generators.

Supported generators for

- Domain
- Application
- Infrastructure

And continuously implement new generators.

> **Note:** Your project should be an Nx project to use those generators

## Installation

To install the project, use the following command:

```bash
npm install -D nx-nest-ddd
```

## Usage

### Domain generators

![](https://github.com/thinhkhang97/nx-nest-ddd/blob/demo/demo/Screen%20Recording%20Domain%20generators.gif?raw=true)

Generate a domain

```bash
nx g nx-nest-ddd:domain <sub-domain name>
```

Components: Aggregate, entity, event, exception, repository, service, value object

```bash
nx g nx-nest-ddd:domain-entity <name> <sub-domain name>
```

### Application generators

![](https://github.com/thinhkhang97/nx-nest-ddd/blob/demo/demo/Screen%20Recording%20Application%20generators.gif?raw=true)
Generate an application

```bash
nx g nx-nest-ddd:application <sub-domain name>
```

Components: Query, command, event

```bash
nx g nx-nest-ddd:application-query <name> <sub-domain name>
```

### Infrastructure generators

Generate an infrastructure

```bash
nx g nx-nest-ddd:infrastructure <sub-domain name>
```

Components: Orm entity, orm mapper, repository

```bash
nx g nx-nest-ddd:infrastructure-orm-entity <name> <sub-domain name>
```

## Contributing

We welcome contributions to the Nx NestJS DDD project! Here are the steps to get started:

1. Fork the project repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes.
4. Submit a pull request with your changes.

## Contact

If you have any questions, issues, or want to contribute, please feel free to reach out to us:

- Project Maintainer: [thinhkhang97](mailto:thinhkhang97@gmail.com)
