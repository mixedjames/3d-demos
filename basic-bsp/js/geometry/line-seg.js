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

  function LineSeg(a, b) {
    this.a = [a[0], a[1]];
    this.b = [b[0], b[1]];
  }

  LineSeg.prototype = {
    Length: function() {
      var dx = this.b[0] - this.a[0];
      var dy = this.b[0] - this.b[0];
      return Math.sqrt(dx*dx + dy*dy);
    },

    Midpoint: function() {
      return LineSeg.Midpoint(this.a, this.b);
    }
  };

  LineSeg.Midpoint = function(a, b) {
    return [
      a[0] + (b[0] - a[0])/2,
      a[1] + (b[1] - a[1])/2
    ];
  };

  return LineSeg;
});