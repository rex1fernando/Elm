import Mouse (position)
import WebSockets (webSocket)
import Time (every)

s = webSocket "ws://localhost:8080" (lift show (every 1))
main = lift asText s