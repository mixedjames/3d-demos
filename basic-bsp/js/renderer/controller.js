/*
  James' 3d Demos Package
  Copyright (C) 2018 James Heggie

  This library is free software; you can redistribute it and/or
  modify it under the terms of the GNU Lesser General Public
  License as published by the Free Software Foundation; either
  version 2.1 of the License, or (at your option) any later version.

  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
  Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public
  License along with this library; if not, write to the Free Software
  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
*/

define([], function(){

  function Controller(canvas) {
    const self = this;

    this.forward = false;
    this.backward = false;
    this.left = false;
    this.right = false;

    window.addEventListener('keydown', function(e){

      switch (e.code) {

      case "ArrowUp":
      case "KeyW":
        self.forward = true;
        self.backward = false;
        break;

      case "ArrowDown":
      case "KeyS":
        self.forward = false;
        self.backward = true;
        break;

      case "ArrowLeft":
      case "KeyA":
        self.left = true;
        self.right = false;
        break;

      case "ArrowRight":
      case "KeyD":
        self.left = false;
        self.right = true;
        break;
      }

    });

    window.addEventListener('keyup', function(e){
      switch (e.code) {

      case "ArrowUp":
      case "KeyW":
        if (self.forward) {
          self.forward = false;
          self.backward = false;
        }
        break;

      case "ArrowDown":
      case "KeyS":
        if (self.backward) {
          self.forward = false;
          self.backward = false;
        }
        break;

      case "ArrowLeft":
      case "KeyA":
        if (self.left) {
          self.left = false;
          self.right = false;
        }
        break;

      case "ArrowRight":
      case "KeyD":
        if (self.right) {
          self.left = false;
          self.right = false;
        }
        break;
      }
    });
  }

  Controller.prototype = {
  };

  return Controller;
});