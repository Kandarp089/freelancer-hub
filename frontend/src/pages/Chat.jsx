import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Send, MessageSquare, User, Paperclip } from 'lucide-react';

export default function Chat() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const activeConvId = searchParams.get('conv');
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const ws = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    API.get('/messaging/conversations/')
      .then(res => {
        const convs = res.data.results || res.data;
        setConversations(convs);
        if (activeConvId) {
          const target = convs.find(c => c.id === parseInt(activeConvId));
          if (target) setActiveConv(target);
        } else if (convs.length > 0) {
          setActiveConv(convs[0]);
        }
      })
      .catch(err => console.error(err));
  }, [activeConvId]);

  useEffect(() => {
    if (!activeConv) return;

    // Load message history via REST
    API.get(`/messaging/messages/?conversation=${activeConv.id}`)
      .then(res => setMessages(res.data.results || res.data))
      .catch(err => console.error(err));

    // Connect WebSocket
    const wsUrl = `ws://${window.location.hostname}:8000/ws/chat/${activeConv.id}/`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'chat_message') {
        setMessages(prev => [...prev, {
          id: data.id,
          content: data.content,
          sender: data.sender_id,
          sender_data: { username: data.sender_name },
          created_at: data.created_at
        }]);
      }
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [activeConv]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !activeConv) return;

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'chat_message',
        content: newMsg,
        sender_id: user.id
      }));
      setNewMsg('');
    } else {
      // Fallback REST API message send
      API.post('/messaging/messages/', { conversation: activeConv.id, content: newMsg })
        .then(res => {
          setMessages(prev => [...prev, res.data]);
          setNewMsg('');
        });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-100px)]">
      <div className="bg-[#171719] border border-[#2A2A2E] rounded-3xl h-full flex overflow-hidden shadow-2xl">
        
        {/* Conversations List */}
        <div className="w-80 border-r border-[#2A2A2E] bg-[#111113] flex flex-col shrink-0">
          <div className="p-4 border-b border-[#2A2A2E]">
            <h2 className="font-extrabold text-base text-[#F4F0E8]">Conversations</h2>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-[#2A2A2E]">
            {conversations.map(c => {
              const otherMember = (c.members_data || []).find(m => m.id !== user?.id) || {};
              const isActive = activeConv?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveConv(c)}
                  className={`w-full text-left p-4 flex items-center space-x-3 transition-colors ${
                    isActive ? 'bg-[#171719] border-l-4 border-[#F4B860]' : 'hover:bg-[#171719]/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#2A2A2E] text-[#F4B860] font-bold text-sm flex items-center justify-center">
                    {(otherMember.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-[#F4F0E8] truncate">{otherMember.username || 'User'}</p>
                    <p className="text-[11px] text-[#8D8A83] truncate">{c.last_message?.content || 'No messages yet'}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-[#0B0B0D]">
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-[#171719] border-b border-[#2A2A2E] flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#F4F0E8]">
                  Chat with {(activeConv.members_data || []).find(m => m.id !== user?.id)?.username || 'User'}
                </h3>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map(m => {
                  const isMine = m.sender === user?.id || m.sender_data?.username === user?.username;
                  return (
                    <div key={m.id || Math.random()} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isMine ? 'bg-[#F4B860] text-[#0B0B0D] font-medium rounded-br-none' : 'bg-[#171719] text-[#F4F0E8] border border-[#2A2A2E] rounded-bl-none'
                      }`}>
                        <p>{m.content}</p>
                        <p className={`text-[9px] mt-1 text-right ${isMine ? 'text-[#0B0B0D]/70' : 'text-[#8D8A83]'}`}>
                          {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Message Input Bar */}
              <form onSubmit={handleSend} className="p-4 bg-[#171719] border-t border-[#2A2A2E] flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  className="flex-1 bg-[#0B0B0D] border border-[#2A2A2E] text-[#F4F0E8] text-xs p-3 rounded-xl focus:border-[#F4B860] focus:outline-none"
                />
                <button type="submit" className="btn-amber p-3 rounded-xl">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[#8D8A83] text-sm">
              Select a conversation to start chatting.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
