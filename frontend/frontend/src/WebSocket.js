class WebSocketService {
  static instance = null;
  callbacks = {};

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  constructor() {
    this.socketRef = null;
  }

  connect(issue_id) {
    if (issue_id == 0) {
      return this.socketRef.close();
    }

    const path = `ws://localhost:8000/ws/comments/${issue_id}`;
    this.socketRef = new WebSocket(path);

    this.socketRef.onmessage = (e) => {
      this.socketNewMessage(e.data);
    };

    // this.socketRef.onopen = () => {
    //   console.log("WebSocket open");
    // };

    // this.socketRef.onerror = (e) => {
    //   console.log(e.message);
    // };

    this.socketRef.onclose = () => {
      //   console.log("WebSocket closed, restarting..");
      this.connect();
    };
  }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    // console.log('Message:',parsedData)
    const command = parsedData.command;
    if (Object.keys(this.callbacks).length === 0) {
      return;
    }
    if (command === "comments") {
      this.callbacks[command](parsedData.comments);
    }
    if (command === "new_comment") {
      //   console.log("okay so this was called");
      this.callbacks[command](parsedData.comment);
    }
  }

  initCommentUser(access_token) {
    this.sendComment({ command: "init_comments", access_token: access_token });
  }

  fetchComments() {
    this.sendComment({ command: "fetch_comments" });
  }

  newComment(comment, issue_id) {
    this.sendComment({
      command: "new_comment",
      from: comment.from,
      text: comment.text,
      issue_id: issue_id,
    });
  }

  addCallbacks(commentsCallback, newCommentCallback) {
    this.callbacks["comments"] = commentsCallback;
    this.callbacks["new_comment"] = newCommentCallback;
  }

  sendComment(data) {
    try {
      //   console.log({...data})
      this.socketRef.send(JSON.stringify({ ...data }));
    } catch (err) {
      //   console.log(err.message);
    }
  }
  state() {
    return this.socketRef.readyState;
  }
  waitForSocketConnection(callback) {
    const socket = this.socketRef;
    const recursion = this.waitForSocketConnection;
    setTimeout(function () {
      if (socket.readyState === 1) {
        // console.log("Connection is made");
        if (callback != null) {
          callback();
        }
        return;
      } else {
        // console.log("Wait for connection..");
        recursion(callback);
      }
    }, 1);
  }
}

let WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;
