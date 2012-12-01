#!/bin/sh

cat Guid.js foreign/JavaScript.js foreign/JSON.js Value.js List.js Maybe.js Char.js Graphics/Color.js Graphics/Collage.js Graphics/Element.js Text.js Graphics/Render.js runtime/Signal.js runtime/Dispatcher.js Signal/HTTP.js Signal/WebSockets.js Signal/Input.js Signal/Keyboard.js Signal/Mouse.js Signal/Random.js Signal/Time.js Signal/Window.js Date.js Prelude.js Dict.js Set.js Automaton.js > ../elm-mini.js


cd ../elm

cp ../elm-mini.js elm-runtime-0.5.5.js