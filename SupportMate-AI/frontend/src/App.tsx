import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import "./App.css";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const starterQuestions = [
  "How long does shipping take?",
  "What is your return policy?",
  "How can I get a refund?",
];

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi there! 👋 I'm SupportMate, your Northstar Store support assistant. Ask me about shipping, returns, refunds, or payments, and I'll do my best to help.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  async function sendMessage(text: string) {
    const content = text.trim();
    if (!content || isLoading) return;

    const userMessage: Message = {
      id: makeId(),
      role: "user",
      content,
    };
    const previousMessages = messages.filter((message) => message.id !== "welcome");

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: previousMessages.map(({ role, content: messageContent }) => ({
            role,
            content: messageContent,
          })),
        }),
      });

      const data: { reply?: string; detail?: string } = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong. Please try again.");
      }

      setMessages((current) => [
        ...current,
        {
          id: makeId(),
          role: "assistant",
          content: data.reply || "I couldn't generate a response. Please try again.",
        },
      ]);
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Could not connect to SupportMate. Is the backend running?";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  }

  function startNewChat() {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Welcome back! I'm SupportMate. What can I help you with today?",
      },
    ]);
    setInput("");
    setError("");
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">S</div>
          <div>
            <div className="brand-name">SupportMate</div>
            <div className="brand-caption">CUSTOMER CARE AI</div>
          </div>
        </div>

        <button className="new-chat-button" onClick={startNewChat} type="button">
          <span aria-hidden="true">＋</span> New conversation
        </button>

        <div className="sidebar-section-label">QUICK TOPICS</div>
        <div className="topic-list">
          <button onClick={() => void sendMessage("How long does shipping take?")}>
            <span>↗</span> Shipping & delivery
          </button>
          <button onClick={() => void sendMessage("What is your return policy?")}>
            <span>↺</span> Returns & refunds
          </button>
          <button onClick={() => void sendMessage("Which payment methods do you accept?")}>
            <span>▤</span> Payments
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="online-dot" />
          <div>
            <div className="online-title">AI assistant online</div>
            <div className="online-caption">Demo knowledge base</div>
          </div>
        </div>
      </aside>

      <section className="chat-panel">
        <header className="topbar">
          <div className="mobile-brand">
            <div className="brand-mark small">S</div>
            <span>SupportMate</span>
          </div>
          <div className="topbar-status">
            <span className="online-dot" /> AI Support <span className="status-divider">/</span>{" "}
            <span className="muted">Northstar Store demo</span>
          </div>
          <button className="reset-button" type="button" onClick={startNewChat}>
            Reset chat
          </button>
        </header>

        <div className="conversation">
          <div className="conversation-heading">
            <div className="eyebrow">HERE TO HELP</div>
            <h1>How can we help<br className="desktop-break" /> you today?</h1>
            <p>Ask a question and get a helpful answer from our AI support assistant.</p>
          </div>

          <div className="messages" aria-live="polite">
            {messages.map((message) => (
              <article className={`message-row ${message.role}`} key={message.id}>
                {message.role === "assistant" && (
                  <div className="avatar assistant-avatar" aria-label="SupportMate">S</div>
                )}
                <div className="message-content">
                  <div className="message-meta">
                    {message.role === "assistant" ? "SupportMate" : "You"}
                    <span>{message.role === "assistant" ? "AI ASSISTANT" : "CUSTOMER"}</span>
                  </div>
                  <div className="message-bubble">{message.content}</div>
                </div>
                {message.role === "user" && <div className="avatar user-avatar">Y</div>}
              </article>
            ))}

            {isLoading && (
              <article className="message-row assistant">
                <div className="avatar assistant-avatar">S</div>
                <div className="message-content">
                  <div className="message-meta">SupportMate <span>THINKING</span></div>
                  <div className="message-bubble typing" aria-label="SupportMate is typing">
                    <i /><i /><i />
                  </div>
                </div>
              </article>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length === 1 && (
            <div className="starter-area">
              <div className="starter-label">POPULAR QUESTIONS</div>
              <div className="starter-buttons">
                {starterQuestions.map((question) => (
                  <button key={question} onClick={() => void sendMessage(question)}>
                    {question} <span>↗</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="error-banner" role="alert">
              <strong>Message not sent.</strong> {error}
            </div>
          )}

          <form className="composer" onSubmit={handleSubmit}>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question here..."
              rows={1}
              maxLength={2000}
              aria-label="Type your question"
            />
            <div className="composer-footer">
              <span>AI can make mistakes. Please avoid sharing sensitive information.</span>
              <button type="submit" disabled={!input.trim() || isLoading} aria-label="Send message">
                {isLoading ? "…" : "↑"}
              </button>
            </div>
          </form>
          <div className="footer-note">POWERED BY GEMINI · BUILT WITH CARE</div>
        </div>
      </section>
    </main>
  );
}

export default App;
