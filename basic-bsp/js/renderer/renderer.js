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
  'renderer/null-sort',
  'renderer/simple-sort',
  'renderer/bsp-sort',
  'renderer/wireframe-rasterizer',
  'renderer/solid-color-rasterizer'
],function(GLM, NullSort, SimpleSort, BSPSort, WireframeRasterizer, SolidColorRasterizer){

  const mat4 = GLM.mat4;

  const RECT_SORTERS = {
    'null': NullSort,
    'simple': SimpleSort,
    'bsp': BSPSort
  };

  const RASTERIZERS = {
    'wireframe': WireframeRasterizer,
    'solid-color': SolidColorRasterizer
  };

  function Renderer(canvas) {
    this.canvas_ = canvas;

    //this.SortRects_ = RECT_SORTERS['null'];
    //this.SortRects_ = RECT_SORTERS['simple'];
    this.SortRects_ = RECT_SORTERS['bsp'];

    //this.rasterizer_ = new RASTERIZERS['wireframe'](canvas);
    this.rasterizer_ = new RASTERIZERS['solid-color'](canvas);
  }

  Renderer.prototype = {

    Render: function(map, camera) {
      const self = this;
      const t = self.rasterizer_.transform;

      mat4.identity(t);
      mat4.rotateY(t, t, camera.yaw);
      mat4.translate(t, t, camera.xyz);

      self.rasterizer_.Clear();
      self.SortRects_(map, camera, function(rect) {
        self.rasterizer_.DrawRect(rect);
      });
    }

  };

  return Renderer;
});