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
  'clip-polygon-to-z'
], function(glMatrix, ClipPolygonToZ){

  const mat4 = glMatrix.mat4;
  const vec3 = glMatrix.vec3;

  function Renderer(target) {
    this.g_ = target.getContext('2d');

    this.transform = mat4.create();
  }

  Renderer.prototype = {

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

      const transformedVertices = vertices.slice();

      vec3.forEach(transformedVertices, 0,0,0, vec3.transformMat4, transform);

      vec3.forEach(transformedVertices, 0,0,0, function(out, coord) {
        out[0] = coord[0] / coord[2];
        out[1] = coord[1] / coord[2];

        out[0] = out[0] * canvas.height/2 + canvas.width/2;
        out[1] = -out[1] * canvas.height/2 + canvas.height/2;
      });

      g.save();
      if (vertices.color) {
        g.fillStyle = vertices.color;
      }

      g.beginPath();
      for (let i = 0; i < transformedVertices.length; i += 12) {
        g.moveTo(transformedVertices[i], transformedVertices[i+1]);
        g.lineTo(transformedVertices[i+3], transformedVertices[i+4]);
        g.lineTo(transformedVertices[i+6], transformedVertices[i+7]);
        g.lineTo(transformedVertices[i+9], transformedVertices[i+10]);
        g.closePath();
      }
      g.fill();
      g.restore();
    },

    DrawQuadWithCulling: function(vertices) {
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
        out[0] = coord[0] / coord[2];
        out[1] = coord[1] / coord[2];

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

    DrawQuadsWithCulling: function(quads) {
      quads.forEach(this.DrawQuadWithCulling.bind(this));
    }

  };

  return Renderer;
});