function SelfMessage({ message }) {
  return(
  <div className={`max-w-3/4 my-2 rounded-lg border border-2 border-blue-200 px-4 py-2 text-base font-medium self-end bg-blue-300`} id="message">
    <div className="self-start text-pretty break-all">
      <div className="w-fit">
          {message.user}
      </div>
      <div className="w-fit">
          {message.content}
      </div>
    </div>
  </div>
  )
}

function OtherMessage({ message }) {
  return(
  <div className={`max-w-3/4 my-2 rounded-lg border border-2 border-gray-400 px-4 py-2 text-base font-medium self-start bg-gray-500`} id="message">
    <div className="text-left text-pretty break-all">
      <div className="w-fit">
          {message.user}
      </div>
      <div className="w-fit">
          {message.content}
      </div>
    </div>
  </div>
  )
}






function Message({ message , userID }) {
  const sentByUser = parseInt(message.user) === parseInt(userID); // Check if the message was sent by the user, parses as int and uses base 10 (denary/decimal)
  return (
    <>
      {sentByUser ? <SelfMessage message={message} /> : <OtherMessage message={message} />}
    </>
  );
}

export default Message;