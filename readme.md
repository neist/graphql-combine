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
```js
// index.js
import combine from 'graphql-combine'
import path from 'path'

// Get combined GraphQL schema and resolvers object
const { typeDefs, resolvers } = combine({
  typeDefs: path.join(__dirname, 'graphql/**/schema.graphql'),
  resolvers: path.join(__dirname, 'graphql/**/resolver.js')
})
```

**That's it 👍🏼**

# Show me more

## Files
_graphql/author/schema.graphql_
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
_graphql/author/resolver.js_
```js
export default {
  Query: {
    author: () => {
      //...
    }
  }
}
```
_graphql/book/schema.graphql_
```graphql
type Book {
  title: String
  author: Author
}

type Query {
  book(id: Int!): Book
}
```
_graphql/book/resolver.js_
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
```js
// index.js
import combine from 'graphql-combine'
import path from 'path'

const { typeDefs, resolvers } = combine({
  typeDefs: path.join(__dirname, 'graphql/**/schema.graphql'),
  resolvers: path.join(__dirname, 'graphql/**/resolver.js')
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

// Get combined GraphQL schema and resolvers object
const { typeDefs, resolvers } = combine({
  typeDefs: path.join(__dirname, 'graphql/**/schema.graphql'),
  resolvers: path.join(__dirname, 'graphql/**/resolver.js')
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

