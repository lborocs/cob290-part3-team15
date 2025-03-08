function MessageBox() {
  return (
    <span>
    <div className="form-group d-flex justify-content-center">
        <input type="text" className= "form-control" id="messageBox" placeholder="Enter message" />
        <button type="submit" class="btn btn-primary">
          <i class="fa fa-paper-plane"></i>
        </button>
    </div>
    </span>
  );
}

export default MessageBox;