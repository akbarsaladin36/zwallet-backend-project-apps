const express = require('express')
// const http = require('http')
require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')
const xss = require('xss-clean')
const helmet = require('helmet')
const compression = require('compression')
const bodyParser = require('body-parser')
const routerNavigation = require('./routes')

const app = express()
const port = process.env.DB_PORT
// const server = http.createServer(app)
// const io = require('socket.io')(server)

app.use(morgan('dev'))
app.use(cors())
app.options('*', cors())
app.use(xss())
app.use(helmet())
app.use(compression())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use('/backend4/api/v1', routerNavigation)
app.use('/backend4/api', express.static('src/uploads'))

// io.on('connection', (socket) => {
//   console.log('new user connected')

//   socket.on('broadcastMessage', (data) => {
//     console.log(data)
//     socket.broadcast.emit('chatMessage', data)
//   })

//   socket.on('joinRoom', (data) => {
//     console.log(data)
//     if (data.oldRoom) {
//       socket.leave(data.oldRoom)
//     }
//     socket.join(data.room)
//     socket.broadcast.to(data.room).emit('chatMessage', {
//       username: 'BOT',
//       message: `${data.username} joined Chat!`
//     })
//   })

//   socket.on('roomMessage', (data) => {
//     io.to(data.room).emit('chatMessage', data)
//   })
// })

app.listen(port, () => {
  console.log(`Express app is listen on port ${port} !`)
})
