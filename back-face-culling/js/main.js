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
  'renderer'
], function(GLM, Renderer){

  const glMatrix = GLM.glMatrix;
  const mat4 = GLM.mat4;

  const r = new Renderer(document.getElementById('canvas'));

  const cube = [
    /* front */ [-1,-1,-1, -1,1,-1, 1,1,-1, 1,-1,-1],
    /* back */  [-1,-1,1, 1,-1,1, 1,1,1, -1,1,1],
    /* left */  [-1,-1,-1, -1,-1,1, -1,1,1, -1,1,-1],
    /* right */ [1,-1,-1, 1,1,-1, 1,1,1, 1,-1,1],
    /* top */   [-1,1,-1, -1,1,1, 1,1,1, 1,1,-1],
    /* bottom */[-1,-1,-1, 1,-1,-1, 1,-1,1, -1,-1,1]
  ];

  cube[0].color = 'red';
  cube[1].color = 'blue';
  cube[2].color = 'purple';
  cube[3].color = 'green';
  cube[4].color = 'grey';
  cube[5].color = 'yellow';

  const t0 = performance.now();
  Animate(t0);

  function Animate(t) {

    const dT = t - t0;
    const angle = dT * 0.1;

    mat4.identity(r.transform);
    mat4.translate(r.transform, r.transform, [-2,0,5]);
    mat4.rotateX(r.transform, r.transform, glMatrix.toRadian(angle));
    mat4.rotateY(r.transform, r.transform, glMatrix.toRadian(angle));

    r.Clear();
    r.DrawQuads(cube);

    mat4.identity(r.transform);
    mat4.translate(r.transform, r.transform, [2,0,5]);
    mat4.rotateX(r.transform, r.transform, glMatrix.toRadian(angle));
    mat4.rotateY(r.transform, r.transform, glMatrix.toRadian(angle));

    r.DrawQuadsWithCulling(cube);

    requestAnimationFrame(Animate);
  }
});