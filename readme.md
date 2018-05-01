[![NPM version](https://img.shields.io/npm/v/graphql-combine.svg)](https://www.npmjs.com/package/graphql-combine)

Split your GraphQL schemas and resolver objects into different files and combine them with this tool.

# Getting started

Install it
```bash
$ npm install graphql-combine --save
```

Folder structure
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

Combine everything

File: _index.js_
```js
// Depenedencies
import { makeExecutableSchema } from 'graphql-tools'
import combine from 'graphql-combine'
import path from 'path'

// Get combined typeDefs and resolvers object
const { typeDefs, resolvers } = combine({
  // TypeDefs glob pattern
  typeDefs: path.join(__dirname, 'graphql/*/schema.graphql'),

  // Resolvers glob pattern
  resolvers: path.join(__dirname, 'graphql/*/resolver.js')
})

// Build schema
const schema = makeExecutableSchema({ typeDefs, resolvers })
```

**That's it 👍🏼**

# Show me more

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

## Combine
File: _index.js_
```js
import combine from 'graphql-combine'
import path from 'path'

// Get combined typeDefs and resolvers object
const { typeDefs, resolvers } = combine({
  // TypeDefs glob pattern
  typeDefs: path.join(__dirname, 'graphql/*/schema.graphql'),

  // Resolvers glob pattern
  resolvers: path.join(__dirname, 'graphql/*/resolver.js')
})

console.log(typeDefs)
/*
type Author {
  id: Int!
  firstName: String
  lastName: String
  books: [Book]
}

type Query {
  author(id: Int!): Post
}

type Book {
  title: String
  author: Author
}

extend type Query {
  book(id: Int!): Post
}
*/

console.log(resolvers)
/*
{
  Query: {
    author: () => {
      //...
    },
    book: () => {
      //...
    }
  }
}
*/
```

# Usage with express and Apollo server
```js
// Dependencies
import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import combine from 'graphql-combine'
import path from 'path'

// Initialize the app
const app = express();

// Get combined typeDefs and resolvers object
const { typeDefs, resolvers } = combine({
  // TypeDefs glob pattern
  typeDefs: path.join(__dirname, 'graphql/*/schema.graphql'),

  // Resolvers glob pattern
  resolvers: path.join(__dirname, 'graphql/*/resolver.js')
})

// Put together a schema
const schema = makeExecutableSchema({ typeDefs, resolvers })

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }))

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

// Start the server
app.listen(3000, () => {
  console.log('Go to http://localhost:3000/graphiql to run queries!')
})
```

# Did you know
You can also define schemas in .js files:

File: _graphql/book/schema.js_
```js
export default `
  type Book {
    title: String
    author: Author
  }

  type Query {
    book(id: Int!): Book
  }
`
```

# API

## `combine(options)`

The `combine()` function is a top-level function exported by the `graphql-combine` module.

* `options`
  * `typeDefs` The glob pattern for all schema files
  * `resolvers` The glob pattern for all resolver files