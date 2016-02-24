var state = {
  canvas: null,
  clicked : false,
  initialized : false,
  nodes : [],
  edges : [],
  currentNode : -1
};

function init() {
  console.log('initializing canvas');
  if(this.state.initialized) return;

  var canvas = document.getElementById("untangle");
  canvas.addEventListener("mousedown", clicked, false);
  canvas.addEventListener("mousemove", moving, false);
  canvas.addEventListener("mouseup", unclicked, false);

  this.state.canvas = canvas;
  this.state.initialized = true;
  console.log('canvas initializeds');
}

var getContext = function() {

  var ctx = null;
  if(this.state.canvas.getContext) {
    ctx = this.state.canvas.getContext("2d");
  }

  return ctx;
};

var clicked = function(event) {
  //console.log('> onmousedown');
  //state.clicked = true;

  var container = document.getElementById('canvas');

  var x = event.pageX - container.offsetLeft;
  var y = event.pageY - container.offsetTop;

  if(check(x, y)) {
    state.clicked = true;
  }
};

var moving = function(event) {
  if(!state.clicked) return;

  //console.log('> onmouseover');
  var container = document.getElementById('canvas');

  var x = event.pageX - container.offsetLeft;
  var y = event.pageY - container.offsetTop;

  update(getContext(), x,y);
};

var unclicked = function(event) {
  console.log('> onmouseup');
  state.clicked = false;
  state.currentNode = -1;
};

var update = function(ctx, x, y) {
  ctx.clearRect(0,0,500,500);
  ctx.save();
  // draw old shapes
  for(var i = 0; i < state.nodes.length; i++) {
    if(i === state.currentNode) {
      continue;
    }
    var node = state.nodes[i];
    this.node(getContext(), node.x, node.y, 8, node.color);
  }

  // add new node
  var oldNode = state.nodes.splice(state.currentNode, 1);
  //console.log(oldNode);
  drawNode(x, y, oldNode[0].color);
  state.currentNode = state.nodes.length-1;
  //console.log('> redrawing', state.nodes.length, state.currentNode);

  connectNodes(ctx);

  ctx.restore();
};

var update2 = function(ctx, x, y) {
  var node = state.nodes.splice(state.currentNode, 1)[0];
  console.log('> clear', node, node.left, node.top, 16, 16);
  ctx.clearRect(node.left, node.top, 16, 16);
  //ctx.clearRect(0,0,500,500);
  ctx.save();

  // add new node
  drawNode(x, y, node.color);
  state.currentNode = state.nodes.length-1;

  //connectNodes(ctx);

  ctx.restore();
};

var drawNode = function (x, y, color) {
    //color = "#00AAD2";
    if(x === undefined) {
      x = Math.floor(Math.random() * 500);
    }
    if(y === undefined) {
      y = Math.floor(Math.random() * 500);
    }
    if(color === undefined) {
      color = '#'+Math.floor(Math.random()*16777215).toString(16);
    }

    this.node(getContext(), x, y, 8, color);
    var node = new Node(x, y, 8, color);
    this.state.nodes.push(node);

    var info = document.getElementById('nodes');
    while (info.hasChildNodes()) {
      info.removeChild(info.firstChild);
    }
    for(var i=0; i<state.nodes.length; i++) {
      var node = state.nodes[i];
      var p = document.createElement('p');
      p.innerHTML = node.x + ', ' + node.y;
      info.appendChild(p);
    }/**/
};

var node = function(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
};

var Node = function(x, y, radius, color) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.left = x - radius;
  this.top = y - radius;
  this.right = x + radius;
  this.bottom = y + radius;
};

var drawLine = function(x1, y1, x2, y2, color) {
  console.log('> drawLine', x1, y1, x2, y2);
  if(x1 === undefined) {
    x1 = Math.random() * 500;
  }
  if(y1 === undefined) {
    y1 = Math.random() * 500;
  }
  if(x2 === undefined) {
    x2 = Math.random() * 500;
  }
  if(y2 === undefined) {
    y2 = Math.random() * 500;
  }
  if(color === undefined) {
    color = '#'+Math.floor(Math.random()*16777215).toString(16);
  }

  this.line(getContext(), x1, y1, x2, y2, color);
  var line = new Line(x1, y1, x2, y2, color);
  this.state.edges.push(line);

  var info = document.getElementById('edges');
  while (info.hasChildNodes()) {
    info.removeChild(info.firstChild);
  }
  for(var i=0; i<state.edges.length; i++) {
    var line = state.edges[i];
    var p = document.createElement('p');
    p.innerHTML = line.x1 + ', ' + line.y1 + ', ' + line.x2 + ', ' + line.y2;
    info.appendChild(p);
  }/**/
};

var line = function(ctx, x1, y1, x2, y2, color) {
  //ctx.fillStyle = color;
  //ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  //ctx.closePath();
};

var Line = function(x1, y1, x2, y2, color) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.color = color;
};

var check = function(clickedX, clickedY) {
  for (var i = 0; i < state.nodes.length; i++) {
    if (clickedX < state.nodes[i].right && clickedX > state.nodes[i].left
      && clickedY > state.nodes[i].top && clickedY < state.nodes[i].bottom) {
      state.currentNode = i;
      return true;
    }
  }
};

var connectNodes = function(ctx) {
  if(ctx === undefined) {
    ctx = getContext();
  }
  ctx.beginPath();
  for(var i=0; i<this.state.nodes.length; i++) {
    var node1 = this.state.nodes[i];
    var node2 = this.state.nodes[i+1];
    if(node1 !== undefined && node2 !== undefined) {
      console.log('> connectNodes', node1.x, node1.y, node2.x, node2.y);
      drawLine(node1.x, node1.y, node2.x, node2.y);
    }
  }
  ctx.stroke();
  ctx.closePath();
};
