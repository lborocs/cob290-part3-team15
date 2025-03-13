import Message from "../Message";
function MessageList({ messages, userID }) {
  return (
    <div className="flex flex-col">
        {messages.map((message) => (
            <Message key={message.messageID} message={message} userID={userID} />
        ))}
    </div>
  );
}

export default MessageList;