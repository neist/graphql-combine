[![NPM version](https://img.shields.io/npm/v/graphql-combine.svg)](https://www.npmjs.com/package/graphql-combine)

Split your GraphQL schemas and resolver objects into different files and combine them with this tool.

# Getting started

## Install it
```bash
$ npm install graphql-combine
```

## Folder structure
```
graphql/
  |-- author/
      |-- schema.graphql
      |-- resolver.js
  |-- post/
      |-- schema.graphql
      |-- resolver.js
index.js
```

## Files
File: _graphql/author/schema.graphql_
```graphql
type Author {
  id: Int!
  firstName: String
  lastName: String
  books: [Book]
}

type Query {
  author(id: Int!): Author
}
```
File: _graphql/author/resolver.js_
```js
export default {
  Query: {
    author: () => {
      //...
    }
  }
}
```
File: _graphql/book/schema.graphql_
```graphql
type Book {
  title: String
  author: Author
}

type Query {
  book(id: Int!): Book
}
```
File: _graphql/book/resolver.js_
```js
export default {
  Query: {
    book: () => {
      //...
    }
  }
}
```

## Start the server

File: _index.js_
```js
// Dependencies
import { ApolloServer } from 'apollo-server'
import combine from 'graphql-combine'
import path from 'path'

// Get combined typeDefs and resolvers
const { typeDefs, resolvers } = combine({
  // TypeDefs glob pattern
  typeDefs: path.join(__dirname, 'graphql/*/schema.graphql'),
 
  // Resolvers glob pattern
  resolvers: path.join(__dirname, 'graphql/*/resolver.js')
})

// Initialize server
const server = new ApolloServer({ typeDefs, resolvers })

// Start the server
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
```

## **That's it 👍🏼**

# Example

Have a look at this [simple example](https://github.com/neist/graphql-combine/tree/master/example) using `graphql-combine` and `apollo-server`.

# API

### `combine(options)`

The `combine()` function is a top-level function exported by the `graphql-combine` module.

* `options`
  * `typeDefs` The glob pattern for all schema files
  * `resolvers` The glob pattern for all resolver files