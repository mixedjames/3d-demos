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

  function Line(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
  }

  Line.prototype = {
    Evaluate: function(p) {
      return this.a*p[0] + this.b*p[1] + this.c;
    },

    IsSteep: function() {
      var a = this.a;
      var b = this.b;

      return (
        (a > 0 && b >= 0 && a > b)
        || (a < 0 && b <= 0 && a < b)
        || (a > 0 && b < 0 && a > -b)
        || (a < 0 && b > 0 && -a > b)
      );
    },

    IsShallow: function() {
      return !this.isSteep();
    },

    XGivenY: function(y) {
      // ax + by + c = 0
      // x = (-by - c)/a
      return (-this.b*y - this.c) / this.a;
    },

    YGivenX: function(x) {
      // ax + by + c = 0
      // y = (-ax - c)/b
      return (-this.a*x - this.c) / this.b;
    },

    Negate: function() {
      this.a = -this.a;
      this.b = -this.b;
      this.c = -this.c;
    }
  };

  Line.FromPoints = function(p, q) {
    var a = q[1] - p[1];
    var b = p[0] - q[0];
    var c = -a*p[0] - b*p[1];

    return new Line(a, b, c);
  };

  Line.FromSegment = function(s) {
    return Line.FromPoints(s.a, s.b);
  };

  return Line;
});