function MessageBox() {
  return (
    <span>
    <div className="form-group d-flex justify-content-center">
        <input type="text" className= "form-control" id="messageBox" placeholder="Enter message" />
        <i class="bi bi-send"></i>
    </div>
    </span>
  );
}

export default MessageBox;