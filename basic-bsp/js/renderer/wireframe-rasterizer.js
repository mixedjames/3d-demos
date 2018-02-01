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
 * WireframeRasterizer.js is a module for rendering 3d lines to a <canvas> element.
 *
 * Usage:
 *   let c = document.getElementById('id-of-my-canvas-element');
 *   let r = new WireframeRasterizer(c);
 *
 *   r.Clear();
 *   r.DrawPolyLine([0,0,1, 1,1,1]);
 *
 * Key functions:
 *   Clear
 *   DrawPolyLine
 *
 * Key properties:
 *   transform
 */

define([
  'glMatrix',
  'renderer/clip-poly-line'
], function(glMatrix, ClipPolyLine){

  // We use 3-component vectors & 4x4 matrices from the 
  // very excellent glMatrix library
  //
  const vec3 = glMatrix.vec3;
  const mat4 = glMatrix.mat4;

  function WireframeRasterizer(target) {
    this.target_ = target;
    this.g_ = target.getContext('2d');

    this.transform = mat4.create();
  }

  WireframeRasterizer.prototype = {

    /**
     * Clears the canvas
     */
    Clear: function() {
      const g = this.g_;
      g.clearRect(0, 0, g.canvas.width, g.canvas.height);
    },

    /**
     * Draws a 3d polyline.
     * "polyline" is an array specified like this:
     *   polyline = [ x1,y1,z1, x2,y2,z2, x3,y3,z3 ];
     */
    DrawPolyLine: function(polyline) {

      const g = this.g_;
      const canvas = this.target_;
      const transform = this.transform;

      // Must specify at least two points in order to draw anything
      if (polyline.length < 6) {
        return;
      }

      // Step 1: copy the input array and transform it by the transform matrix
      //          * not directly related to perspective - don't worry about
      //            this bit too much; just allows us to do nice things
      //            like rotation and translation etc. *
      //
      const transformedCoords = polyline.slice();
      vec3.forEach(transformedCoords, 0, 0, 0, vec3.transformMat4, transform);

      // Step 2: clip the line to the near z plane
      //
      const lines = ClipPolyLine(transformedCoords);

      // Step 3: perform the perspective transformation
      //
      lines.forEach(function(line){
        vec3.forEach(line, 0, 0, 0, function(out, a) {

          // Step 2a: divide each x & y coordinate by the z coordinate
          //          * this is the magic step! *
          //
          out[0] = a[0] / a[2];
          out[1] = a[1] / a[2];

          // Step 2b: adjust the coordinates to fit the canvas size nicely
          //          * not directly related to perspective - don't worry about
          //            this bit too much *
          //
          out[0] = out[0] * canvas.height/2 + canvas.width/2;
          out[1] = -out[1] * canvas.height/2 + canvas.height/2;
        });
      });

      // Step 4: draw the transformed lines on the canvas
      //

      g.beginPath();

      lines.forEach(function(line){
        g.moveTo(line[0], line[1]);

        for (let i = 3; i < line.length; i += 3) {
          g.lineTo(line[i], line[i+1]);
        }
      });

      g.stroke();

    },

    /**
     * Draws multiple polylines.
     * "lines" is an array of lines:
     *   lines = [ [0,0,1 0,1,1], [0,0,1 1,0,1] ];
     */
    DrawPolyLines: function(lines) {
      lines.forEach(this.DrawPolyLine.bind(this));
    },

    DrawRect: function(r) {
      const minX = r.xywh[0];
      const maxX = r.xywh[0] + r.xywh[2];
      const minY = 0;
      const maxY = 2;
      const minZ = r.xywh[1];
      const maxZ = r.xywh[1] + r.xywh[3];

      const cube = [
        /* front face */
        [minX,minY,minZ, minX,maxY,minZ, maxX,maxY,minZ, maxX,minY,minZ, minX,minY,minZ],
        /* back face */
        [minX,minY,maxZ, maxX,minY,maxZ, maxX,maxY,maxZ, minX,maxY,maxZ, minX,minY,maxZ],
        /* sides */
        [minX,minY,minZ, minX,minY,maxZ],
        [maxX,minY,minZ, maxX,minY,maxZ],
        [minX,maxY,minZ, minX,maxY,maxZ],
        [maxX,maxY,minZ, maxX,maxY,maxZ]
      ];

      this.DrawPolyLines(cube);
    }

  };

  return WireframeRasterizer;
});