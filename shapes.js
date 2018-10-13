function _bezier(pts) {
  // https://gist.github.com/atomizer/1049745
	return function (t) {
		for (var a = pts; a.length > 1; a = b)  // do..while loop in disguise
			for (var i = 0, b = [], j; i < a.length - 1; i++)  // cycle over control points
				for (b[i] = [], j = 0; j < a[i].length; j++)  // cycle over dimensions
					b[i][j] = a[i][j] * (1 - t) + a[i+1][j] * t;  // interpolation
		return a[0];
	}
}

function bezier(ps, p) {
  var bps = [];
  var b = _bezier(ps);
  for (var t = 0; t <= p; t++) bps.push(b(t/p));

  return bps
}

function circle(x, y, r, p) {
  var ps = [];
  for(var i=0; i<=p; i++) {
    ps.push([
      x+r*Math.cos(Math.PI*2/p*i+d.a0),
      y+r*Math.sin(Math.PI*2/p*i)
    ])
  }

  return ps;
}

function line(x1, y1, x2, y2) {
  return [[x1, y1], [x2, y2]];
}
