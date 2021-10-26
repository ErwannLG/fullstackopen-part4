const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) => sum + item.likes, 0)
}

const favoriteBlog = (blogs) => {
  const filteredBlogs = blogs.map(({ _id, url, __v, ...rest}) => rest)
  return filteredBlogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current, 'no likes yet')
}

const mostBlogs = (blogs) => {
  const countByAuthor = _.countBy(blogs, 'author')
  const countByAuthorArray = Object.keys(countByAuthor).map(author => ({author, blogs: countByAuthor[author]}))
  return countByAuthorArray.reduce((prev, current) => (prev.blogs > current.blogs) ? prev : current)
}

const mostLikes = (blogs) => {
  return _(blogs)
    .groupBy('author')
    .map((author, name) => ({
      author: name,
      likes: _.sumBy(author, 'likes')
    }))
    .value()
    .reduce((prev, current) => (prev.likes > current.likes) ? prev : current)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
