import { useState } from "react";
import { Header } from "./chess/Header";
import { ChatInterface } from "./chess/ChatInterface";
import { WelcomeScreen } from "./chess/WelcomeScreen";

export const ChessCoach = () => {
  const [hasStartedChat, setHasStartedChat] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-chess-board-light to-muted">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {!hasStartedChat ? (
          <WelcomeScreen onStartChat={() => setHasStartedChat(true)} />
        ) : (
          <ChatInterface />
        )}
      </main>
    </div>
  );
};