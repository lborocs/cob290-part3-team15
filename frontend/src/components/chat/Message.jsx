function Message({ message , userID }) {
  const sentByUser = parseInt(message.user) === parseInt(userID); // Check if the message was sent by the user, parses as int and uses base 10 (denary/decimal)
  console.log(sentByUser);
  return (
    <div className={`w-75 my-2 rounded-lg border border-2 px-5 py-2 text-base font-medium ${sentByUser ? 'justify-right bg-blue-300' : 'justify-left bg-gray-500'}`} id="message">
        <div className="message_user" id="message_user">
            {message.user}
        </div>
        <div className="message_content" id="message_content">
            {message.content}
        </div>
    </div>
  );
}

export default Message;