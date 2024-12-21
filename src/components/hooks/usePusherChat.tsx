import { useState, useEffect } from 'react';
import pusher from 'configs/pusher';

interface Message {
    id: number| null,
    receiver_id: number | null,
    sender_id: number | null,
    message: string | null,
    created_at: string | null, 
    updated_at: string | null
}


const usePusherMessageListener = (userId: number) => {
    const [message, setMessage] = useState<Message>({
        id: null,
        receiver_id: null,
        sender_id: null,
        message: null,
        created_at: null, 
        updated_at: null
    });

    const [error, setError] = useState<string | null>(null);
    const [connected, setConnected] = useState(false);
    if(!userId) return { message, error, connected }
    useEffect(() => {
        console.log(" at puhser listener id")
        console.log(userId)

        // Initialize Pusher
        // Subscribe to the user's location channel
        const channel = pusher.subscribe(`chat.${userId}`);

        // Bind to location update events
        channel.bind('message.sent', (data: Message) => {
            console.log("from bind")
            console.log(data)
            setMessage({
                id: data.id,
                receiver_id: data.receiver_id,
                sender_id: data.sender_id,
                message: data.message,
                created_at: data.created_at,
                updated_at: data.updated_at

            })
        });
    
        // Handle connection events
        pusher.connection.bind('connected', () => {
            console.log('!!!!!!!!!!!!!!! connected !!!!!!!!!!!!!!!')
            setConnected(true);
        });

        // Handle connection errors
        pusher.connection.bind('error', (error: { message: string; code: number }) => {
            console.log('!!!!!!!!!!!!!!! error   !!!!!!!!!!!!!!!')
            setError(error.message)
            // Handle the error here
        });


        return () => {
            // Cleanup Pusher on unmount
            if (channel) {
                channel.unbind_all();
                channel.unsubscribe();
            }
        };  
    }, [userId, pusher]);

    return { message, error, connected, userId };
};

export default usePusherMessageListener;
