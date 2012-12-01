import Mouse (position)
import WebSockets (webSocket, delay1)
import Time (every)

f x = x ++ " hi"

s = webSocket "ws://localhost:8080" (lift f (delay1 s))
main = lift asText s