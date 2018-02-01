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
  'geometry/convex-hull-from-lines'
], function(ConvexHullFromLines) {

  function IsClockwise(points) {
    return points.reduce(function(sumSoFar, p, i, points){
      if (i == 0) {
        return sumSoFar + (p[0] - points[points.length-1][0])*(p[1] + points[points.length-1][1]);
      }
      else {
        return sumSoFar + (p[0] - points[i-1][0])*(p[1] + points[i-1][1]);
      }
    }, 0) < 0;
  }

  function MakeClockwise(hull) {
    if (!IsClockwise(hull)) { hull.reverse(); }
    return hull;
  }

  return {

    IsClockwise: IsClockwise,
    MakeClockwise: MakeClockwise,
    FromLines: ConvexHullFromLines

  };

});