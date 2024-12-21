import { useState, useEffect } from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  TextField,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Box,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import usePusherMessageListener from 'components/hooks/usePusherChat';
import { useStore } from 'store';
import axiosInstance from 'configs/axios';
import { useParams } from 'react-router-dom';

interface Message {
  id: number| null,
  receiver_id: number | null,
  sender_id: number | null,
  message: string | null,
  created_at: string | null, 
  updated_at: string | null
}

// interface ChatResponse {
//   userId: number;
//   senderId: number;
//   messages: Message[];
// }

interface SendMessageRequest {
  receiver_id: number;
  message: string;
}



export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const user = useStore(state => state.user)
  const { id } = useParams();

  const {message: newMessageWs } = usePusherMessageListener(user?.user_id || 0)

  // Fetch messages from the API

  
  useEffect(() => {
    const fetchMessages = async () => {
      if (id) {
        try {
          const response = await axiosInstance(`/chat/messages/${id}`);

          console.log(response.data.messages)
          setMessages(response.data.messages)
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    };
  
    fetchMessages();  // Call the async function
  
  }, [id]);  // Dependency on `id`, this will re-run when `id` changes
  

  useEffect(() => {
    setMessages([...messages, newMessageWs])
  }, [newMessageWs])

  // Handle sending a message
    const handleSendMessage = async () => {
      console.log(id)
      if (newMessage.trim() && id !== undefined) {
        setLoading(true);
        const sendMessagePayload: SendMessageRequest = {
          receiver_id: Number(id),
          message: newMessage,
        };

        try {
          await axiosInstance.post('/chat/send', JSON.stringify(sendMessagePayload))

          // After sending the message, update the message list
          setMessages([
            ...messages,
            {
              id: messages.length + 1,
              sender_id: 11,
              receiver_id: 18,
              message: newMessage,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);
          setNewMessage('');
        } catch (error) {
          console.error('Error sending message:', error);
        } finally {
          setLoading(false);
        }
      }
    };

  return (
    <Paper
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Chat</Typography>
        </Toolbar>
      </AppBar>

      <List sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        {messages.map((message) => (
          <ListItem
            key={`${message.created_at}${message.id}`}
            sx={{
              justifyContent: message.sender_id == user?.user_id ? 'flex-end' : 'flex-start',
            }}
          >
            <Paper
              elevation={2}
              sx={{
                p: 2,
                maxWidth: '70%',
                backgroundColor: message.sender_id === 11 ? 'primary.light' : 'background.paper',
                color: message.sender_id === 11 ? 'primary.contrastText' : 'text.primary',
              }}
            >
              <ListItemText primary={message.message} />
            </Paper>
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 2, backgroundColor: 'background.paper' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          InputProps={{
            endAdornment: (
              <IconButton color="primary" onClick={handleSendMessage} disabled={loading}>
                <IconifyIcon icon="material-symbols:send" />
              </IconButton>
            ),
          }}
        />
      </Box>
    </Paper>
  );
}
