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

  function DrawRectTool(editor, OnToolDone) {
    this.editor_ = editor;
    this.OnToolDone_ = OnToolDone;

    this.xy0_ = [0,0];
    this.xy1_ = [0,0];
    this.rect_ = null;
  }

  DrawRectTool.prototype = {
    Start: function(e) {
      this.xy0_ = this.editor_.view.UserCoordsToView([e.offsetX, e.offsetY]);
      this.rect_ = {
        xywh: [this.xy0_[0], this.xy0_[1], 0, 0],
        editing: true
      };

      this.editor_.map.AddRect(this.rect_);
    },

    MouseMoved: function(e) {
      this.xy1_ = this.editor_.view.UserCoordsToView([e.offsetX, e.offsetY]);

      this.rect_.xywh[0] = Math.min(this.xy0_[0], this.xy1_[0]);
      this.rect_.xywh[1] = Math.min(this.xy0_[1], this.xy1_[1]);

      this.rect_.xywh[2] = Math.abs(this.xy0_[0] - this.xy1_[0]);
      this.rect_.xywh[3] = Math.abs(this.xy0_[1] - this.xy1_[1]);

      this.editor_.view.Render();
    },

    MouseReleased: function(e) {
      this.rect_.editing = false;
      this.rect_ = null;

      this.OnToolDone_();
    },

    Stop: function() {
    }
  };

  return DrawRectTool;
});