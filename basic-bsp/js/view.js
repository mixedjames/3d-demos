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
  'geometry/line',
  'geometry/line-seg',
  'geometry/intersect'
], function(Line, LineSeg, Intersect){

  function DrawGrid(self) {
    const g = self.editor_.canvas.getContext('2d');
    const center = self.center_;
    const pixelsPerUnit = self.pixelsPerUnit_;

    g.fillStyle = 'black';
    g.strokeStyle = 'black';

    g.beginPath();
    g.moveTo(
      g.canvas.width/2 - center[0]*pixelsPerUnit,
      0
    );
    g.lineTo(
      g.canvas.width/2 - center[0]*pixelsPerUnit,
      g.canvas.height
    );

    g.moveTo(
      0,
      g.canvas.height/2 + center[1]*pixelsPerUnit,
    );
    g.lineTo(
      g.canvas.width,
      g.canvas.height/2 + center[1]*pixelsPerUnit,
    );
    g.stroke();

    g.fillText(
      '(0,0)',
      g.canvas.width/2 - center[0]*pixelsPerUnit + 10,
      g.canvas.height/2 + center[1]*pixelsPerUnit - 10
    );
  }

  function DrawRect(self, rect, i) {
    const g = self.editor_.canvas.getContext('2d');
    const xy = self.ViewCoordsToUser(rect.xywh);
    const wh = [rect.xywh[2] * self.pixelsPerUnit_, rect.xywh[3] * self.pixelsPerUnit_];

    g.fillStyle = 'green';
    g.strokeStyle = 'green';

    g.beginPath();
    g.rect(xy[0], xy[1] - wh[1], wh[0], wh[1]);
    g.stroke();

    g.fillText("Rectangle " + (i+1), xy[0] + 7, xy[1] - 7);
  }

  function DrawCamera(self) {
    const g = self.editor_.canvas.getContext('2d');
    const xy = self.ViewCoordsToUser(self.editor_.map.Camera());

    g.fillStyle = 'blue';
    g.strokeStyle = 'blue';

    g.beginPath();
    g.arc(xy[0], xy[1], 0.33 * self.cameraSize * self.pixelsPerUnit_, 0, Math.PI*2);
    g.fill();

    g.beginPath();
    g.arc(xy[0], xy[1], self.cameraSize * self.pixelsPerUnit_, 0, Math.PI*2);
    g.stroke();

    g.fillText("Camera start", xy[0] - 27, xy[1] + 25);
  }

  function DrawBSP(self) {

    const g = self.editor_.canvas.getContext('2d');
    const currentBSPLine = self.editor_.map.CurrentBSPLine();

    if (currentBSPLine) {
      const a = self.ViewCoordsToUser(currentBSPLine.a);
      const b = self.ViewCoordsToUser(currentBSPLine.b);

      g.strokeStyle = 'purple';
      g.beginPath();
      g.moveTo(a[0], a[1]);
      g.lineTo(b[0], b[1]);
      g.stroke();
    }

    const xy = self.UserCoordsToView([5,5]);
    const wh = self.UserCoordsToView([g.canvas.width - 10, g.canvas.height - 10]);

    const viewport = [
      Line.FromSegment(new LineSeg([xy[0], xy[1]], [xy[0], wh[1]])),
      Line.FromSegment(new LineSeg([wh[0], xy[1]], [xy[0], xy[1]])),
      Line.FromSegment(new LineSeg([wh[0], wh[1]], [wh[0], xy[1]])),
      Line.FromSegment(new LineSeg([xy[0], wh[1]], [wh[0], wh[1]]))
    ];

    if (!self.editor_.map.BSP().Empty()) {
      RenderBSPNode(self.editor_.map.BSP().Root(), viewport);
    }

    function RenderBSPNode(node, clipStack) {
      if (!node.leaf) {
        const l = Intersect.MultipleLines(node.splitter, clipStack);

        if (l) {
          const a = self.ViewCoordsToUser(l[0].point);
          const b = self.ViewCoordsToUser(l[1].point);

          g.beginPath();
          g.moveTo(a[0], a[1]);
          g.lineTo(b[0], b[1]);
          g.stroke();

          const mx = (a[0]+b[0])/2;
          const my = (a[1]+b[1])/2;

          const length = Math.sqrt(node.splitter.a*node.splitter.a + node.splitter.b*node.splitter.b);
          const dx = node.splitter.a / length;
          const dy = node.splitter.b / length;

          g.beginPath();
          g.moveTo(mx, my);
          g.lineTo(mx + 10*dx, my - 10*dy);
          g.stroke();
        }

        clipStack.push(new Line(-node.splitter.a, -node.splitter.b, -node.splitter.c));
        RenderBSPNode(node.front, clipStack);
        clipStack.pop();

        clipStack.push(node.splitter);
        RenderBSPNode(node.back, clipStack);
        clipStack.pop();
      }
    }
  }

  function View(editor) {
    this.editor_ = editor;
    this.center_ = [1,1];
    this.pixelsPerUnit_ = 50;

    this.cameraSize = 0.15;
  }

  View.prototype = {


    Render: function() {
      const self = this;
      const g = this.editor_.canvas.getContext('2d');
      const center = this.center_;
      const pixelsPerUnit = this.pixelsPerUnit_;

      requestAnimationFrame(function(){
        g.clearRect(0, 0, g.canvas.width, g.canvas.height);

        DrawGrid(self);
        self.editor_.map.ForEachRect(DrawRect.bind(null, self));
        DrawCamera(self);
        DrawBSP(self);
      });
    },

    ViewCoordsToUser: function(coords) {
      const g = this.editor_.canvas.getContext('2d');
      const center = this.center_;
      const pixelsPerUnit = this.pixelsPerUnit_;

      return [
        (coords[0] - center[0])*pixelsPerUnit + g.canvas.width/2,
        (center[1] - coords[1])*pixelsPerUnit + g.canvas.height/2
      ];
    },

    UserCoordsToView: function(coords) {
      const g = this.editor_.canvas.getContext('2d');
      const center = this.center_;
      const pixelsPerUnit = this.pixelsPerUnit_;

      return [
        center[0] + (coords[0] - g.canvas.width/2) / pixelsPerUnit,
        center[1] - (coords[1] - g.canvas.height/2) / pixelsPerUnit,
      ];
    }

  };

  return View;
});