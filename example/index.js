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