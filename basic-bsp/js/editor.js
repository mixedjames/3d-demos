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
  'view',
  'tools/null-tool',
  'tools/move-camera-tool',
  'tools/draw-rect-tool',
  'tools/delete-rect-tool',
  'tools/place-bsp-line-tool'
], function(View, NullTool, MoveCameraTool, DrawRectTool, DeleteRectTool, PlaceBSPLineTool){

  function OnMouseDown(self, e) {
    const xy = self.view.UserCoordsToView([e.offsetX, e.offsetY]);

    self.activeTool_.Stop();

    if (self.mode_ == 'edit-map') {
      const camera = self.map.Camera();

      const dCamera = [xy[0]-camera[0], xy[1]-camera[1]];
      const distToCamera = Math.sqrt(dCamera[0]*dCamera[0] + dCamera[1]*dCamera[1]);

      if (distToCamera < self.view.cameraSize) {
        // Clicked the camera
        self.activeTool_ = self.tools_['move-camera-tool'];
      }
      else if (self.submode_ == 'create-rects') {
        self.activeTool_ = self.tools_['draw-rect-tool'];
      }
      else if (self.submode_ == 'delete-rects') {
        self.activeTool_ = self.tools_['delete-rect-tool'];
      }
    }
    else if (self.mode_ == 'edit-bsp') {
      self.activeTool_ = self.tools_['place-bsp-line-tool'];
    }

    self.activeTool_.Start(e);
  }

  function OnMouseMove(self, e) {
    if (self.mode_ != 'off') {
      self.activeTool_.MouseMoved(e);
    }
  }

  function OnMouseUp(self, e) {
    if (self.mode_ != 'off') {
      self.activeTool_.MouseReleased(e);
    }
  }

  function Editor(map, canvas) {
    const self = this;

    this.map = map;
    this.canvas = canvas;

    canvas.addEventListener('mousedown', OnMouseDown.bind(null, this));
    canvas.addEventListener('mousemove', OnMouseMove.bind(null, this));
    canvas.addEventListener('mouseup', OnMouseUp.bind(null, this));

    function ToolDone() {
      self.activeTool_.Stop();
      self.activeTool_ = self.tools_['null-tool'];
    }

    this.tools_ = {
      'null-tool': new NullTool(this, ToolDone),
      'move-camera-tool': new MoveCameraTool(this, ToolDone),
      'draw-rect-tool': new DrawRectTool(this, ToolDone),
      'delete-rect-tool': new DeleteRectTool(this, ToolDone),
      'place-bsp-line-tool': new PlaceBSPLineTool(this, ToolDone)
    };

    this.activeTool_ = this.tools_['null-tool'];
    this.mode_ = 'edit-map';
    this.submode_ = 'create-rects';

    this.view = new View(this);
    this.view.Render();

  }

  Editor.prototype = {

    Mode: function(mode) {
      if (mode) {
        this.mode_ = mode;
      }
      return this.mode_;
    },

    SubMode: function(submode) {
      if (submode) {
        this.submode_ = submode;
      }
      return this.submode_;
    }
  };

  return Editor;
});