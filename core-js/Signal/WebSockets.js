// data SocketStatus = Waiting | Open SocketHandle | Closed | Error String
// data SocketMessage = Waiting | Message String | Closed | Error String

// webSocket :: Signal String -> Signal SocketStatus
// send :: Signal SocketStatus -> Signal String -> Signal ()
// recv :: Signal SocketStatus -> Signal SocketMessage

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
          Dispatcher.notify(socket.receiverSignals[i].id, ["Message", toElmString(event.data)]);
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
        Dispatcher.notify(messages.id, socket);
        return;
      case "Error":
        Dispatcher.notify(messages.id, socket);
        return;
      case "Open":
        if (!messages.wsinternal_alreadyAddedToReceivers) {
          socket[1].receiverSignals.push(messages);
          messages.wsinternal_alreadyAddedToReceivers = true;
        }
        return;
      case "Waiting":
        Dispatcher.notify(messages.id, socket);
        return;
      }
    }
  }

  function recv(socket) {
    var messages = Elm.Signal.constant(toElmString("Waiting"));
    var receiver = Elm.Signal.lift(receiveFromWebSocket(messages))(socket);
    
    function f(x) { return function(y) { return x; } }
    var combine = Elm.Signal.lift2(f)(messages)(receiver);

    return combine;
  }

  function webSocket(address) {
    var output = Elm.Signal.constant(["Waiting"]);
    var initializer = Elm.Signal.lift(initializeWebSocket(output))(address);
        
    function f(x) { return function(y) { return x; } }
    var combine = Elm.Signal.lift2(f)(output)(initializer);

    return combine;
  }

  function delay1handler(output) { 
    return function(input) {
      setTimeout(function() { Dispatcher.notify(output.id, input); }, 1000);
    }
  }

  function delay1(input) {
    var output = Elm.Signal.constant(input.value);
    var delay = Elm.Signal.lift(delay1handler(output))(input);
    function f(x) { return function(y) { return x; } }
    var combine = Elm.Signal.lift2(f)(output)(delay);
    return combine;
  }

  return {webSocket : webSocket,
	  delay1 : delay1,
          send : send,
          recv : recv
					
         };
}();