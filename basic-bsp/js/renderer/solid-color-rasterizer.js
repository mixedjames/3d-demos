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
  'renderer/clip-polygon-to-z'
], function(glMatrix, ClipPolygonToZ){

  const mat4 = glMatrix.mat4;
  const vec3 = glMatrix.vec3;

  function SolidColorRasterizer(target) {
    this.g_ = target.getContext('2d');

    this.transform = mat4.create();
  }

  SolidColorRasterizer.prototype = {

    Clear: function() {
      const g = this.g_;
      g.clearRect(0, 0, g.canvas.width, g.canvas.height);
    },

    DrawQuad: function(vertices) {
      const transform = this.transform;
      const g = this.g_;
      const canvas = g.canvas;

      if (vertices.length < 12) {
        return;
      }

      let transformedVertices = vertices.slice();

      vec3.forEach(transformedVertices, 0,0,0, vec3.transformMat4, transform);

      const eyeToVertex = [transformedVertices[0], transformedVertices[1], transformedVertices[2]];
      vec3.normalize(eyeToVertex, eyeToVertex);

      const quadNormal = vec3.create();
      const a = vec3.fromValues(
        transformedVertices[3] - transformedVertices[0],
        transformedVertices[4] - transformedVertices[1],
        transformedVertices[5] - transformedVertices[2],
      );
      const b = vec3.fromValues(
        transformedVertices[6] - transformedVertices[0],
        transformedVertices[7] - transformedVertices[1],
        transformedVertices[8] - transformedVertices[2],
      );

      vec3.cross(quadNormal, a, b);
      vec3.normalize(quadNormal, quadNormal);

      if (vec3.dot(eyeToVertex, quadNormal) > 0) {
        return;
      }

      transformedVertices = ClipPolygonToZ(transformedVertices);
      if (transformedVertices.length < 6) {
        return;
      }

      vec3.forEach(transformedVertices, 0,0,0, function(out, coord) {
        const f = 2;
        out[0] = f* coord[0] / coord[2];
        out[1] = f* coord[1] / coord[2];

        out[0] = out[0] * canvas.height/2 + canvas.width/2;
        out[1] = -out[1] * canvas.height/2 + canvas.height/2;
      });

      g.save();
      if (vertices.color) {
        g.fillStyle = vertices.color;
      }

      g.beginPath();

      g.moveTo(transformedVertices[0], transformedVertices[1]);
      for (let i = 3; i < transformedVertices.length; i += 3) {
        g.lineTo(transformedVertices[i], transformedVertices[i+1]);
      }

      g.fill();
      g.restore();

    },

    DrawQuads: function(quads) {
      quads.forEach(this.DrawQuad.bind(this));
    },

    DrawRect: function(r) {
      const minX = r.xywh[0];
      const maxX = r.xywh[0] + r.xywh[2];
      const minY = 0;
      const maxY = 2;
      const minZ = r.xywh[1];
      const maxZ = r.xywh[1] + r.xywh[3];

      const cube = [
        /* front */ [minX,minY,minZ, minX,maxY,minZ, maxX,maxY,minZ, maxX,minY,minZ],
        /* back */  [minX,minY,maxZ, maxX,minY,maxZ, maxX,maxY,maxZ, minX,maxY,maxZ],
        /* left */  [minX,minY,minZ, minX,minY,maxZ, minX,maxY,maxZ, minX,maxY,minZ],
        /* right */ [maxX,minY,minZ, maxX,maxY,minZ, maxX,maxY,maxZ, maxX,minY,maxZ],
        /* top */   [minX,maxY,minZ, minX,maxY,maxZ, maxX,maxY,maxZ, maxX,maxY,minZ],
        /* bottom */[minX,minY,minZ, maxX,minY,minZ, maxX,minY,maxZ, minX,minY,maxZ]
      ];

      cube[0].color = 'red';
      cube[1].color = 'blue';
      cube[2].color = 'purple';
      cube[3].color = 'green';
      cube[4].color = 'grey';
      cube[5].color = 'yellow';

      this.DrawQuads(cube);
    }
  };

  return SolidColorRasterizer;
});