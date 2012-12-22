import Mouse (position)
import WebSockets (webSocket, send, recv)
import Time
import Maybe

socket = webSocket (constant "ws://localhost:8080")

statusmessage = lift (\s -> case s of
                                { Waiting -> "waiting for socket to open"
                                ; Open s -> "socket is open"
                                ; Error e -> "error: " ++ e
                                ; Closed -> "socket was closed" }) socket




messages = lift (fromMaybe "Haven't received anything yet") (recv socket)
stuff = send socket (delay second messages)
--stuff = send socket messages



main = lift asText (merge statusmessage messages)
