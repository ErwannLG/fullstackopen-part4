// Load the fp build.
var _ = require('lodash')

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]
// const emptyList = []
// let newBlogs = blogs.map(({ _id, url, __v, ...rest}) => rest)

// console.log('new blogs', newBlogs)
// const max = blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current, 'no likes yet')

// console.log(max)

// let countByAuthor = _.countBy(blogs, 'author')
// let countByAuthorArray = Object.keys(countByAuthor).map(author => ({author, blogs: countByAuthor[author]}))
// let topBlogs = countByAuthorArray.reduce((prev, current) => (prev.blogs > current.blogs) ? prev : current)


// console.log('countByAuthor:', countByAuthor)
// console.log('countByAuthorArray:', countByAuthorArray)
// console.log('topBlogs:', topBlogs)

// const groupByAuthor = _.groupBy(blogs, 'author')
// console.log('groupByAuthor:', groupByAuthor)

const mostLikes = _(blogs)
  .groupBy('author')
  .map((author, name) => ({
    author: name,
    likes: _.sumBy(author, 'likes')
  }))
  .value()
  .reduce((prev, current) => (prev.likes > current.likes) ? prev : current)
console.log(mostLikes)
// return countByLikesArray.reduce((prev, current) => (prev.blogs > current.blogs) ? prev : current)



// const sumByLikes = _.sumBy(blogs, 'likes')
// console.log('sumByLikes:', sumByLikes)
// let countByLikesArray = Object.keys(countByLikes).map(author => ({author, likes: countByLikes[author]}))
// console.log(countByLikesArray);
// let mostLikes = countByLikesArray.reduce((prev, current) => (prev.blogs > current.blogs) ? prev : current)

// console.log('mostLikes:', mostLikes);