
function feed(root, args, context) {
  return context.prisma.links()
}

function info(root, args, context, info) {
  return info
}

function link(root, args, context, info) {
  return context.prisma.link({ id: args.id })
}

function user(root, args, context) {
  return context.prisma.user({ id: args.id })
}

module.exports = {
  feed,
  link,
  user,
}
