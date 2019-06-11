
const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')

findLink = (links, id, del, sub) => {
  let res = null

  links.forEach((link, index) => {
    if (link.id === id) {
      res = {...link}

      if (del) links.splice(index, 1)

      if (sub) {
        res = {
          id: link.id,
          url: sub.url || link.url,
          description: sub.desc || link.description
        }
        links.splice(index, 1, res)
      }
    }
  })
  return res
}

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    link: (root, args) => findLink(links, args.id),
    feed: (root, args, context, info) => {
      return context.prisma.links()
    },
  },
  Mutation: {
    post: (root, args, context) => {
      return context.prisma.createLink({
        url: args.url,
        description: args.description,
      })
    },
    updateLink: (parent, args) => {
      return findLink(links, args.id, false, {
        url: args.url,
        desc: args.description
      })
    },
    deleteLink: (parent, args) => {
      return findLink(links, args.id, true)
    }
  }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {prisma}
})

server.start(() => console.log(`Server is running on http://localhost:4000`))
