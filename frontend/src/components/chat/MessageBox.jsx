import {BsSend} from 'react-icons/bs';
import { useEffect } from 'react';

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

export default MessageBox;