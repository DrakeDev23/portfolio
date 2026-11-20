import { useState, useEffect, useRef } from 'react'
import { MessageSquare, X, Send } from 'lucide-react'
import avatar from '../assets/images/avatar.jpeg'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
const MESSAGE_MAX = 1000
const HISTORY_MAX_TURNS = 8

const INITIAL_MESSAGES = [
  {
    id: 'init',
    role: 'bot',
    text: "Hey! I'm Drake's AI assistant. Ask me anything about his skills, projects, or background.",
  },
]

const AVATAR = avatar;

function ChatMessage({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && (
        <img src={AVATAR} alt="Drake" style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
          marginBottom: '2px',
          border: '1px solid rgba(122,51,255,0.3)',
        }}
        />
      )}
      <div
        className="max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed break-words"
        style={
          isUser
            ? {
              background: 'linear-gradient(135deg, #7A33FF, #b347ff)',
              color: 'white',
              borderBottomRightRadius: '4px',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
            }
            : {
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(122,51,255,0.15)',
              color: '#d1d5db',
              borderBottomLeftRadius: '4px',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
            }
        }
      >
        {msg.text}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <img
        src={AVATAR}
        alt="Drake"
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
          border: '1px solid rgba(122,51,255,0.3)',
        }}
      />
      <div
        className="px-4 py-3 rounded-2xl flex gap-1.5 items-center"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(122,51,255,0.15)',
          borderBottomLeftRadius: '4px',
        }}
      >
        {[0, 0.18, 0.36].map((delay, i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full animate-bounce"
            style={{ background: '#7A33FF', animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    </div>
  )
}

const STORAGE_KEY = 'drake_chat_messages'

function loadSavedMessages() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch { }
  return INITIAL_MESSAGES
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(loadSavedMessages)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150)
  }, [open])

  const send = async () => {
    const q = input.trim().slice(0, MESSAGE_MAX)
    if (!q || typing) return

    const userMsg = { id: Date.now(), role: 'user', text: q }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setTyping(true)

    const history = nextMessages
      .filter((m) => m.id !== 'init')
      .slice(0, -1)
      .slice(-HISTORY_MAX_TURNS)
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text,
      }))

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q, history }),
      })

      if (res.status === 429) {
        setMessages((m) => [
          ...m,
          {
            id: Date.now() + 1,
            role: 'bot',
            text: "Whoa, slow down a bit! You're sending messages too fast. Please try again in a minute.",
          },
        ])
        return
      }

      if (!res.ok) throw new Error(`Server error: ${res.status}`)

      const data = await res.json()
      setMessages((m) => [...m, { id: Date.now() + 1, role: 'bot', text: data.reply }])
    } catch (err) {
      console.error('Chat error:', err)
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          role: 'bot',
          text: "Sorry, I couldn't reach my brain just now. Please try again in a bit.",
        },
      ])
    } finally {
      setTyping(false)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      {open && (
        <div
          className="fixed bottom-24 right-6 w-80 flex flex-col overflow-hidden z-50 rounded-2xl"
          style={{
            background: '#0d0a1e',
            border: '1px solid rgba(122,51,255,0.25)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(122,51,255,0.1)',
            maxHeight: '480px',
          }}
          role="dialog"
          aria-label="AI Chat Assistant"
        >
          <div
            className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(122,51,255,0.15), rgba(180,71,255,0.08))',
              borderBottom: '1px solid rgba(122,51,255,0.2)',
            }}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img
                src={AVATAR}
                alt="Drake Delos Reyes"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid rgba(122,51,255,0.45)',
                  display: 'block',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '1px',
                  right: '1px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#4ade80',
                  border: '2px solid #0d0a1e',
                  boxShadow: '0 0 6px rgba(74,222,128,0.7)',
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold leading-none mb-1">Drake Delos Reyes</p>
              <p style={{ color: '#4ade80', fontSize: '11px', margin: 0 }}>Active now</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-white transition-colors p-1"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>

          <div
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{ overscrollBehavior: 'contain' }}
          >
            {messages.map((msg) => (
              <ChatMessage key={msg.id} msg={msg} />
            ))}
            {typing && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          <div
            className="p-3 flex flex-col gap-1 flex-shrink-0"
            style={{ borderTop: '1px solid rgba(122,51,255,0.15)' }}
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MESSAGE_MAX))}
                onKeyDown={onKeyDown}
                placeholder="Ask anything..."
                aria-label="Chat message"
                maxLength={MESSAGE_MAX}
                className="flex-1"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(122,51,255,0.2)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  color: '#e5e7eb',
                  fontSize: '12px',
                  outline: 'none',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(122,51,255,0.5)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(122,51,255,0.2)')}
              />
              <button
                onClick={send}
                disabled={!input.trim() || typing}
                aria-label="Send message"
                className="flex items-center justify-center transition-all duration-200"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background:
                    input.trim() && !typing
                      ? 'linear-gradient(135deg, #7A33FF, #b347ff)'
                      : 'rgba(255,255,255,0.05)',
                  color: input.trim() && !typing ? 'white' : 'rgba(255,255,255,0.2)',
                  border: 'none',
                  cursor: input.trim() && !typing ? 'pointer' : 'default',
                  flexShrink: 0,
                }}
              >
                <Send size={14} />
              </button>
            </div>
            <div className="flex justify-end items-center h-3.5 px-0.5" aria-hidden={input.length === 0}>
              <span
                style={{
                  fontSize: '10px',
                  color:
                    input.length >= MESSAGE_MAX
                      ? '#f87171'
                      : input.length >= MESSAGE_MAX * 0.8
                      ? '#fbbf24'
                      : '#9ca3af',
                  textAlign: 'right',
                  fontVariantNumeric: 'tabular-nums',
                  opacity: input.length > 0 ? 1 : 0,
                  visibility: input.length > 0 ? 'visible' : 'hidden',
                  transition: 'opacity 0.15s ease, color 0.15s ease',
                }}
                aria-live="polite"
              >
                {input.length} / {MESSAGE_MAX}
              </span>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close AI chat' : 'Open AI chat'}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #7A33FF, #b347ff)',
          border: 'none',
          cursor: 'pointer',
          boxShadow: open
            ? '0 4px 24px rgba(122,51,255,0.5)'
            : '0 8px 32px rgba(122,51,255,0.4)',
          color: 'white',
        }}
      >
        {open ? <X size={20} /> : <MessageSquare size={20} />}

        {!open && (
          <span
            className="absolute -top-1 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2"
            style={{
              borderColor: '#090514',
              boxShadow: '0 0 8px rgba(74,222,128,0.6)',
            }}
          />
        )}
      </button>
    </>
  )
}