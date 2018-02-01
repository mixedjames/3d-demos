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

define([], function() {

  return function IntersectionOfLines(l1, l2) {
    var tolerance = 0.000001;
    var determinant = l1.a*l2.b - l2.a*l1.b;

    if (determinant < +tolerance && determinant > -tolerance) {
      return null;
    }
    else {
      var x = -(l1.c*l2.b - l1.b*l2.c) / determinant;
      var y = -(l1.a*l2.c - l1.c*l2.a) / determinant;

      return {
        point: [x, y],
        lines: [l1, l2]
      };
    }
  };

});