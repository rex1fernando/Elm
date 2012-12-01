Elm.WebSockets = function() {
  var JS = Elm.JavaScript;
  var toElmString = Elm.JavaScript.castJSStringToString;
  var toJSString = Elm.JavaScript.castStringToJSString;

  function sendToWebSocket(socket) {
    return function(input) {
      if (socket.readyState == WebSocket.OPEN) {
        console.log(toJSString(input));
        socket.send(toJSString(input));
      }
    }
  }

  function webSocket(address, input) {
    var output = Elm.Signal.constant(["Nil"]);
    var socket = new WebSocket(toJSString(address));
    var sender = Elm.Signal.lift(sendToWebSocket(socket))(input);
    function f(x) { return function(y) { return x; } }
    var combine = Elm.Signal.lift2(f)(output)(sender);
    socket.onerror = function(error) {
      Dispatcher.notify(output.id, toElmString(error));
      combine = output;
    }
    socket.onmessage = function(event) {
      Dispatcher.notify(output.id, toElmString(event.data));
    }

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

  return {webSocket : function(address) { return function(input) { return webSocket(address, input); }},
	  delay1 : delay1
					
         };
}();