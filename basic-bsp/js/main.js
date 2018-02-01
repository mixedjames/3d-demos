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
  'map',
  'editor',
  'renderer/controller',
  'renderer/engine'
], function(Map, Editor, Controller, Engine){

  const map = new Map();
  const editor = new Editor(map, document.getElementById('editor'));
  const controller = new Controller(document.getElementById('editor'));
  const renderer = new Engine(map, document.getElementById('editor'), controller);

  document.getElementById('edit-map').addEventListener('click',function(){
    document.getElementById('map-editor-settings').style.display = 'block';
    document.getElementById('bsp-editor-settings').style.display = 'none';
    document.getElementById('render-settings').style.display = 'none';

    editor.Mode('edit-map');
    editor.SubMode('create-rects');

    renderer.Stop();
    editor.view.Render();
  });

  document.getElementById('edit-bsp').addEventListener('click',function(){
    document.getElementById('map-editor-settings').style.display = 'none';
    document.getElementById('bsp-editor-settings').style.display = 'block';
    document.getElementById('render-settings').style.display = 'none';

    editor.Mode('edit-bsp');

    renderer.Stop();
    editor.view.Render();
  });

  document.getElementById('render').addEventListener('click',function(){
    document.getElementById('map-editor-settings').style.display = 'none';
    document.getElementById('bsp-editor-settings').style.display = 'none';
    document.getElementById('render-settings').style.display = 'block';

    editor.Mode('off');
    renderer.Start();
  });

  document.getElementById('create-rects').addEventListener('click',function(){
    editor.SubMode('create-rects');
  });

  document.getElementById('delete-rects').addEventListener('click',function(){
    editor.SubMode('delete-rects');
  });

  document.getElementById('reset-bsp').addEventListener('click',function(){
    editor.map.BSP().Reset();
  });

  document.getElementById('build-bsp').addEventListener('click',function(){
    editor.map.CategoriseRects();
  });
});