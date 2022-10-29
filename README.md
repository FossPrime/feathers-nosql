<p align="center">
  <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://vitejs.dev/logo.svg" alt="Vite logo">
  </a>
</p>
<br/>
<p align="center">
  <a href="https://npmjs.com/package/feathers-nosql"><img src="https://img.shields.io/npm/v/feathers-nosql.svg" alt="npm package"></a>
  <a href="https://https://discord.gg/qa8kez8QBx"><img src="https://img.shields.io/badge/chat-discord-blue?style=flat&logo=discord" alt="discord chat"></a>
</p>
<br/>

# Feathers-NoSQL 🫐

A NoSQL database adapter for feathers, batteries included.

**WIP: Do not use.**

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
