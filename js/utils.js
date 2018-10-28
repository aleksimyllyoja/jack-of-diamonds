var W = 300;
var H = 218;
var gui, drawf;

var FS = { };
var Files = { };
var PATH = [];

function register(name, f) {
  FS[name] = f;
	Files[name] = name
}

function _bezier(pts) {
  // https://gist.github.com/atomizer/1049745
	return function (t) {
		for (var a = pts; a.length > 1; a = b)
			for (var i = 0, b = [], j; i < a.length - 1; i++)
				for (b[i] = [], j = 0; j < a[i].length; j++)
					b[i][j] = a[i][j] * (1 - t) + a[i+1][j] * t;
		return a[0];
	}
}

function bezier(ps, p) {
  var bps = [];
  var b = _bezier(ps);
  for (var t = 0; t <= p; t++) bps.push(b(t/p));

  return bps
}

function circle(x, y, r, p, phase, xphase, yphase, rx, ry, a1) {
  var phase = phase ? phase : 0;
  var xphase = xphase ? xphase : 0;
  var yphase = yphase ? yphase : 0;
  var rx = rx ? rx : 0;
	var ry = ry ? ry : 0;
	var a1 = a1 ? a1 : Math.PI*2;

  var ps = [];
  for(var i=0; i<=p; i++) {
    ps.push([
      x+(r+rx)*Math.cos(a1/p*i+xphase+phase),
      y+(r+ry)*Math.sin(a1/p*i+yphase+phase)
    ])
  }

  return ps;
}

function line(x1, y1, x2, y2) {
  return [[x1, y1], [x2, y2]];
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
    if(nl.length>1) {
      if(np.length>0 && _.last(_.last(np)) == nl[0]) {
        _.last(np).push.apply(_.last(np), nl);
      } else {
        np.push(nl);
      }
    }
  }
  return np;
}

function cut_texture(text, shape) {
  var nt = [];
  for(var i=0; i<text.length; i++) {
    var c = cut_path(text[i], shape);
    if(c.length>0) {
      nt.push.apply(nt, c);
    }
  }
  return nt;
}

function mark(x, y, c) {
  ctx.strokeStyle = c ? c : 'black';
  draw_points(circle(x*general.scale, y*general.scale, 2, 6));
  ctx.strokeStyle = 'black';
}

function line_texture(padding, slope) {
  var text = [];
  for(var i=0; i<H; i=i+padding) {
    text.push(line(0, i, W, i+slope));
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

function _repeat(f, x, y) {
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
  var ind=0
  _.each(_.range(x), function(i) {
  _.each(_.range(y), function(j) {
    ind++;
    rpss.push.apply(rpss, f(rs, ind, x*y, xstep*i+marginx, ystep*j+marginy))
  })});
  return rpss;
}

function repeat(pss, x, y) {
	return _repeat(function(s, ind, max, _x, _y) {
		return move(scale(pss, s), _x, _y)
	}, x, y);
}

function frepeat(x, y) {
	return _repeat(function(s, ind, max, _x, _y) {
		return move(scale(drawf(ind, max), s), _x, _y)
	}, x, y);
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
  for(var y=0; y<=H+padding; y=y+padding) {
    for(var x=0; x<=W+padding; x=x+padding) {
      text.push(circle(x, y, radius, p, phase, xphase, yphase));
    }
  }
  return text;
}

function draw() {
  canvas.width = W*general.scale;
  canvas.height = H*general.scale;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

	var pss = frepeat(general.frepeatx, general.frepeaty);
	pss = repeat(pss, general.repeatx, general.repeaty);
	PATH = pss;
  _.each(scale(pss, general.scale), draw_points);
}
