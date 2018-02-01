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
  'geometry/line'
], function(Line){

  function Tree() {
    this.root_ = {
      parent: null,
      leaf: true
    };
  }

  Tree.prototype = {

    Reset: function() {
      this.root_ = {
        parent: null,
        leaf: true
      };
    },

    Empty: function() {
      return this.root_.leaf;
    },

    Root: function() {
      return this.root_;
    },

    AddLineFromSegment: function(lineSeg) {

      if (!this.root_.leaf) {
        AddSegment(this.root_, lineSeg);
      }
      else {

        this.root_ = {
          splitter: Line.FromSegment(lineSeg),
          leaf: false,
          parent: null
        };

        this.root_.front = { parent: this.root_, leaf: true };
        this.root_.back = { parent: this.root_, leaf: true };

      }

      function AddSegment(node, segment) {
        if (node.leaf) {
          const newNode = {
            parent: node.parent,
            leaf: false,
            splitter: Line.FromSegment(segment)
          };
          newNode.front = { parent: newNode, leaf: true };
          newNode.back = { parent: newNode, leaf: true };

          if (node.parent.front == node) {
            node.parent.front = newNode;
          }
          else {
            node.parent.back = newNode;
          }
        }
        else {

          if (node.splitter.Evaluate(segment.a) > 0) {
            AddSegment(node.front, segment);
          }
          else {
            AddSegment(node.back, segment);
          }

        }
      }
    },

    AddGeometry: function(rects) {
      const self = this;

      if (this.Empty()) {
        return;
      }

      rects.forEach(AddRect.bind(null, self.root_));

      function AddRect(node, r) {
        if (node.leaf) {

          if (node.geometry) {
            // Error: leaf contains more than one rect
            console.log("Leaf contains more than one rect");
          }
          else {
            node.geometry = r;
          }

        }
        else {

          let inFront = 0;
          let behind = 0;
          let onLine = 0;

          function ClassifyPointByLine(l, x, y) {
            const e = l.Evaluate([x,y]);
            const error = 0.001;

            if (e > 0 + error) { inFront ++; }
            else if (e < 0 - error) { behind ++; }
            else { onLine ++; }
          }

          ClassifyPointByLine(node.splitter, r.xywh[0], r.xywh[1]);
          ClassifyPointByLine(node.splitter, r.xywh[0] + r.xywh[2], r.xywh[1]);
          ClassifyPointByLine(node.splitter, r.xywh[0] + r.xywh[2], r.xywh[1] + r.xywh[3]);
          ClassifyPointByLine(node.splitter, r.xywh[0], r.xywh[1] + r.xywh[3]);

          if (inFront == 0) {
            AddRect(node.back, r);
          }
          else if (behind == 0) {
            AddRect(node.front, r);
          }
          else {
            // Error: split
            console.log("Split detected");
          }
        }
      }
    }

  };

  return Tree;
});