import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFUVjoaH3QKmtgisZHH3QAXggS28d3P0M",
  authDomain: "couple-status-9c30e.firebaseapp.com",
  databaseURL: "https://couple-status-9c30e-default-rtdb.firebaseio.com",
  projectId: "couple-status-9c30e",
  storageBucket: "couple-status-9c30e.firebasestorage.app",
  messagingSenderId: "528793247856",
  appId: "1:528793247856:web:2a5f0121b944ce607554b5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Styled components
const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: #FFF9F0;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`;

const SplashContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #FFF9F0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 1s ease-in;
`;

const SplashImage = styled.img`
  width: 250px;
  height: 250px;
  border-radius: 125px;
  object-fit: cover;
  margin-bottom: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const SplashMessage = styled.div`
  font-size: 20px;
  color: #5C4B37;
  text-align: center;
  margin-top: 20px;
`;

const Title = styled.h1`
  text-align: center;
  color: #5C4B37;
  font-size: 28px;
  margin: 20px 0;
`;

const StatusRow = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
`;

const StatusCard = styled.div`
  background: #FFEEDD;
  padding: 20px;
  border-radius: 15px;
  width: 45%;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Emoji = styled.div`
  font-size: 48px;
  margin-bottom: 10px;
`;

const Label = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #5C4B37;
`;

const Time = styled.div`
  font-size: 12px;
  color: #8B7355;
  margin-top: 5px;
`;

const EmojiSection = styled.div`
  background: #FFEEDD;
  padding: 20px;
  border-radius: 15px;
  margin-top: 20px;
`;

const Subtitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
  color: #8B7355;
  margin-bottom: 15px;
`;

const EmojiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
`;

const EmojiButton = styled.button`
  background: none;
  border: none;
  font-size: 32px;
  padding: 10px;
  cursor: pointer;
  transition: transform 0.2s;
  aspect-ratio: 1;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const Logo = styled.img`
  width: 120px;
  height: 60px;
  opacity: 0.8;
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
`;

// Splash Screen Component
const Splash = ({ onFinish }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    '/couple1.jpg',
    '/couple2.jpg',
    '/couple3.jpg',
  ];
  
  const messages = [
    "Silly baby, it's loading!",
    "Almost there!",
    "While this loads, know that I love you!",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        if (prev === images.length - 1) {
          clearInterval(interval);
          setTimeout(onFinish, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <SplashContainer>
      <SplashImage src={images[currentImageIndex]} alt="Splash" />
      <SplashMessage>{messages[currentImageIndex]}</SplashMessage>
      <div style={{ position: 'absolute', bottom: 40, fontSize: 24, color: '#D4A373' }}>
        R&H💕
      </div>
    </SplashContainer>
  );
};

// Main App Component
function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [statuses, setStatuses] = useState({
    raghav: { emoji: '💭', timestamp: Date.now(), name: 'Raghav' },
    shona: { emoji: '💭', timestamp: Date.now(), name: 'Harshita' }
  });

  const quickEmojis = ['💻', '🍽️', '😴', '📺', '♿', '🏃', '🎮', '🕺🏽', '👥', '🛒'];

  useEffect(() => {
    const statusesRef = ref(database, 'statuses');
    const unsubscribe = onValue(statusesRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.raghav && data.shona) {
        setStatuses(data);
        // Trigger browser notification
        if (Notification.permission === 'granted') {
          new Notification('Status Updated', {
            body: `Raghav: ${data.raghav.emoji}  Harshita: ${data.shona.emoji}`,
          });
        }
      }
    });

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => unsubscribe();
  }, []);

 const updateStatus = async (emoji) => {
  try {
    const newStatuses = {
      ...statuses,
      shona: {  // Changed from 'you' to 'shona'
        emoji,
        timestamp: Date.now(),
        name: 'Harshita'
      }
    };
    
    await set(ref(database, 'statuses'), newStatuses);
  } catch (error) {
    console.error('Error updating status:', error);
  }
};

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <Container>
      <Title>Our Status</Title>
      
      <StatusRow>
        {Object.entries(statuses).map(([person, status]) => (
          <StatusCard key={person}>
            <Emoji>{status.emoji}</Emoji>
            <Label>{status.name}</Label>
            <Time>{formatTime(status.timestamp)}</Time>
          </StatusCard>
        ))}
      </StatusRow>

      <EmojiSection>
        <Subtitle>What are you upto?</Subtitle>
        <EmojiGrid>
          {quickEmojis.map((emoji) => (
    <EmojiButton
      key={emoji}
      onClick={() => updateStatus(emoji)}  // Removed 'you' parameter
    >
      {emoji}
    </EmojiButton>
  ))}
        </EmojiGrid>
      </EmojiSection>

      <Logo src="/logo.png" alt="Logo" />
    </Container>
  );
}

export default App;