const socketIo = require('socket.io');
const expressSession = require('express-session');
const basicAuthenticationDeserializer = require('./middleware/basic-authentication-deserializer');
const Message = require('./models/message');
const expressSessionOptions = require('./express-session-options');
const corsOptions = require('./cors-options.js');

const convertMiddleware = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

const socketIoOptions = { cors: corsOptions };

const configureSocketIo = (server) => {
  const io = socketIo(server, socketIoOptions);

  io.use(convertMiddleware(expressSession(expressSessionOptions)));
  io.use(convertMiddleware(basicAuthenticationDeserializer));

  io.on('connection', (socket) => {
    const { room } = socket.handshake.query;
    const { user } = socket.request;
    if (user) {
      socket.join(room);
      socket.on('send_message', ({ content }) => {
        Message.create({ content, user: user._id, room })
          .then((message) => {
            return Message.populate(message, 'user');
          })
          .then((messageWithUser) => {
            io.to(room).emit('received_message', messageWithUser);
          });
      });
    }
  });
};

module.exports = configureSocketIo;
