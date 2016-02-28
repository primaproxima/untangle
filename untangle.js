var state = {
  canvas: null,
  clicked : false,
  initialized: false,
  nodes: [],
  edges: [],
  currentNode: -1,
  R: 8,
  color: "#00AAD2"
};

function init() {
  if(this.state.initialized) return;

  var canvas = document.getElementById("untangle");
  canvas.addEventListener("mousedown", clicked, false);
  canvas.addEventListener("mousemove", moving, false);
  canvas.addEventListener("mouseup", unclicked, false);

  this.state.canvas = canvas;
  this.state.initialized = true;

  for(var i=0; i<20; i++) {
    var x,y,color,position;
    var node = createNode(x, y, state.R, color, position);
  }
  connectNodes();
  //connectNodes();
  for(var i=0; i<20; i++) {
    drawNode(getContext(), state.nodes[i]);
  }
};

var getContext = function() {

  var ctx = null;
  if(this.state.canvas.getContext) {
    ctx = this.state.canvas.getContext("2d");
  }

  return ctx;
};

var clicked = function(event) {
  var container = document.getElementById('canvas');

  var x = event.pageX - container.offsetLeft;
  var y = event.pageY - container.offsetTop;

  if(check(x, y)) {
    state.clicked = true;
  }
};

var moving = function(event) {
  if(!state.clicked) return;

  var container = document.getElementById('canvas');

  var x = event.pageX - container.offsetLeft;
  var y = event.pageY - container.offsetTop;

  update(getContext(), x, y);
};

var unclicked = function(event) {
  state.clicked = false;
  state.currentNode = -1;

  checkUntangled();
};

var update = function(ctx, x, y) {
  ctx.clearRect(0,0,500,500);
  ctx.save();

  // draw old shapes
  drawEdges(ctx);

  for(var i = 0; i < state.nodes.length; i++) {
    if(i === state.currentNode) {
      state.nodes[i].x = x;
      state.nodes[i].y = y;
    }
    var node = state.nodes[i];
    drawNode(ctx, node);
  }

  ctx.restore();
};

var createNode = function(x, y, r, color, position) {
  if(x === undefined) {
    x = Math.floor(Math.random() * 500);
  }
  if(y === undefined) {
    y = Math.floor(Math.random() * 500);
  }
  if(r === undefined) {
    r = state.R;
  }
  if(color === undefined) {
    color = '#'+Math.floor(Math.random()*16777215).toString(16);
  }

  var node = new Node(x, y, r, color);
  if(position === undefined) {
    this.state.nodes.push(node);
  } else {
    this.state.nodes.splice(this.state.currentNode, 0, node);
  }

  return node;
};

var drawNode = function (ctx, node) {
    ctx.fillStyle = node.color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.r, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
};

var Node = function(x, y, r, color) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.color = color;
  this.left = function() { return this.x - this.r; }
  this.top = function() { return this.y - this.r; }
  this.right = function() { return this.x + this.r; }
  this.bottom = function() { return this.y + this.r; }
};

var drawLine = function(ctx, x1, y1, x2, y2, color) {
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

  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
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
    if (clickedX < state.nodes[i].right() && clickedX > state.nodes[i].left()
      && clickedY > state.nodes[i].top() && clickedY < state.nodes[i].bottom()) {
      state.currentNode = i;
      return true;
    }
  }
};

var connectNodes = function() {
  for(var i=0; i<this.state.nodes.length; i++) {
    var edge = [i, Math.floor(Math.random()*this.state.nodes.length)];
    if(edge[0] === edge[1]) {
      continue;
    }
    this.state.edges.push(edge);
  }

  drawEdges(getContext());
};

var drawEdges = function(ctx) {
  ctx.beginPath();
  for(var i=0; i<this.state.edges.length; i++) {
    var nodes = this.state.edges[i];
    var node1 = this.state.nodes[nodes[0]];
    var node2 = this.state.nodes[nodes[1]];
    if(node1 !== undefined && node2 !== undefined) {
      drawLine(ctx, node1.x, node1.y, node2.x, node2.y);
    }
  }
  ctx.stroke();
  ctx.closePath();
};
