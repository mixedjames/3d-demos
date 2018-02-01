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

  return function ClipPolygonToZ(vertices) {

    const clipped = [];

    let oldX = vertices[vertices.length - 3];
    let oldY = vertices[vertices.length - 2];
    let oldZ = vertices[vertices.length - 1];

    for (let i = 0; i < vertices.length; i += 3) {
      let x = vertices[i];
      let y = vertices[i+1];
      let z = vertices[i+2];

      if (z >= 1 && oldZ >= 1) {
        clipped.push(x, y, z);
      }
      else if (z >= 1 && oldZ < 1) {
        let f = (1 - oldZ) / (z - oldZ);

        clipped.push(
          oldX + f*(x - oldX),
          oldY + f*(y - oldY),
          1
        );
        clipped.push(x, y, z);
      }
      else if (z < 1 && oldZ >= 1) {
        let f = (1 - oldZ) / (z - oldZ);

        clipped.push(
          oldX + f*(x - oldX),
          oldY + f*(y - oldY),
          1
        );
      }
      else {
      }

      oldX = x;
      oldY = y;
      oldZ = z;
    }

    return clipped;
  };

});