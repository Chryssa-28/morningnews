const mongoose = require('mongoose')

const ArticleSchema = mongoose.Schema( {
    author: String,
    content: String,
    description: String,
    title: String,
    url: String,
    urlToImage: String,
    language: String
})
const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    token: String,
    salt: String, 
    articles: [ArticleSchema]
})

const userModel = mongoose.model('users', userSchema)

module.exports = userModel