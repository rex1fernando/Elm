Elm.WebSockets = function() {
  var JS = Elm.JavaScript;
  var toElmString = Elm.JavaScript.castJSStringToString;
  var toJSString = Elm.JavaScript.castStringToJSString;
  
  var socket = new WebSocket("ws://localhost:8080");

  function sendToWebSocket(input) {
    socket.send(toJSString(input));
  }

  function webSocket(input) {
    var output = Elm.Signal.constant(["Nil"]);
    socket.onmessage = function(event) {
      Dispatcher.notify(output.id, toElmString(event.data));
    }
    var sender = Elm.Signal.lift(sendToWebSocket)(input);
    function f(x) { return function(y) { return x; } }
    var combine = Elm.Signal.lift2(f)(output)(sender);
    return combine;
  }

  return {webSocket : webSocket
	  };
}();
