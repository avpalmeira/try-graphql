
const { GraphQLServer } = require('graphql-yoga')

let links = [
  {
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
  },
  {
    id: 'link-1',
    url: 'www.graph.cool',
    description: 'GraphQL Resources'
  }
],
idCount = links.length

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
    feed: () => links,
    link: (parent, args) => findLink(links, args.id)
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }
      links.push(link)
      return link
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
  resolvers
})

server.start(() => console.log(`Server is running on http://localhost:4000`))
