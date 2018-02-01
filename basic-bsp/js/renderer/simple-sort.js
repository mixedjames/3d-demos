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

    function DistanceBetween(r, camera) {
      const cx = r.xywh[0] + 0.5*r.xywh[2];
      const cy = r.xywh[1] + 0.5*r.xywh[3];

      const dx = cx - camera.xyz[0];
      const dy = cy - camera.xyz[2];

      return dx*dx + dy*dy;
    }

    map.Rects().sort(function(a, b) {

      const da = DistanceBetween(a, camera);
      const db = DistanceBetween(b, camera);

      if (da < db) { return 1; }
      else if (db > da) { return -1; }
      else { return 0; }

    }).forEach(Callback);
  };

});