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
  'geometry/intersect',
  'geometry/intersect.lines'
],function(Intersect){

  function FindIntersections(lines) {
    var i, j;
    var intersection;
    var intersections = [];

    for (i = 0; i < lines.length; ++ i) {
      for (j = i + 1; j < lines.length; ++ j) {
        intersection = Intersect.Lines(lines[i], lines[j]);
        if (intersection && IsPointBehindAllLines(intersection.point, lines)) {
          intersections.push(intersection);
          lines[i].intersections.push(intersection);
          lines[j].intersections.push(intersection);
        }
      }
    }
    return intersections;
  }

  function IsPointBehindAllLines(point, lines) {
    var result = true;
    var err = 0.00001;

    lines.forEach(function(l){
      if (l.Evaluate(point) > err) {
        result = false;
      }
    });

    return result;
  }

  return function ConvexHullFromLines(lines) {

    lines.forEach(function(l){ l.intersections = []; });
    var intersections = FindIntersections(lines);

    intersections.forEach(function(i){
      function OtherIntersection(line, intersection) {
        if (line.intersections[0] == intersection) { return line.intersections[1]; }
        else { return line.intersections[0]; }
      }

      i.adjacentIntersections = [
        OtherIntersection(i.lines[0], i),
        OtherIntersection(i.lines[1], i)
      ];
    });

    if (intersections.length < 3) {
      return [];
    }

    var outline = [];
    var previousIntersection;
    var currentIntersection = intersections[0];

    do {
      outline.push(currentIntersection.point)

      if (currentIntersection.adjacentIntersections[0] == previousIntersection) {
        previousIntersection = currentIntersection;
        currentIntersection = currentIntersection.adjacentIntersections[1];
      }
      else {
        previousIntersection = currentIntersection;
        currentIntersection = currentIntersection.adjacentIntersections[0];
      }
    } while(currentIntersection != intersections[0]);

    return outline;
  };

});