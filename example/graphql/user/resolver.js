const users = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Doe'
  }
]

export default {
  Query: {
    allUsers: () => users
  }
}