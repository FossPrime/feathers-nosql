# Feathers-NoSQL

A NoSQL database adapter for feathers, batteries included.

Goals:

- Remove DX hostile decisions MongoDB has made, such as
  - EJSON
  - Binary dependencies
  - Using BSON during development


Instead, this adapter will

- Squash all requests to JSON compatible ones
 - Use a pure-js JSON database by default
- Store data in YAML during dev mode


In practice, this means using NeDB backed with LowDB by default, and using MongoDB when NODE_ENV is 'production'. The API is like MongoDB 1.4.

# To-do for v1

- [ ] Create the LowDB@v3 dev DB
- [ ] Support MongoDB connections
- [ ] Send EJSON to the guillotine
  - Removes ObjectID's in create post-haste
  - JSONifies all queries
- [ ] Make an index/key API that is DB agnostic

# Contributing

- [CodeFlow](https://stackblitz.com/~/github.com/FossPrime/feathers-nosql)
