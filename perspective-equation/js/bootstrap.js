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

/**
 * DO NOT WORRY TOO MUCH ABOUT THIS FILE - IT'S JUST A LOAD OF BOILERPLATE CODE
 *
 * All it does is:
 *   - Set up RequireJS with all the right libraries
 *   - Loads main.js once we're done
 */

requirejs.config({
  baseUrl: 'js',

  paths: {
    'gl-matrix': '../lib/gl-matrix/gl-matrix'
  },
  packages: []
});

requirejs([
],
function() {

  require(['main']);

});