var canvas = document.getElementById("c");
var ctx = canvas.getContext("2d");

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

function distance(x1, y1, x2, y2) {
  return Math.sqrt((x1-x2)**2+(y1-y2)**2);
}

function cut_line(l, shape) {
  var nl = [];
  var cps = intersections(l, shape);
  cps.unshift(l[0]);
  cps.push(l[1]);

  cps = _.sortBy(cps, function(cp) { return distance(l[0][0], l[0][1], cp[0], cp[1]) });

  for(var i=0; i<cps.length-1; i++) {
    var tp = [
      .5*(cps[i][0]+cps[i+1][0]),
      .5*(cps[i][1]+cps[i+1][1])
    ];
    if(pil(tp, shape)) {
      nl.push(cps[i]); nl.push(cps[i+1]);
    }
  }
  return nl;
}

function cut_path(path, shape) {
  var np = [];
  for(var i=0; i<path.length-1; i++) {
    var nl = cut_line([path[i], path[i+1]], shape);
    if(nl.length>1) np.push(nl);
  }
  return np;
}

function cut_texture(text, shape) {
  var nt = [];
  for(var i=0; i<text.length; i++) {
    var c = cut_path(text[i], shape);
    if(c.length>0) nt.push.apply(nt, c);
  }
  return nt;
}

function mark(x, y, c) {
  ctx.strokeStyle = c ? c : 'black';
  draw_points(circle(x, y, 2, 6));
  ctx.strokeStyle = 'black';
}

function line_texture(padding, slope) {
  var text = [];
  for(var i=0; i<218; i=i+padding) {
    text.push(line(0, i, 300, i+slope));
  }
  return text;
}

function draw_points(ps) {
  ctx.beginPath();
  ctx.moveTo(ps[0][0], ps[0][1]);
  for(var i=0; i<ps.length; i++) {
    ctx.lineTo(ps[i][0], ps[i][1]);
  }
  ctx.stroke();
}

function scale(pss, s) {
  return _.map(pss, function(ps) {
    return _.map(ps, function(p) {
      return [p[0]*s, p[1]*s]
    })
  });
}

function move(pss, x, y) {
  return _.map(pss, function(ps) {
    return _.map(ps, function(p) {
      return [p[0]+x, p[1]+y]
    })
  });
}

function repeat(pss, x, y) {
  var mxy = Math.max(x, y);
  var minxy = Math.min(x, y);
  var rs = 1/mxy;

  var xsize = W/mxy*x;
  var ysize = H/mxy*y;

  var marginx = (W-xsize)/2;
  var marginy = (H-ysize)/2;

  var xstep = W/mxy;
  var ystep = H/mxy;

  var rpss = [];
  _.each(_.range(x), function(i) {
  _.each(_.range(y), function(j) {
    rpss.push.apply(rpss,
      move(
        scale(pss, rs),
        xstep*i+marginx,
        ystep*j+marginy,
      )
    );
  })});
  return rpss;
}

function drawm(pss) {
  var pss = repeat(pss, general.repeatx, general.repeaty);
  var pss = scale(pss, general.scale);

  _.each(pss, draw_points);
}

function circle_texture(
  padding,
  radius,
  p,
  phase,
  xphase,
  yphase
  ) {
  var text = [];
  for(var y=0; y<=218+padding; y=y+padding) {
    for(var x=0; x<=300+padding; x=x+padding) {
      text.push(circle(x, y, radius, p, phase, xphase, yphase));
    }
  }
  return text;
}

function draw() {
  canvas.width = W*general.scale;
  canvas.height = H*general.scale;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  var c1 = circle(
    80, 140,
    c1s.radius, c1s.precision,
    c1s.phase, c1s.xphase, c1s.yphase
  );
  var c2 = circle(220, 70,
    c2s.radius, c2s.precision,
    c2s.phase, c2s.xphase, c2s.yphase
  );

  var lt = cut_texture(line_texture(
    lts.padding, lts.slope
  ), c2);
  var ls = cut_texture(
    circle_texture(
      cts.padding,
      cts.radius,
      cts.precision,
      cts.phase,
      cts.xphase,
      cts.yphase,
    ),
    c1
  );

  drawm(ls.concat(lt).concat([c1]).concat([c2]));
}

var W = 300;
var H = 218;

var gui = new dat.GUI();

var general = {
  scale: 3.4,
  repeatx: 1,
  repeaty: 1,
  toggle_fullscreen: function(){
    if (screenfull.enabled) {
      screenfull.toggle();
    }
  }
};

var gf = gui.addFolder('General');
gf.add(general, 'toggle_fullscreen').onChange(draw);
gf.add(general, 'scale', 1, 5).onChange(draw);
gf.add(general, 'repeatx', 1, 20, 1).onChange(draw);
gf.add(general, 'repeaty', 1, 20, 1).onChange(draw);
gf.open();

var c1s = {
  radius: 71,
  precision: 70,
  xphase: 0,
  yphase: 0,
  phase: 0,
}

var c1sf = gui.addFolder("Circle 1");
c1sf.add(c1s, 'radius', 3, 100).onChange(draw);
c1sf.add(c1s, 'precision', 3, 100, 1).onChange(draw);
c1sf.add(c1s, 'phase', -7, 7).onChange(draw);
c1sf.add(c1s, 'xphase', -7, 7).onChange(draw);
c1sf.add(c1s, 'yphase', -7, 7).onChange(draw);
c1sf.open();


var c2s = {
  radius: 40,
  precision: 5,
  xphase: 0,
  yphase: 0,
  phase: 0,
}

var c2sf = gui.addFolder("Circle 2");
c2sf.add(c2s, 'radius', 3, 100).onChange(draw);
c2sf.add(c2s, 'precision', 3, 100, 1).onChange(draw);
c2sf.add(c2s, 'phase', -7, 7).onChange(draw);
c2sf.add(c2s, 'xphase', -7, 7).onChange(draw);
c2sf.add(c2s, 'yphase', -7, 7).onChange(draw);
c2sf.open();

var cts = {
  padding: 86,
  radius: 21,
  precision: 10,
  xphase: 0,
  yphase: 0,
  phase: 0,
}

var ctf = gui.addFolder("Circle texture");
ctf.add(cts, 'padding', 3, 100).onChange(draw);
ctf.add(cts, 'radius', 3, 100).onChange(draw);
ctf.add(cts, 'precision', 2, 100, 1).onChange(draw);
ctf.add(cts, 'phase', -7, 7).onChange(draw);
ctf.add(cts, 'xphase', -7, 7).onChange(draw);
ctf.add(cts, 'yphase', -7, 7).onChange(draw);
ctf.open();

var lts = {
  padding: 10,
  slope: 0,
}

var ltsf = gui.addFolder("Line texture");
ltsf.add(lts, 'padding', 0.2, 100).onChange(draw);
ltsf.add(lts, 'slope', 0, 200).onChange(draw);
ltsf.open();

draw();
