import Mouse (position)
import WebSockets (webSocket, send, recv, delay1)
import Time (every)

socketStatus = webSocket (constant "ws://localhost:8080")

communicateWithWebSocket status = case status of
                                { Waiting -> "waiting"
                                ; Open s -> "open"
                                ; Error e -> "error"
                                ; Closed -> "closed" }

handleResponse r = case r of 
                 { Waiting -> "Waiting to connect"
                 ; Message m -> m
                 ; Error e -> "error: " ++ e
                 ; Closed -> "WebSocket closed" }


receivedText = lift handleResponse (recv socketStatus)
--stuff = send socketStatus (delay1 receivedText)
stuff = send socketStatus receivedText


main = lift asText receivedText
