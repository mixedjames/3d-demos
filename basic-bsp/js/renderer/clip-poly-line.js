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

define([],function(){

  return function ClipPolyLine(vertices) {
    const lines = [];
    let currentLineSeg = [];

    if (vertices[2] >= 1) {
      currentLineSeg.push(vertices[0], vertices[1], vertices[2]);
    }

    for (let i = 3; i < vertices.length; i += 3) {
      const oldX = vertices[i-3];
      const oldY = vertices[i-2];
      const oldZ = vertices[i-1];
      const x = vertices[i];
      const y = vertices[i+1];
      const z = vertices[i+2];

      if (z >= 1 && oldZ >= 1) {
        currentLineSeg.push(x,y,z);
      }
      else if (z >= 1 && oldZ < 1) {
        const f = (1-oldZ) / (z - oldZ);

        currentLineSeg.push(
          oldX + f*(x - oldX),
          oldY + f*(y - oldY),
          1
        );

        currentLineSeg.push(x,y,z);
      }
      else if (z < 1 && oldZ >= 1) {
        const f = (1-oldZ) / (z - oldZ);

        currentLineSeg.push(
          oldX + f*(x - oldX),
          oldY + f*(y - oldY),
          1
        );

        lines.push(currentLineSeg);
        currentLineSeg = [];
      }
      else {
        // Both clipped
      }
    }

    if (currentLineSeg.length > 0) {
      lines.push(currentLineSeg);
    }

    return lines;
  };

});