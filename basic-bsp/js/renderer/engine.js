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

define([
  'glMatrix',
  'renderer/renderer'
],function(GLM, Renderer){

  const vec3 = GLM.vec3;
  const mat4 = GLM.mat4;

  function RunLoop(self) {
    Update(self);
    Render(self);

    if (self.running_) {
      requestAnimationFrame(RunLoop.bind(null, self));
    }
  }

  function Update(self) {

    const dT = performance.now() - self.dT;

    if (self.controller_.left) {
      self.camera_.yaw += 0.01;
    }
    if (self.controller_.right) {
      self.camera_.yaw -= 0.01;
    }

    const speed = 0.1;
    if (self.controller_.forward) {
      self.camera_.xyz[0] += speed * Math.sin(self.camera_.yaw);
      self.camera_.xyz[2] -= speed * Math.cos(self.camera_.yaw);
    }
    else if (self.controller_.backward) {
      self.camera_.xyz[0] -= speed * Math.sin(self.camera_.yaw);
      self.camera_.xyz[2] += speed * Math.cos(self.camera_.yaw);
    }
  }

  function Render(self) {
    self.r_.Render(self.map_, self.camera_);
  }

  function Engine(map, canvas, controller) {
    this.map_ = map;
    this.r_ = new Renderer(canvas);
    this.controller_ = controller;

    this.running_ = false;
    this.camera_ = {
      xyz: [0,-0.5,0],
      yaw: 0
    };
  }

  Engine.prototype = {

    Start: function() {

      this.running_ = true;
      this.t0_ = performance.now();
      RunLoop(this);

    },

    Stop: function() {
      this.running_ = false;
    }

  };

  return Engine;

});