# Bio Raider

Live Link: 

Description:
Play as the survivor trying to escape their own body whilst avoiding autoimmune attacks, destroying pathogens, and trying to figure out what is causing their illness. A cross between resident evil and bullet hell style games.

Features:
Each level is a non scrolling fixed camera arena.
2 types of zoom, closeish and farish
Players can go to different arenas after the arena is cleared or after a certain time survived. The directions they can go (up down left or right) will be displayed when accesable.
Map screen showing areas currently in and explored.
Main bulk of traveling will be through the vascular system (left right) but occasionally there will be other rooms (up / down) that can lead to a different part of the vascular system or a puzzle / item room.
Simple puzzles like you need item to open door.
Max inventory of 6. Any items must be dropped to make space.
Gameplay will involve shooting enemies with auto aim lockon, using items, applying finishing moves, jumping to dodge certain attacks, avoiding floor traps by jumping/manuvering, some pseudo platforming on rooms without enemies.

TODO:
Allow loading in of alt dev assets through imports
Add ai generated backgrounds
Add ai generated status images
Add ranged enemies (plasma b cells and memory b cells)
Add map button bound to "m" "c". Toggles map overlay.

To get Xbox Controller Working change in package.json
"react-gamepad": "^1.0.3" to "react-gamepad": "SBRK/react-gamepad",
then run npm i

git subtree push --prefix dist origin gh-pages