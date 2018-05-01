// Dependencies
const glob = require("glob")
const merge = require("lodash.merge")
const path = require("path")
const fs = require("fs")

// Types to extend
const extendTypes = ['Query', 'Mutation', 'Subscription']

// Prepare regex
const replacePattern = new RegExp(`(extend\\s+)?type\\s+(${extendTypes.join('|')})\\s+\\{`, 'gm')

// Get schema string from file
const getSchemaString = file => {
  // Prepare empty string
  let str = ''

  // Detect and handle .js files
  if (/\.js$/.test(file)) {
    const exported = require(file)
    str = String(exported.default || exported)

  // Handle orther files
  } else {
    str = fs.readFileSync(file, 'utf-8')
  }

  // Return string
  return str
}

// Export function
module.exports = options => {
  // Prepare return values
  let typeDefs = null
  let resolvers = {}

  // Handle typeDefs
  if (options.typeDefs) {
    // Find typeDefs files
    const typeDefsFiles = glob.sync(options.typeDefs)

    // Found any files?
    if (typeDefsFiles.length) {
      // Get typeDef string
      const typeDefsString = typeDefsFiles.map(getSchemaString).join("\n\n")

      // Keep track of matched types
      let typesFound = []

      // Join strings
      typeDefs = typeDefsString.replace(replacePattern, (...args) => {
        // Original string
        let str = args[0]

        // Type
        const type = args[2]
        
        // First time we match type?
        if (typesFound.includes(type) === false) {
          // Add type to typesFound
          typesFound.push(type)

          // Return original string
          return str
        }

        // Extend type!
        str = `extend type ${type} {`

        // Return extended type
        return str
      })
    }
  }

  // Handle resolvers
  if (options.resolvers) {
    // Find resolver files
    const resolverFiles = glob.sync(options.resolvers)

    // Get all resolver objects
    const resolverObjects = resolverFiles
      .map(file => require(file))
      .map(resolver => resolver.default || resolver)

    // Merge resolvers
    resolvers = merge({}, ...resolverObjects)
  }

  // Return results
  return { typeDefs, resolvers }
}
