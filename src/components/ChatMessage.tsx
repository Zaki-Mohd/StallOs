import { BotMessageSquare } from "lucide-react";

const ChatMessage = ({ role, text }: { role: 'user' | 'assistant', text: string }) => (
  <div className={`flex items-start gap-3 my-4 ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
    {role === 'assistant' && <BotMessageSquare className="h-8 w-8 text-blue-500 flex-shrink-0" />}
    <div className={`px-4 py-2 rounded-lg max-w-lg ${role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
      <p>{text}</p>
    </div>
  </div>
);

export default ChatMessage