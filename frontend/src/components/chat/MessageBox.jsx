import {BsSend} from 'react-icons/bs';

function MessageBox() {
  return (
    <div className="form-group d-flex justify-content-center">
        <input type="text" className= "form-control" id="messageBox" placeholder="Enter message" />
        <button type="submit" className="btn btn-primary"><BsSend/></button>
    </div>
  );
}

export default MessageBox;