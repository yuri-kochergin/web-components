# Web Components tools

## Packages

- [@rambler-tech/scoped-styles](packages/scoped-styles)
- [@rambler-tech/widget-element](packages/widget-element)

## Contributing

### Dev environment

#### Start

To start development you need install `yarn` and deps:

```sh
yarn install
```

#### Testing

We have a test suite consisting of a bunch of unit tests to verify utils keep working as expected. Test suit is run in CI on every commit.

To run tests:

```sh
yarn test
```

To run tests in watch mode:

```sh
yarn test:watch
```

#### Code quality

To run linting the codebase:

```sh
yarn lint
```

To check typings:

```sh
yarn typecheck
```

To check bundle size:

```sh
yarn sizecheck
```

To check licenses:

```sh
yarn licenselint
```

### Publish

To bump version of changed packages and generate changelog run:

```sh
yarn release
```

## License

MIT
