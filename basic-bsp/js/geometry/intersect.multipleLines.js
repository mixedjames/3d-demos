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
  'geometry/intersect.lines'
], function(IntersectionOfLines) {

  return function IntersectionOfMultipleLines(lineToClip, clipperLines) {

    const intersections = clipperLines.map(function(clipper){
      return IntersectionOfLines(lineToClip, clipper);
    });

    const result = intersections.filter(function(intersection) {

      if (intersection) {
        return clipperLines.every(function(clipper) {
            return clipper ? clipper.Evaluate(intersection.point) <= 0.001 : false;
        });
      }
      else {
        return false;
      }

    });

    return (result.length > 1) ? result : null;
  };

});