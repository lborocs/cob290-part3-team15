import {BsSend} from 'react-icons/bs';
import { useEffect,useState } from 'react';

function MessageBox() {
  useEffect(() => {
    const messageButton = document.querySelector("#submit_message_button")
    messageButton.addEventListener("click", function(){
      let messageBox = document.getElementById("message_box");
      let message = messageBox.value;
      if (message === "") {
        return;
      }
      console.log(message);
      messageBox.value = "";
    });
  }, []);
  return (
    <div className="form-group d-flex justify-content-center">
        <input type="text" className= "form-control" id="message_box" placeholder="Enter message" />
        <button type="submit" className="btn btn-primary" id="submit_message_button"><BsSend/></button>
    </div>
  );
}


/*Here's an example of a reacty way to do it (Not sure if it's even good practice but this was how my old project would do it) - Hugh */

/*
function MessageBox() {
  //A use state to hold the active data in the message input
  const [message, setMessage] = useState("");

  //Function to handle updates
  const handleMessageChange = (newMessage) => {
    setMessage(newMessage);
  }

  //Same as yours, just a function to execute on submit
  const onSubmit = () => {
    if (message===""){
      return
    }
    console.log(message);
    setMessage("");
  }

  return(
    <div className="form-group d-flex justify-content-center">
      <input type="text" className="form-control" value={message} onChange={(e) => handleMessageChange(e.target.value)} placeholder="Enter Message" />
      <button type="button" className="btn btn-primary" onClick={onSubmit}><BsSend/></button>
    </div>
  )
}
*/

export default MessageBox;