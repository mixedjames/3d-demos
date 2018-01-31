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

/**
 * main.js draws a spinning cube using the renderer.js module
 *
 */

define([
  'renderer',
  'gl-matrix'
], function(Renderer, GLMatrix){

  const vec3 = GLMatrix.vec3;
  const mat4 = GLMatrix.mat4;
  const DEGREES_TO_RADIANS = Math.PI/180;

  const r = new Renderer(document.getElementById('canvas'));

  const cube = [
    /* front face */ [-1,-1,-1,  -1,1,-1,  1,1,-1,  1,-1,-1,  -1,-1,-1],
    /* back face */ [-1,-1,1,  -1,1,1,  1,1,1,  1,-1,1,  -1,-1,1],
    /* sides */
      [1,1,-1,  1, 1,1],
      [-1,1,-1,  -1,1,1],
      [-1,-1,-1,  -1,-1,1],
      [1,-1,-1,  1,-1,1]
  ];

  const t0 = performance.now();
  let angle = 0;

  requestAnimationFrame(Animate);

  function Animate(time) {

    const dT = time - t0;
    angle = dT * 0.1;

    mat4.identity(r.transform);
    mat4.translate(r.transform, r.transform, [0, 0, 5]);
    mat4.rotateX(r.transform, r.transform, angle * DEGREES_TO_RADIANS);

    r.Clear();
    r.DrawPolyLines(cube);

    requestAnimationFrame(Animate);
  }
});