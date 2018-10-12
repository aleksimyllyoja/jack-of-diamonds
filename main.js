function get_paths() {
  var ps = document.getElementsByTagName('path');
  var paths = [];

  for(var i=0; i<ps.length; i++) {
    paths.push(get_points(ps[i]));
  }

  return paths;
}

function get_points(path) {
  var l = path.getTotalLength();
  var p = 100;
  var s = l/p;

  var points = [];

  for(var i=0; i<=p; i++) {
    var point = path.getPointAtLength(s*i);
    points.push([point.x, point.y]);
  }

  return points;
}

function draw_points(ctx, ps) {
  ctx.beginPath();

  ctx.moveTo(ps[0][0]*cs.scale, ps[0][1]*cs.scale);
  for(var i=0; i<ps.length; i++) {
    ctx.lineTo(ps[i][0]*cs.scale, ps[i][1]*cs.scale);
  }
  ctx.stroke();
}

function draw_paths() {
  flatten(document.getElementsByTagName('svg')[0]);

  var c = document.getElementById("c");
  c.width = 300*cs.scale;
  c.height = 218*cs.scale;

  var ctx = c.getContext("2d");

  paths = get_paths();
  for(var i=0; i<paths.length; i++) {
    draw_points(ctx, paths[i]);
  }
}

// Make an instance of two and place it on the page.
var elem = document.getElementById('svg-c');
var params = { width: 300, height: 218 };
var two = new Two(params).appendTo(elem);

var rect = two.makeRectangle(213, 100, 100, 100);

for(var i=0; i<=10; i++) {
  var circle = two.makeCircle(72+i*10, 100, 50);
  circle.mask = rect;
}

// Don't forget to tell two to render everything
// to the screen
two.update();

var cs = {
  scale: 3
};

var gui = new dat.GUI();
var scale_controller = gui.add(cs, 'scale', 1, 5);
scale_controller.onChange(draw_paths);

draw_paths();
