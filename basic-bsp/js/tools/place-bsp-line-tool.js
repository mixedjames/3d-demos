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
  'geometry/line-seg'
], function(LineSeg){

  function PlaceBSPLineTool(editor, OnToolDone_) {
    this.editor_ = editor;
  }

  PlaceBSPLineTool.prototype = {
    Start: function(e) {
      const xy = this.editor_.view.UserCoordsToView([e.offsetX, e.offsetY]);

      this.line_ = new LineSeg(xy, xy);
      this.editor_.map.CurrentBSPLine(this.line_);
      this.editor_.view.Render();
    },

    MouseMoved: function(e) {
      const xy = this.editor_.view.UserCoordsToView([e.offsetX, e.offsetY]);

      if (this.line_) {
        this.line_.b = xy;
        this.editor_.view.Render();
      }
    },

    MouseReleased: function(e) {
      if (this.line_) {
        this.editor_.map.BSP().AddLineFromSegment(this.line_);
      }

      this.editor_.map.CurrentBSPLine(null);
    },

    Stop: function() {
    }
  };

  return PlaceBSPLineTool;
});