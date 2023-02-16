"use strict";

window.addEventListener("load",function() {

  const ANIM_DURATION = 3000; // ms for average drawing
  const MAX_FRAME_DURATION = 20;
  const LSIDEMIN = 0.02;
  const LSIDEMAX = 0.05;
  const LWIDTH = 0.02;

  let rndSeed = 1;

  let canv, ctx;    // canvas and context
  let maxx, maxy;   // canvas dimensions
  let nbx, nby;
  let uiv;
  let grid;
  let rndStruct;
  let lRef;
  let cntStarters;
  let mouse;

// for animation
  let events;

// shortcuts for Math.
  const mrandom = Math.random;
  const mfloor = Math.floor;
  const mround = Math.round;
  const mceil = Math.ceil;
  const mabs = Math.abs;
  const mmin = Math.min;
  const mmax = Math.max;

  const mPI = Math.PI;
  const mPIS2 = Math.PI / 2;
  const mPIS3 = Math.PI / 3;
  const m2PI = Math.PI * 2;
  const m2PIS3 = Math.PI * 2 / 3;
  const msin = Math.sin;
  const mcos = Math.cos;
  const matan2 = Math.atan2;

  const mhypot = Math.hypot;
  const msqrt = Math.sqrt;

  const rac3   = msqrt(3);
  const rac3s2 = rac3 / 2;

//------------------------------------------------------------------------
//------------------------------------------------------------------------

/* based on a function found at https://www.grc.com/otg/uheprng.htm
and customized to my needs

use :
  x = Mash('1213'); // returns a resettable, reproductible pseudo-random number generator function
  x = Mash();  // like line above, but uses Math.random() for a seed
  x();         // returns pseudo-random number in range [0..1[;
  x.reset();   // re-initializes the sequence with the same seed. Even if Mash was invoked without seed, will generate the same sequence.
  x.seed;      // retrieves the internal seed actually used. May be useful if no seed or non-string seed provided to Mash
               be careful : this internal seed is a String, even if it may look like a number. Changing or omitting any single digit will produce a completely different sequence
  x.intAlea(min, max) returns integer in the range [min..max[ (or [0..min[ if max not provided)
  x.alea(min, max) returns float in the range [min..max[ (or [0..min[ if max not provided)
*/

/*	============================================================================
	This is based upon Johannes Baagoe's carefully designed and efficient hash
	function for use with JavaScript.  It has a proven "avalanche" effect such
	that every bit of the input affects every bit of the output 50% of the time,
	which is good.	See: http://baagoe.com/en/RandomMusings/hash/avalanche.xhtml
	============================================================================
*/
/* seed may be almost anything not evaluating to false */
function Mash(seed) {
	let n = 0xefc8249d;
  let intSeed = (seed || Math.random()).toString();

	function mash (data) {
		if (data) {
			data = data.toString();
			for (var i = 0; i < data.length; i++) {
				n += data.charCodeAt(i);
				var h = 0.02519603282416938 * n;
				n = h >>> 0;
				h -= n;
				h *= n;
				n = h >>> 0;
				h -= n;
				n += h * 0x100000000; // 2^32
			}
			return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
		} else n = 0xefc8249d;
	};
  mash (intSeed); // initial value based on seed

  let mmash = () => mash('A'); // could as well be 'B' or '!' or any non falsy value
  mmash.reset = () => {mash(); mash(intSeed)}
  Object.defineProperty(mmash, 'seed', {get: ()=> intSeed});
  mmash.intAlea = function (min, max) {
    if (typeof max == 'undefined') {
      max = min; min = 0;
    }
    return mfloor(min + (max - min) * this());
  }
  mmash.alea = function (min, max) {
// random number [min..max[ . If no max is provided, [0..min[

    if (typeof max == 'undefined') return min * this();
    return min + (max - min) * this();
  }
  return mmash;
} // Mash

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function hslString(hsl) {
  return `hsl(${hsl[0]},${hsl[1]}%,${hsl[2]}%)`;
} // hslString


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function arrayShuffle (array) {
/* randomly changes the order of items in an array
   only the order is modified, not the elements
*/
  let k1, temp;
  for (let k = array.length - 1; k >= 1; --k) {
    k1 = rndStruct.intAlea(0, k + 1);
    temp = array[k];
    array[k] = array[k1];
    array[k1] = temp;
    } // for k
  return array
  } // arrayShuffle
//------------------------------------------------------------------------

function FHue(minPerInv, maxPerInv, minDelta, maxDelta) {
/* returns a function to generate a sequence of values for a hue (0..360)
  The new hue is obtained from the previous one by adding or substracting a
  random value in the range [minDelta, maxDelta[ at each new call
  The number of consecutive additions or substactions is randomly picked in
  the range (minPerInv, maxPerInv)
*/

  this.minPerInv = minPerInv; // integer >= 0
  this.maxPerInv = maxPerInv; // integer >= minPerInv
  this.minDelta = minDelta;   // number >= 0
  this.maxDelta = maxDelta;   // number >= minDelta < 360

  this.random = Math.random;
  this.currentV = Math.floor(360 * this.random());
  this.currentSign = (this.random >= 0.5) ? 1 : -1;

  this.randomPer = () => {
    const alpha = this.random();
    return this.minPerInv + Math.floor(alpha * (this.maxPerInv - this.minPerInv ));
  }
  this.randomDelta = () => {
    const alpha = this.random();
    return this.minDelta + Math.floor(alpha * (this.maxDelta - this.minDelta ));
  }

  this.currentIncCnt = Math.floor(this.random() * this.randomPer()); // random running value for counter;

} // FHue

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

FHue.prototype.val = function() {
  if (--this.currentIncCnt <= 0) { // time to change sign ?
    this.currentSign *= -1;
    this.currentIncCnt = this.randomPer();
  }
  this.currentV += this.currentSign * this.randomDelta();
  if (this.currentV < 0) this.currentV += 360;
  else if (this.currentV >= 360) this.currentV -= 360;
  return this.currentV;
} // FHue

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

FHue.prototype.variation = function() {
/* returns a new function with an initial value equal to current one, but which
will not return the same values in the future */
  let clone = new FHue(this.minPerInv, this.maxPerInv, this.minDelta, this.maxDelta);
  clone.currentV = this.currentV;
  clone.currentSign = this.currentSign;
  clone.currentIncCnt = this.currentIncCnt;
  return clone;
}
//------------------------------------------------------------------------
function Square (kx, ky) {
  this.kx = kx;
  this.ky = ky;
  this.hPoints = new Array(8).fill(0).map((v,k) => new HalfPoint(this, k));
  this.arcs = []; // no arc between points yet

} // Square

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Square.prototype.calculateArc = function(arc) {

  if (! this.pos) this.calculatePoints();

  const kp0 = arc.p0.khp;
  const kp1 = arc.p1.khp;

  let khp0 = kp0, khp1 = kp1;
// is starting point is odd, take symmetric to start from even point
  if (kp0 & 1) {
    khp0 = [1,0,7,6,5,4,3,2][kp0];
    khp1 = [1,0,7,6,5,4,3,2][kp1];
  }
  khp1 = (khp1 - khp0 + 8) % 8; // relative index from khp0 to khp1;
  const coeffBeg = Square.coeffBeg [khp1] * uiv.lSide;
  const coeffEnd = Square.coeffEnd [khp1] * uiv.lSide;
  const side0 = mfloor(kp0 / 2);
  const side1 = mfloor(kp1 / 2);
  const p0 = this.pos[kp0];
  const p1 = this.pos[kp1];
  const pax = p0[0] + [-1,0,1,0][side0] * coeffBeg;
  const pay = p0[1] + [0,-1,0,1][side0] * coeffBeg;
  const pbx = p1[0] + [-1,0,1,0][side1] * coeffEnd;
  const pby = p1[1] + [0,-1,0,1][side1] * coeffEnd;

  arc.bez = [p0[0], p0[1], pax, pay, pbx, pby, p1[0], p1[1]];

} // Square.prototype.calculateArc

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Square.prototype.drawArc = function(arc) {

  if (! arc.bez) this.calculateArc(arc);
  let bez = arc.bez;
  ctx.moveTo (bez[0], bez[1]);
  ctx.bezierCurveTo (bez[2], bez[3], bez[4], bez[5], bez[6], bez[7]);
} // Square.prototype.drawArc

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Square.prototype.draw = function() {

  this.arcs.forEach(arc => {
    this.drawArc(arc);
  });

} // Square.prototype.draw

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Square.prototype.calculatePoints = function() {

  this.xc = maxx / 2 + uiv.lSide * (this.kx - (nbx - 1) / 2);
  this.yc = maxy / 2 + uiv.lSide * (this.ky - (nby - 1) / 2);
  this.pos = Square.positions.map(p => [this.xc + p[0] * uiv.lSide, this.yc + p[1] * uiv.lSide]);

} // Square.prototype.calculatePoints

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Square.k0 = 0.15;
Square.positions = [[0.5, -Square.k0], [0.5, Square.k0],
                    [Square.k0, 0.5], [-Square.k0, 0.5],
                    [-0.5, Square.k0], [-0.5, -Square.k0],
                    [-Square.k0, -0.5], [Square.k0, -0.5]];
  
Square.coeffBeg = [0, 0.2, 0.2, 0.3, 0.5, 0.2, 0.3, 0.2];
Square.coeffEnd = [0, 0.2, 0.3, 0.3, 0.5, 0.2, 0.3, 0.2];

//------------------------------------------------------------------------

function drawGrid() {
  let alpha;

  /* create table of hues for families */
  const hue0 = rndStruct.intAlea(360);

  /* draw now */
  ctx.beginPath();
  grid.forEach(line=>line.forEach(cell => cell.draw(family)));
  ctx.strokeStyle = hslString([hue0,100,50]);
  ctx.lineWidth = uiv.lineWidth;
  ctx.stroke();

} // drawGrid

//------------------------------------------------------------------------

function HalfPoint(parent, khp) {

  this.parent = parent;  // a Square

  this.khp = khp; // index of point in its parentFig's hPoints
  this.side = mfloor(khp / 2);
  this.state = 0; // 0 : undecided; 1: entry; 2: exit; 3: blocked

  // this.other will be added later for the other half of same point. Maybe
} // HalfPoint
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

HalfPoint.prototype.attach = function(other) {
/* sets other as the second half of this HalfPoint */
  if (this.other) {
    if (this.other != other) throw ('inconsistent attachment');
    return; // already connected
  }
  this.other = other; // connect both ways at the same time
  other.other = this;
} // HalfPoint.prototype.attach

//------------------------------------------------------------------------
function prepareGo () {

  /* create table of hues for families */
  const hue0 = rndStruct.intAlea(360);

  const starters = []; // list of possible starting points

  let currp;
  let k, kcurrp, ktarg, ptarg, targets, currCell;

/* chooses random starting point */
  if (! mouse) {
    currp = grid[rndStruct.intAlea(nby)][rndStruct.intAlea(nbx)].hPoints[rndStruct.intAlea(8)];
  } else {
    let kx = mround((mouse.x - maxx / 2) / uiv.lSide + (nbx - 1) / 2);
    let ky = mround((mouse.y - maxy / 2) / uiv.lSide + (nby - 1) / 2);
    kx = mmax(0, mmin(kx, nbx - 1)); // limit range of values
    ky = mmax(0, mmin(ky, nby - 1));
    currp = grid[ky][kx].hPoints[rndStruct.intAlea(8)];
  }
  currp.hue = new FHue(3,20,5,10);
  addStarter(starters, currp);
  if (currp.other) {
    currp.other.hue = currp.hue.variation();
    addStarter(starters, currp.other);
  }
  return starters;
}

//------------------------------------------------------------------------
function goon(st) {
/* chooses random points as starting points
  grows branches from theses points
*/

  const starters = st;

  let currp ;
  let k, kcurrp, ktarg, ptarg, targets, currCell;
  let arc;

  while (starters.length) {

    kcurrp = rndStruct.intAlea(starters.length);
    currp = starters[kcurrp]; // random point in list
    currCell = currp.parent;

    targets = [];
    for (k = 1; k < 8; ++k) { // test possible connection with other points in this square
      if ((currp.khp & 1) && (k == 3) ||
          !(currp.khp & 1) && (k == 5)) continue; // avoid straight lines
      ktarg = (currp.khp + k) % 8;
      if (currCell.hPoints[ktarg].state != 0) continue; // this other point not available
      // test if any other arc would intersect
      if (currCell.arcs.find(arc => {
          if ((arc.p0.khp - currp.khp) *
              (arc.p0.khp - ktarg) *
              (arc.p1.khp - currp.khp) *
              (arc.p1.khp - ktarg) < 0) return true; // intersects
 //       }
        return false; // does not intersect
      })) continue; // would intersect
      targets.push(ktarg); // would not intersect
    } // for k

    if (targets.length == 0) {
      currCell.state = 3; // blocked
      delete currp.hue;
      starters.splice(kcurrp, 1); // no longer a possible starting point
    } else {
      ktarg = targets[rndStruct.intAlea(targets.length)]; // random pick
      ptarg = currCell.hPoints[ktarg];
      ptarg.state = 2;     // mark as exit point
      arc = {p0: currp, p1:ptarg};
      currCell.arcs.push(arc);
      ctx.beginPath()
      currCell.drawArc(arc);
      ctx.strokeStyle = hslString([currp.hue.val(),100,50]);
      ctx.lineWidth = uiv.lineWidth;
      ctx.stroke();
      if (ptarg.other) {
        if (ptarg.other.state != 0) throw('ptarg.other.state != 0');
        ptarg.other.hue = currp.hue.variation();
        addStarter(starters, ptarg.other );
      }
      return true; // we've done something
    }

  } // while

  return false; // starters list is empty

} // goon
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function addStarter (starters, hp) {
    starters.push(hp);
    hp.state = 1; // this point becomes a starting point
    ++cntStarters;
  } // addStarter

//------------------------------------------------------------------------

function attachHalfPoints() {
  let kxn, kyn, khpn;
  grid.forEach ((line, ky) => {
    line.forEach ((sq, kx) => {
      sq.hPoints.forEach((hp, khp) => {
        kyn = ky + [0, 1, 0, -1][hp.side];
        if (kyn < 0 || kyn >= nby) return; // no neighbor
        kxn = kx + [1, 0, -1, 0][hp.side];
        if (kxn < 0 || kxn >= nbx) return; // no neighbor
        hp.attach(grid[kyn][kxn].hPoints[[5, 4, 7, 6, 1, 0, 3, 2][khp]]);
      }); // sq.hPoints.forEach
    }); // line.forEach
  }); // grid.forEach
} // attachHalfPoints

//------------------------------------------------------------------------
function readUI() {

  uiv = {};
  uiv.lSide = mmax(rndStruct.alea(LSIDEMIN, LSIDEMAX) * lRef, 20);
  uiv.lineWidth = mmax(uiv.lSide * rndStruct.alea(0.05, 0.15),0.5);
  let nbps = lRef / uiv.lSide; // approx nb of squares in length / width

  uiv.nbSrc = rndStruct.intAlea(1, mmax(1,mround(nbps * nbps / 100)));
  
} // readUI
//------------------------------------------------------------------------

let animate;

{ // scope for animate

let animState = 0;
let st;
let tStart;
let nbStartersTheor;
let speedFr;

animate = function(tStamp) {

  let event;
  let tinit, dur;

  event = events.pop();
  if (event && event.event == 'reset') animState = 0;
  if (event && event.event == 'click') animState = 0;
  window.requestAnimationFrame(animate)


  switch (animState) {

    case 0 :
      if (startOver()) {
        st = prepareGo();
        ++animState;
        tStart = performance.now();
        speedFr = nbx * nby * 3.9 / ANIM_DURATION; // nb of segments / millisec
      }
      break;

    case 1 :
      tinit = performance.now();
      do {
        if (!goon(st)) {
          ++animState;
          break;
        }
        if (cntStarters > (performance.now() - tStart) * speedFr) break ; // done enough for this time
        if ((performance.now() - tinit) > MAX_FRAME_DURATION) break;
      } while (true)
      break;

    case 2:
      ++animState;
      break;

  } // switch

} // animate
} // scope for animate

//------------------------------------------------------------------------
//------------------------------------------------------------------------

function startOver() {

// canvas dimensions

  maxx = window.innerWidth;
  maxy = window.innerHeight;
  lRef = msqrt(maxx * maxy);

  canv.width = maxx;
  canv.height = maxy;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  rndStruct = Mash(rndSeed);
  ++rndSeed;
  readUI();

  nbx = mfloor(maxx / uiv.lSide);
  nby = mfloor(maxy / uiv.lSide);

  ctx.fillStyle = '#000';
  ctx.fillRect(0,0,maxx,maxy);

  grid = new Array(nby).fill(0).map((v, ky) => new Array(nbx).fill(0).map((v, kx) => new Square(kx, ky)));
  attachHalfPoints();
  cntStarters = 0;
  return true;

} // startOver

//------------------------------------------------------------------------

function mouseClick (event) {

  events.push({event:'click', x: event.clientX, y: event.clientY});;
  if (! mouse) mouse = {};
  mouse.x = event.clientX;
  mouse.y = event.clientY;
} // mouseClick

//------------------------------------------------------------------------
//------------------------------------------------------------------------
// beginning of execution

  {
    canv = document.createElement('canvas');
    canv.style.position="absolute";
    document.body.appendChild(canv);
    ctx = canv.getContext('2d');
    canv.setAttribute ('title','click me');
  } // création CANVAS
  canv.addEventListener('click',mouseClick);
  events = [{event:'reset'}];
  requestAnimationFrame (animate);

}); // window load listener