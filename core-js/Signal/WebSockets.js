Elm.WebSockets = function() {
  var JS = Elm.JavaScript;
  var toElmString = Elm.JavaScript.castJSStringToString;
  var toJSString = Elm.JavaScript.castStringToJSString;
  


  function sendToWebSocket(socket) {
    return function(input) {
      socket.send(toJSString(input));
    }
  }

  function webSocket(input) {
    var socket = new WebSocket("ws://localhost:8080");
    var socketOpen = false;
    socket.onopen = function() {
      socketOpen = true;
    }
    socket.onmessage = function(event) {
      Dispatcher.notify(output.id, toElmString(event.data));
    }
    while (!socketOpen) ;
    var output = Elm.Signal.constant(["Nil"]);
    var sender = Elm.Signal.lift(sendToWebSocket(socket))(input);
    function f(x) { return function(y) { return x; } }
    var combine = Elm.Signal.lift2(f)(output)(sender);
    return combine;
  }

  return {webSocket : webSocket
	  };
}();
