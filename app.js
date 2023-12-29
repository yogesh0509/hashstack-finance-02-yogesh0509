const express = require('express')
const app = express()
const mongoose = require("mongoose")

const port = process.env.PORT || 3000
const projectRoutes = require("./api/routes/projectRoutes")

const uri = process.env.MONGODB_URI
mongoose.connect(uri, { useNewUrlParser: true })
const db = mongoose.connection
db.once('open', function () {
  console.log("Connected")
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/projectRoutes/", projectRoutes)

app.use((req, res, next) => {
  const error = new Error("Not found")
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

const server = app.listen(port, () => {
  console.log("The application started successfully")
})

module.exports = { app, server }