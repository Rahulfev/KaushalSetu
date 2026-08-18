import { useState, useRef, useEffect } from 'react';
import { getAuth } from '../utils/authUtils';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are KaushalBot, a helpful assistant for KaushalSetu — a platform that connects skilled workers (shramiks) with clients and organizations across India.

Your job is to help workers:
- Find suitable jobs based on their skills and district
- Understand how to apply for jobs on the platform
- Answer questions about their applications, contracts, and payments
- Guide them through profile setup and KYC verification
- Explain platform features like wallet, job feed, and professional records
- Answer general queries about work, skills, and labor rights in India

Available job categories: Electrical, Plumbing, Carpentry, Painting, Welding, Mason, Helper, Driver, Security Guard, Housekeeping.

Always respond in simple, friendly English. If the user writes in Hindi, respond in Hindi. Keep answers short and practical.`;

const AIChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "👋 Namaste! I'm KaushalBot.\nHow can I help you find work today?" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { name, role } = getAuth();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 100);
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      // Build conversation history for Gemini format
      const history = updatedMessages.slice(1).map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      const systemText = SYSTEM_PROMPT +
        (name ? `\n\nThe current user's name is ${name} and their role is ${role}.` : '');

      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemText }] },
          contents: history,
          generationConfig: { maxOutputTokens: 500, temperature: 0.7 },
        }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error.message);

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I didn't get a response. Please try again.";

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('KaushalBot error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "⚠️ Sorry, I'm having trouble connecting. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      { role: 'assistant', content: "👋 Namaste! I'm KaushalBot.\nHow can I help you find work today?" },
    ]);
  };

  return (
    <>
      
    </>
  );
};

export default AIChatBubble;






// Chat Window
//       {isOpen && (
//         <div style={{
//           position: 'fixed', bottom: '90px', right: '24px',
//           width: '360px', height: '500px', backgroundColor: '#fff',
//           borderRadius: '16px', boxShadow: '0 8px 40px rgba(0,0,0,0.20)',
//           display: 'flex', flexDirection: 'column', zIndex: 99999,
//           overflow: 'hidden', fontFamily: "'Segoe UI', sans-serif",
//           animation: 'slideUp 0.25s ease',
//         }}>

//           {/* Header */}
//           <div style={{
//             background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
//             padding: '12px 16px', display: 'flex',
//             alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
//           }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//               <div style={{
//                 width: '38px', height: '38px', borderRadius: '50%',
//                 background: '#facc15', display: 'flex',
//                 alignItems: 'center', justifyContent: 'center', fontSize: '20px',
//               }}>🤖</div>
//               <div>
//                 <div style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>KaushalBot</div>
//                 <div style={{ color: '#4ade80', fontSize: '11px' }}>● Online — AI Assistant</div>
//               </div>
//             </div>
//             <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
//               <button onClick={clearChat} title="Clear chat" style={{
//                 background: 'rgba(255,255,255,0.1)', border: 'none', color: '#ccc',
//                 cursor: 'pointer', borderRadius: '6px', padding: '4px 8px', fontSize: '13px',
//               }}>🗑️</button>
//               <button onClick={() => setIsOpen(false)} style={{
//                 background: 'rgba(255,255,255,0.1)', border: 'none', color: '#ccc',
//                 cursor: 'pointer', borderRadius: '6px', padding: '4px 10px',
//                 fontSize: '18px', lineHeight: 1,
//               }}>×</button>
//             </div>
//           </div>

//           {/* Messages */}
//           <div style={{
//             flex: 1, overflowY: 'auto', padding: '14px 12px',
//             display: 'flex', flexDirection: 'column', gap: '10px',
//             backgroundColor: '#f4f6f9',
//           }}>
//             {messages.map((msg, i) => (
//               <div key={i} style={{
//                 display: 'flex',
//                 justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
//                 alignItems: 'flex-end', gap: '6px',
//               }}>
//                 {msg.role === 'assistant' && (
//                   <div style={{
//                     width: '26px', height: '26px', borderRadius: '50%',
//                     background: '#1a1a2e', display: 'flex',
//                     alignItems: 'center', justifyContent: 'center',
//                     fontSize: '13px', flexShrink: 0,
//                   }}>🤖</div>
//                 )}
//                 <div style={{
//                   maxWidth: '78%', padding: '9px 13px',
//                   borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
//                   backgroundColor: msg.role === 'user' ? '#1a1a2e' : '#ffffff',
//                   color: msg.role === 'user' ? '#facc15' : '#2d2d2d',
//                   fontSize: '13px', lineHeight: '1.55',
//                   boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
//                   whiteSpace: 'pre-wrap', wordBreak: 'break-word',
//                 }}>
//                   {msg.content}
//                 </div>
//               </div>
//             ))}

//             {/* Typing indicator */}
//             {loading && (
//               <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
//                 <div style={{
//                   width: '26px', height: '26px', borderRadius: '50%',
//                   background: '#1a1a2e', display: 'flex',
//                   alignItems: 'center', justifyContent: 'center', fontSize: '13px',
//                 }}>🤖</div>
//                 <div style={{
//                   padding: '10px 16px', backgroundColor: '#fff',
//                   borderRadius: '16px 16px 16px 4px',
//                   boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
//                   display: 'flex', gap: '4px', alignItems: 'center',
//                 }}>
//                   {[0, 1, 2].map((i) => (
//                     <div key={i} style={{
//                       width: '7px', height: '7px', borderRadius: '50%',
//                       background: '#999',
//                       animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
//                     }} />
//                   ))}
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input */}
//           <div style={{
//             padding: '10px 12px', borderTop: '1px solid #e8e8e8',
//             display: 'flex', gap: '8px', backgroundColor: '#fff', flexShrink: 0,
//           }}>
//             <textarea
//               ref={inputRef}
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder="Ask about jobs, skills, payments..."
//               rows={1}
//               style={{
//                 flex: 1, padding: '9px 12px', borderRadius: '10px',
//                 border: '1.5px solid #dde1e7', resize: 'none',
//                 fontSize: '13px', outline: 'none',
//                 fontFamily: "'Segoe UI', sans-serif", lineHeight: '1.4',
//                 color: '#333', backgroundColor: '#f8f9fa',
//                 transition: 'border-color 0.2s',
//               }}
//               onFocus={(e) => (e.target.style.borderColor = '#facc15')}
//               onBlur={(e) => (e.target.style.borderColor = '#dde1e7')}
//             />
//             <button
//               onClick={sendMessage}
//               disabled={loading || !input.trim()}
//               style={{
//                 padding: '9px 15px', borderRadius: '10px', border: 'none',
//                 background: loading || !input.trim() ? '#e0e0e0' : '#facc15',
//                 color: loading || !input.trim() ? '#999' : '#1a1a2e',
//                 cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
//                 fontWeight: '700', fontSize: '16px',
//                 transition: 'all 0.2s', flexShrink: 0,
//               }}
//             >➤</button>
//           </div>
//         </div>
//       )}

//       {/* Floating Bubble */}
//       <button
//         onClick={() => setIsOpen((prev) => !prev)}
//         title="Chat with KaushalBot"
//         style={{
//           position: 'fixed', bottom: '24px', right: '24px',
//           width: '58px', height: '58px', borderRadius: '50%',
//           background: isOpen
//             ? 'linear-gradient(135deg, #e53e3e, #c53030)'
//             : 'linear-gradient(135deg, #1a1a2e, #facc15)',
//           border: 'none', cursor: 'pointer', fontSize: '24px',
//           boxShadow: '0 4px 20px rgba(0,0,0,0.28)', zIndex: 99999,
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//           transition: 'transform 0.2s, background 0.3s',
//         }}
//         onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.12)')}
//         onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
//       >
//         {isOpen ? '✕' : '🤖'}
//       </button>

//       <style>{`
//         @keyframes slideUp {
//           from { opacity: 0; transform: translateY(20px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes bounce {
//           0%, 80%, 100% { transform: translateY(0); }
//           40%            { transform: translateY(-6px); }
//         }
//       `}</style>