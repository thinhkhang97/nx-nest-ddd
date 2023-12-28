# Nx Nest DDD

This Nx plugin aims to streamline the development process by generating code for a NestJS application adhering to Domain-Driven Design (DDD) principles and Clean Architecture. It assists in setting up the foundational layers of a robust application, including:

- Domain Layer: Defining the core business logic and entities.
- Application Layer: Implementing use cases, application services, and orchestrating domain entities.
- Infrastructure Layer: Managing external dependencies, databases, and other infrastructure-related concerns.
- GraphQL UI Layer: Providing a GraphQL-based user interface for interacting with the application.

![](https://github.com/thinhkhang97/nx-nest-ddd/blob/demo/demo/Screen%20Recording%20Micro-service%20application%20generator.gif?raw=true)

## Features

- Code Generation: Automatically generates boilerplate code for various layers based on DDD and Clean Architecture principles.
- Layered Structure: Ensures a clear separation of concerns and promotes maintainability and scalability.
- Customizable Templates: Tailor the generated code templates to fit specific project requirements.
- Integrated Nx Dev Tools: Seamlessly integrates with Nx Dev Tools for efficient development, testing, and building.

## Installation

To use this plugin in your Nx workspace, follow these steps:

```bash
  npm install -D nx-nest-ddd
```

## Usage

Use can use [nx console](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console) as an UI for generate code or use CLI commands below to generate code.

### Microservice application generator

This command will generate an application with all the necessary layers.

```bash
nx g nx-nest-ddd:sub-domain <name> <options>
```

| Option                   | Type    | Accepted values      | Default | Description                                                                                                                                                                            |
| ------------------------ | ------- | -------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name                     | string  |                      |         | What name would you like to use?                                                                                                                                                       |
| templatePath             | string  |                      |         | A directory where you place the custom template                                                                                                                                        |
| directory                | string  |                      |         | A directory where the application is placed.                                                                                                                                           |
| projectNameAndRootFormat | string  | as-provided, derived |         | Whether to generate the project name and root directory as provided (`as-provided`) or generate them composing their values and taking the configured layout into account (`derived`). |
| tags                     | string  |                      |         | Add tags to the application (used for linting).                                                                                                                                        |
| skipFormat               | boolean |                      | true    | Skip formatting files.                                                                                                                                                                 |
| strict                   | boolean |                      | true    | Whether to enable tsconfig strict mode or not.                                                                                                                                         |
| setParserOptionsProject  | boolean |                      | false   | Whether or not to configure the ESLint "parserOptions.project" option. We do not do this by default for lint performance reasons.                                                      |
| skipPackageJson          | boolean |                      | true    | Do not add dependencies to `package.json`.                                                                                                                                             |

### Domain generator

Generate a domain with subdomain name. The options are the base options

```bash
nx g nx-nest-ddd:domain <sub-domain name> <options>
```

You can generate smaller components by following commands:

```bash
nx g nx-nest-ddd:domain-aggregate <name> <sub-domain name> <options>

nx g nx-nest-ddd:domain-entity <name> <sub-domain name> <options>

nx g nx-nest-ddd:domain-event <name> <sub-domain name> <options>

nx g nx-nest-ddd:domain-exception <name> <sub-domain name> <options>

nx g nx-nest-ddd:domain-repository <name> <sub-domain name> <options>

nx g nx-nest-ddd:domain-service <name> <sub-domain name> <options>

nx g nx-nest-ddd:domain-value-object <name> <sub-domain name> <options>
```

### Application generator

Generate an application / use cases layer code using CQRS with subdomain name. The options are the base options

```bash
nx g nx-nest-ddd:application <sub-domain name> <options>
```

For smaller component generators:

```bash
nx g nx-nest-ddd:application-query <name> <sub-domain name> <options>

nx g nx-nest-ddd:application-command <name> <sub-domain name> <options>

nx g nx-nest-ddd:application-event <name> <sub-domain name> <options>
```

### Infrastructure generator

Generate an infrastructure layer code with subdomain name. The options are the base options

```bash
nx g nx-nest-ddd:infrastructure <sub-domain name> <options>
```

For smaller component generators:

```bash
nx g nx-nest-ddd:infrastructure-orm-entity <name> <sub-domain name> <options>

nx g nx-nest-ddd:infrastructure-orm-mapper <name> <sub-domain name> <options>

nx g nx-nest-ddd:infrastructure-repository <name> <sub-domain name> <options>
```

### Graphql generator

Generate a grapqh ui with subdomain name. The options are the base options

```bash
nx g nx-nest-ddd:graphql-ui <sub-domain name> <options>
```

For smaller component generators:

```bash
nx g nx-nest-ddd:graphql-query <name> <sub-domain name> <options>

nx g nx-nest-ddd:graphql-mutation <name> <sub-domain name> <options>
```

## Base options

### Layer base options

This base options use for these generators:

- Domain
- Application
- Infrastructure
- Graphql ui

| Option                   | Type    | Accepted Values                                                          | Default | Description                                                                                                                                                                            |
| ------------------------ | ------- | ------------------------------------------------------------------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name                     | string  |                                                                          |         | Subdomain name. Required.                                                                                                                                                              |
| templatePath             | string  |                                                                          |         | A directory where you place the custom template                                                                                                                                        |
| directory                | string  |                                                                          |         | A directory where the domain is placed. Alias: dir                                                                                                                                     |
| projectNameAndRootFormat | string  | as-provided, derived                                                     |         | Whether to generate the project name and root directory as provided (`as-provided`) or generate them composing their values and taking the configured layout into account (`derived`). |
| tags                     | string  |                                                                          |         | Add tags to the domain (used for linting). Alias: t                                                                                                                                    |
| skipFormat               | boolean |                                                                          | true    | Skip formatting files.                                                                                                                                                                 |
| skipTsConfig             | boolean |                                                                          | false   | Do not update tsconfig.base.json for development experience.                                                                                                                           |
| publishable              | boolean |                                                                          |         | Create a publishable library.                                                                                                                                                          |
| importPath               | string  |                                                                          |         | The library name used to import it, like @myorg/my-awesome-lib. Must be a valid npm name.                                                                                              |
| testEnvironment          | string  | jsdom, node                                                              | node    | The test environment for jest, for node applications this should stay as node unless doing DOM testing.                                                                                |
| target                   | string  | es5, es6, esnext, es2015, es2016, es2017, es2018, es2019, es2020, es2021 | es2021  | The ES target, Nest suggest using es2021 or higher.                                                                                                                                    |
| strict                   | boolean |                                                                          | true    | Whether to enable tsconfig strict mode or not.                                                                                                                                         |
| setParserOptionsProject  | boolean |                                                                          | false   | Whether or not to configure the ESLint "parserOptions.project" option. We do not do this by default for lint performance reasons.                                                      |
| skipPackageJson          | boolean |                                                                          | true    | Do not add dependencies to `package.json`.                                                                                                                                             |
| simpleName               | boolean |                                                                          | false   | Don't include the directory in the name of the module of the library.                                                                                                                  |

### Component base options

These options for smaller components in a layer such as aggregate, entity, query, etc.

| Option       | Type   | Accepted values | Default | Description                                                                                           |
| ------------ | ------ | --------------- | ------- | ----------------------------------------------------------------------------------------------------- |
| name         | string |                 |         | What name would you like to use?                                                                      |
| subDomain    | string |                 |         | Sub domain contains this aggregate                                                                    |
| sourceRoot   | string |                 |         | The directory where the new aggregate will be created. This option will override 'subDomain' argument |
| templatePath | string |                 |         | A directory where you place the custom template                                                       |

## Template usage

As mention, you can customize the generation by providing your template. You can refer the template folder in the source code to know the file structure and use the `--template-path` option to provide the template path when generate

## Acknowledgements

- [Domain driven hexagon](https://github.com/Sairyss/domain-driven-hexagon)
- [NestJs workspace with Nx](https://nx.dev/nx-api/nest/documents/overview)

## Roadmap

- Add serverless generators
- Add more ui generators like RESTful UI, socket, etc

## Contributing

We welcome contributions to the Nx NestJS DDD project! Here are the steps to get started:

1. Fork the project repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes.
4. Submit a pull request with your changes.

## Contact

If you have any questions, issues, or want to contribute, please feel free to reach out to us:

- Me: [thinhkhang97](mailto:thinhkhang97@gmail.com)
