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

  return function NullSort(map, camera, Callback) {

    const bsp = map.BSP();

    if (bsp.Empty()) {
      return;
    }

    ProcessNode(bsp.Root(), [-camera.xyz[0], -camera.xyz[2]]);

    function ProcessNode(node, xy) {
      if (node.leaf && node.geometry) {
        Callback(node.geometry);
      }

      if (!node.leaf) {
        const e = node.splitter.Evaluate(xy);

        if (e > 0) {
          ProcessNode(node.back, xy);
          ProcessNode(node.front, xy);
        }
        else {
          ProcessNode(node.front, xy);
          ProcessNode(node.back, xy);
        }
      }
      
    }

  };

});