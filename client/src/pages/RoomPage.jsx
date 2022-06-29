import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { io } from 'socket.io-client';
import { loadRoom } from '../services/room';

const RoomPage = () => {
  const [socket, setSocket] = useState(null);
  const [content, setContent] = useState('');
  const [messages, setMessages] = useState([]);
  const { id } = useParams();

  const handleReceivedMessage = (data) => {
    setMessages((currentState) => [...currentState, data]);
  };

  const handleSubmission = (event) => {
    event.preventDefault();
    if (socket && content.length > 0) {
      setContent('');
      socket.emit('send_message', { content });
    }
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  useEffect(() => {
    // Load current room information
    loadRoom(id).then((data) => {
      setMessages(data.messages);
    });

    // Listen for new messages
    const createdSocket = io(process.env.REACT_APP_REST_API_URL, {
      withCredentials: true,
      query: { room: id }
    });
    setSocket(createdSocket);
    createdSocket.on('received_message', handleReceivedMessage);
    return () => {
      createdSocket.disconnect();
    };
  }, [id]);

  return (
    <div>
      <h1>Room: {id}</h1>
      <ul>
        {messages.map((message) => (
          <li key={message._id}>
            <p>{message.content}</p>
            <small>from: {message.user.name}</small>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmission}>
        <input type="text" onChange={handleContentChange} value={content} />
        <button>Send</button>
      </form>
    </div>
  );
};

export default RoomPage;
