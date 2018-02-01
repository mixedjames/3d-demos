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
], function(){

  function MoveCameraTool(editor, OnToolDone) {
    this.editor_ = editor;
    this.camera0_ = [0,0];
    this.mouse0_ = [0,0];
    this.OnToolDone_ = OnToolDone;
  }

  MoveCameraTool.prototype = {
    Start: function(e) {
      this.camera0_ = this.editor_.map.Camera();
      this.mouse0_ = this.editor_.view.UserCoordsToView([e.offsetX, e.offsetY]);
    },

    MouseMoved: function(e) {
      const xy = this.editor_.view.UserCoordsToView([e.offsetX, e.offsetY]);

      this.editor_.map.MoveCamera([
        this.camera0_[0] + xy[0] - this.mouse0_[0],
        this.camera0_[1] + xy[1] - this.mouse0_[1]
      ]);
      this.editor_.view.Render();
    },

    MouseReleased: function(e) {
      this.OnToolDone_();
    },

    Stop: function() {
    }
  };

  return MoveCameraTool;
});