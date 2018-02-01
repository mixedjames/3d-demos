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
  'bsp/Tree'
], function(BSPTree){

  function Map() {
    this.Reset();
  }

  Map.prototype = {

    Reset: function() {

      this.rects_ = [];
      this.camera_ = [0, 0];
      this.bsp_ = new BSPTree();
      this.currentBSPLine_ = null;

    },

    AddRect: function(r) {
      r.name = 'Rectangle ' + (this.rects_.length+1);
      this.rects_.push(r);
    },

    RemoveRects: function(rects) {
      const self = this;

      rects.forEach(function(r){
        const i = self.rects_.indexOf(r);
        if (i != -1) {
          self.rects_.splice(i, 1);
        }
      });
    },

    ForEachRect: function(fn) {
      this.rects_.forEach(fn);
    },

    FindRects: function(FnCriteria) {
      return this.rects_.filter(FnCriteria);
    },

    Rects: function() {
      return this.rects_.slice();
    },

    CategoriseRects: function() {
      this.bsp_.AddGeometry(this.rects_);
    },

    Camera: function() {
      return this.camera_.slice();
    },

    MoveCamera: function(xy) {
      this.camera_ = xy.slice();
    },

    CurrentBSPLine: function(line) {
      if (typeof line !== 'undefined') {
        this.currentBSPLine_ = line;
      }
      return this.currentBSPLine_;
    },

    BSP: function() {
      return this.bsp_;
    }
  };

  Map.RectContains = function(xy) {
    return function(rect) {
      return (
        xy[0] > rect.xywh[0]
        && xy[0] < rect.xywh[0] + rect.xywh[2]
        && xy[1] > rect.xywh[1]
        && xy[1] < rect.xywh[1] + rect.xywh[3]
      );
    };
  };

  return Map;
});