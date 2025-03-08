function MessageBox() {
  return (
    <div className="form-group">
        <input type="text" className= "form-control" id="messageBox" placeholder="Enter message" />
        <button type="submit" class="btn btn-primary">
          <i class="fa fa-paper-plane"></i>
        </button>
    </div>
  );
}

export default MessageBox;