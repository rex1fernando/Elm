// data Socket = Waiting | Open SocketHandle | Closed | Error String

// webSocket :: Signal String -> Signal Socket
// send :: Signal Socket -> Signal String -> Signal ()
// recv :: Signal Socket -> Signal (Maybe String)

Elm.WebSockets = function() {
  var JS = Elm.JavaScript;
  var toElmString = Elm.JavaScript.castJSStringToString;
  var toJSString = Elm.JavaScript.castStringToJSString;

  function sendToWebSocket(socket) {
    return function(input) {
      switch(socket[0]){
      case "Closed":
        return;
      case "Error":
        return;
      case "Open":
        socket[1].send(toJSString(input));
        return;
      case "Waiting":
        return;
      }
      return ["Tuple0"];
    }
  }

  function initializeWebSocket(output) {
    return function(address) {
      var socket = new WebSocket(toJSString(address));
      socket.receiverSignals = [];
      socket.onopen = function() {
        Dispatcher.notify(output.id, ["Open", socket]);
      }
      socket.onclose = function() {
        Dispatcher.notify(output.id, ["Closed"]);
      }
      socket.onerror = function(error) {
        Dispatcher.notify(output.id, ["Error", toElmString(error)]);
      }
      socket.onmessage = function(event) {
        for (var i = 0; i < socket.receiverSignals.length; i++) {
          Dispatcher.notify(socket.receiverSignals[i].id, ["Just", toElmString(event.data)]);
        }
      }
    }
  }

  function send(socket) {
    return function(input) {
      var sender = Elm.Signal.lift2(sendToWebSocket)(socket)(input);
      return sender;
    }
  }

  function receiveFromWebSocket(messages) {
    return function(socket) {
      console.log(socket[0]);
      switch(socket[0]){
      case "Closed":
        return;
      case "Error":
        return;
      case "Open":
        if (!messages.wsinternal_alreadyAddedToReceivers) {
          socket[1].receiverSignals.push(messages);
          messages.wsinternal_alreadyAddedToReceivers = true;
        }
        return;
      case "Waiting":
        return;
      }
    }
  }

  function recv(socket) {
    var messages = Elm.Signal.constant(["Nothing"]);
    var receiver = Elm.Signal.lift(receiveFromWebSocket(messages))(socket);
    
    function f(x) { return function(y) { return x; } }
    var combine = Elm.Signal.lift2(f)(messages)(receiver);

    var out = Elm.Signal.sampleOn(messages)(combine);

    return out;
  }

  function webSocket(address) {
    var output = Elm.Signal.constant(["Waiting"]);
    var initializer = Elm.Signal.lift(initializeWebSocket(output))(address);
        
    function f(x) { return function(y) { return x; } }
    var combine = Elm.Signal.lift2(f)(output)(initializer);

    return combine;
  }

  return {webSocket : webSocket,
          send : send,
          recv : recv
         };
}();