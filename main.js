function draw_points(ps) {
  ctx.beginPath();

  ctx.moveTo(ps[0][0]*cs.scale, ps[0][1]*cs.scale);

  for(var i=0; i<ps.length; i++) {
    ctx.lineTo(ps[i][0]*cs.scale, ps[i][1]*cs.scale);
  }

  ctx.stroke();
}

function pil(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x <= (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}

function intersection(l1, l2) {
    x1 = l1[0][0];
    y1 = l1[0][1];

    x2 = l1[1][0];
    y2 = l1[1][1];

    x3 = l2[0][0];
    y3 = l2[0][1];

    x4 = l2[1][0];
    y4 = l2[1][1];

    // line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
    // Check if none of the lines are of length 0
  	if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
  		return false;
  	}

  	denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    // Lines are parallel
  	if (denominator === 0) {
  		return false;
  	}
  	let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  	let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;
    // is the intersection along the segments
  	if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
  		return false;
  	}
    // Return a object with the x and y coordinates of the intersection
  	let x = x1 + ua * (x2 - x1);
  	let y = y1 + ua * (y2 - y1);

  	return [x, y];
}

function intersections(l, s) {
  is = [];
  for(var i=0; i<s.length-1; i++) {
    var ins = intersection(l, [s[i], s[i+1]]);
    if(ins) is.push(ins);
  }

  return is;
}

function cut_line(l, shape) {
  var nl = [];
  var cps = intersections(l, shape);
  cps.unshift(l[0]);
  cps.push(l[1]);

  //cps = _.sortBy(cps, function(l) { return l[0] });

  for(var i=0; i<cps.length-1; i++) {
    var tp = [
      .5*(cps[i][0]+cps[i+1][0]),
      .5*(cps[i][1]+cps[i+1][1])
    ];

    mark(tp[0], tp[1]);
    mark(cps[i][0], cps[i][1]);

    if(pil(tp, shape)) {
      nl.push(cps[i]); nl.push(cps[i+1]);
      //nl.push(tp);
    }
  }
  //nl = _.uniq(nl);
  return nl;
}

function cut_path(path, shape) {
  var np = [];
  for(var i=0; i<path.length-1; i++) {
    var nl = cut_line([path[i], path[i+1]], shape);
    if(nl.length>0) np.push.apply(np, nl);
  }
  return _.uniq(np);
}

function cut_texture(text, shape) {
  var nt = [];
  for(var i=0; i<text.length; i++) {
    var c = cut_path(text[i], shape);
    if(c.length>0) nt.push(c);
  }
  return nt;
}

function mark(x, y) {
  draw_points(circle(x, y, 2, 6));
}

function line_texture() {
  var text = [];
  for(var i=0; i<218; i=i+lt.padding) {
    text.push(line(0, i, 300, i+lt.slope));
  }
  return text;
}

function drawm(pss) {
  for(var i=0; i<pss.length; i++) {
    draw_points(pss[i]);
  }
}

function circle_texture() {
  var text = [];
  for(var y=0; y<=218+d.padding; y=y+d.padding) {
    for(var x=0; x<=300+d.padding; x=x+d.padding) {
      text.push(circle(x, y, d.radius, 10));
    }
  }
  return text;
}

function draw() {
  canvas.width = 300*cs.scale;
  canvas.height = 218*cs.scale;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var c = circle(80, 140, 70, 100);
  var c2 = circle(220, 70, 40, 5);
  //draw_points(l);
  //draw_points(c);

  //var cl = cut_line(l, c);
  var ct = circle_texture();
  //var lt = cut_texture(line_texture(), c2);
  var ls = cut_texture(ct, c);
  drawm(ls);
  //drawm(lt);
  draw_points(c);
  //draw_points(c2);
  /*
  draw_points(cut_path(b, c));
  draw_points(c);
  */
}

var canvas = document.getElementById("c");
var ctx = canvas.getContext("2d");

var d = {
  padding: 86,
  radius: 21,
}

var lt = {
  padding: 10,
  slope: 0,
}

var cs = {
  scale: 4.4
};

var gui = new dat.GUI();

var sc = gui.add(cs, 'scale', 1, 5);
sc.onChange(draw);

var pc = gui.add(d, 'padding', 3, 100);
pc.onChange(draw);

var pc = gui.add(d, 'radius', 3, 100);
pc.onChange(draw);

var pc = gui.add(lt, 'slope', -50, 50);
pc.onChange(draw);

var pc = gui.add(lt, 'padding', 3, 50);
pc.onChange(draw);


draw();
