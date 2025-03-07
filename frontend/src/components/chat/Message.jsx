function Message({ message }) {
  return (
    <div className="message">
        <div className="message_user">
            {message.user}
        </div>
        <div className="message_content">
            {message.content}
        </div>
    </div>
  );
}