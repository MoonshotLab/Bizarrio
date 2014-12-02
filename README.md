# Bizarrio
A two-dimensional game projection mapped upon a dynamic three-dimensional surface.

Two [Arduino Megas](http://arduino.cc/en/Main/arduinoBoardMega) are enslaved to a [Node](http://nodejs.org/) server. The game interface is a web page running the [Phaser](http://phaser.io/) engine which controls all game logic. Communication to the server is facilitated via [web sockets](http://socket.io/).


## Setup
* Install node and client side dependencies - `npm install`, `bower install`.
* Load the standard [firmata](http://arduino.cc/en/reference/firmata) library  on one or more Arduinos - [tutorial](https://www.youtube.com/watch?v=l4jFQIoY9ZY).
* Hardware pin mappings are defined as object properties within each obstacle via the [tiled map editor](http://www.mapeditor.org/).


## Other Tips
This game uses keyboard controls for character movement. [Joystick Mapper](http://joystickmapper.com/) is an excellent choice for keyboard to control mapping, NES USB controls can be picked up on [Amazon](http://www.amazon.com/Classic-USB-NES-Controller-PC/dp/B002YVD3KM) for fairly cheap.

I had an issue with phaser, or possibly the way I've written some portion of the game, and graphics card switching on recent Mac Book Pros. I overcame the problem by installing [gfxCardStatus](https://gfx.io/) and forcing integrated use only.


## Other Stuff
Adding Players: You can add more players to the game by adding empty objects to the players array in game initialization - `public/index.js`.

Arduinos are identified in the tiled map editor by their index, not serial number. The indices are then assigned on the server according to their serial number. This is confusing to describe, but allows us to swap Arduinos if necessary.


## Technologies / Tools Used
* [Arduino](http://www.arduino.cc/)
* [Node](http://nodejs.org/)
* [Phaser](http://phaser.io/)
* [Firmata](http://firmata.org/wiki/Main_Page)
* [Tiled](http://www.mapeditor.org/)
* [Web Sockets](http://socket.io/)
