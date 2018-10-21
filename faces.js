function nose(x, y, h, uw, lw, lb) {

  var l = h;
  var sh = y;

  var x0 = x-uw/2.0;
  var y0 = sh;

  var x1 = W/2.0+uw/2.0;
  var y1 = sh;

  var x2 = W/2.0-lw/2.0;
  var y2 = sh+l;

  var x3 = W/2.0+lw/2.0;
  var y3 = sh+l;

  /*
    (x0, y0)  (x1, y1)
      |           |
      |           |
    (x2, y2)--(x3, y3)
  */

  return [
    bezier([
      [x2, y2],
      [W/2.0, sh+l+lb],
      [x3, y3]
    ], 10),
    bezier([
      [x2, y2],
      [x0, y0]
    ], 10),
    bezier([
      [x3, y3],
      [x1, y1]
    ], 10)
  ]
}

function mouth(x, y, w, r) {
  return bezier([
    [x-w/2.0, y],
    [x, y+r],
    [x+w/2.0, y]
  ], 10);
}

function eb(x, y, r) {
  var es = [];
  for(var i=0;i<r;i++) {
    es = es.concat(circle(x, y, i, 60));
  }
  return [es];
}

function cs(x, y, r, rx, ry, cp) {
  return bezier(circle(
    x, y, r,
    cp, 0, 0,
    0, rx, ry,
    Math.PI
  ), 100);
}

function faces() {

  g = {
    randomize: 1,
    construct: 0,
  }

  gui.add(g, 'randomize', 0, 1, 1);
  gui.add(g, 'construct', 0, 1, 1);


  ms = {
    x: W/2,
    y: 184,
    w: 38,
    r: 0
  }
  var msf = gui.addFolder("Mouth");

  msf.add(ms, 'y', 0, H).onChange(draw);
  msf.add(ms, 'r', -100, 100).onChange(draw);
  msf.add(ms, 'w', 0, 100).onChange(draw);
  msf.open();

  ns = {
    y: 128,
    h: 40,
    uw: 20,
    lw: 30,
    lb: 20,
  }

  var nsf = gui.addFolder("Nose");
  nsf.add(ns, 'y', 0, H).onChange(draw);
  nsf.add(ns, 'h', 0, H).onChange(draw);
  nsf.add(ns, 'uw', 0, H).onChange(draw);
  nsf.add(ns, 'lb', 0, H).onChange(draw);
  nsf.add(ns, 'lw', 0, H).onChange(draw);
  nsf.open();

  ec = {
    y: 110,
    l: 40,
    r: 10,
    a0: 0.5
  }

  var ecf = gui.addFolder("Eyes");
  ecf.add(ec, 'y', 0, H).onChange(draw);
  ecf.add(ec, 'l', 0, H).onChange(draw);
  ecf.add(ec, 'r', 0, H).onChange(draw);
  ecf.add(ec, 'a0', 0, 1).onChange(draw);
  ecf.open();

  function eyes(y, l, r) {
    var eb1 = eb(W/2-l/2, y, r*ec.a0);
    var eb2 = eb(W/2+l/2, y, r*ec.a0);

    return eb1.concat(eb2).concat([
      circle(W/2-l/2, y, r, 60),
      circle(W/2+l/2, y, r, 60),
    ]);
  }

  fs = {
    y: H/2,
    r: H/2,
    rx: 0,
    ry: 0,
    cp: 8,
  }

  var ff = gui.addFolder("Face");
  ff.add(fs, 'y', 0, H).onChange(draw);
  ff.add(fs, 'r', 0, H).onChange(draw);
  ff.add(fs, 'rx', -20, 20).onChange(draw);
  ff.add(fs, 'ry', -20, 20).onChange(draw);
  ff.add(fs, 'cp', -20, 20, 1).onChange(draw);
  ff.open();

  hairc = {
    y: fs.y,
    yb: 40,
    y2: fs.y-60,
    y2b: 0,
    y3: fs.y-30,
    y3b: 30,
    tw2: 0.1,
    tw1: 1,
    p: 20,
    bl2b: 20,
    topw: 1.1,
    top: 1,
  };

  var hf = gui.addFolder("Hair")
  hf.add(hairc, 'y', 0, H).onChange(draw);
  hf.add(hairc, 'yb', 0, H).onChange(draw);
  hf.add(hairc, 'y2', 0, H).onChange(draw);
  hf.add(hairc, 'y2b', -10, 30).onChange(draw);
  hf.add(hairc, 'y3', 0, H).onChange(draw);
  hf.add(hairc, 'tw2', 0, 1).onChange(draw);
  hf.add(hairc, 'tw1', 0.2, 2).onChange(draw);
  hf.add(hairc, 'p', 0, 30, 1).onChange(draw);
  hf.add(hairc, 'bl2b', -100, 100, 1).onChange(draw);
  hf.add(hairc, 'topw', 0, 1).onChange(draw);
  hf.add(hairc, 'top', 0, 1, 1).onChange(draw);
  hf.open();

  function hair() {
    var hairline = bezier([
      [W/2 - fs.r*hairc.tw1, hairc.y],
      [W/2, hairc.y-hairc.yb],
      [W/2 + fs.r*hairc.tw1, hairc.y]
    ], hairc.p);

    var hairline2 = bezier([
      [W/2 - fs.r*hairc.tw2, hairc.y2],
      [W/2, hairc.y2-hairc.y2b],
      [W/2 + fs.r*hairc.tw2, hairc.y2]
    ], hairc.p);

    var bendline = bezier([
      [W/2 - fs.r*1.2, hairc.y3],
      [W/2,  hairc.y3-hairc.y3b],
      [W/2 + fs.r*1.2,  hairc.y3]
    ], hairc.p);

    var bendline2 = bezier([
      [W/2 - fs.r*hairc.topw, hairc.y2+hairc.bl2b],
      [W/2,  hairc.y2+hairc.bl2b],
      [W/2 + fs.r*hairc.topw,  hairc.y2+hairc.bl2b]
    ], hairc.p);

    var hs = [];
    _.each(hairline, function(p, i) {
      hs.push(bezier([
        p, bendline[i], hairline2[i]
      ], 10))
    });

    if(hairc.top) {
      _.each(bendline2, function(p, i) {
        hs.push(bezier([
          [W/2, hairc.y2], p, [W/2, 5]
        ], 10))
      });
    }

    //return [hairline2]
    return hs;
  }

  function r(a, b) {
    return a + Math.random()*(b-a);
  }

  return function(i, max) {

    if(g.construct) {
      function cons(a, b) {
        return a+(b-a)/max*i;
      }

      ns.h = cons(-300, 10);
      ns.y = cons(0, 120);
      ns.uw = cons(0, 20);
      ns.lw = cons(0, 35);

      ec.l = cons(0, 130);
      ec.r = cons(50, 10);

      fs.r = cons(0, 130);
    }

    if(g.randomize) {
      ns.h = r(13, 30);
      ns.uw = r(0, 30);
      ns.lw = r(13, 50);
      ns.lb = r(-6, 15);
      ns.y = r(120, 145)

      ec.y = r(104, 130);
      ec.r = r(3, 20);
      ec.l = r(80, 126);
      ec.a0 = r(0.1, 0.7);

      fs.r = r(70, 80);
      fs.cp = parseInt(r(4, 60));
      fs.ry = r(20, 40);
      fs.rx = r(0, 2);

      ms.r = r(-15, 15);
      ms.w = r(20, 70);
      ms.y = r(176, 183);

      hairc.tw1 = r(1, 1.1);
      hairc.yb = r(5, 50);
      hairc.y2 = r(30, 60);
      hairc.y3 = r(60, 95);
      hairc.y3b = r(10, hairc.y2);
      hairc.y2b = r(0, 10);
      hairc.tw2 = r(0.1, 0.64);
      hairc.bl2b = r(-13, 13);
      hairc.p = parseInt(r(4, 20));
      hairc.topw = r(0.3, 1.2);
      hairc.top = Math.random() > 0.5 ? 0 : 1;
    }

    var n = nose(W/2, ns.y, ns.h, ns.uw, ns.lw, ns.lb);
    var m = mouth(ms.x, ms.y, ms.w, ms.r);
    var es = eyes(ec.y, ec.l, ec.r);
    var c = bezier(circle(
      W/2, fs.y, fs.r,
      fs.cp, 0, 0,
      0, fs.rx, fs.ry,
      Math.PI
    ), 100);
    var h = hair()

    return [m, c]
      .concat(n)
      .concat(es)
      .concat(h);
  }
}
register("Faces", faces);
