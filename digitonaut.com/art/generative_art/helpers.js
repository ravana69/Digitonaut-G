
function radians(deg) {return deg*Math.PI/180;};
function degrees(rad) {return rad*180/Math.PI;};
function rgb(r, g, b) { return 'rgb('+clamp(Math.round(r),0,255)+', '+clamp(Math.round(g),0,255)+', '+clamp(Math.round(b),0,255)+')';};
function rgba(r, g, b, a) { return 'rgba('+clamp(Math.round(r),0,255)+', '+clamp(Math.round(g),0,255)+', '+clamp(Math.round(b),0,255)+', '+clamp(a,0,1)+')';};
function hsl(h, s, l) { return 'hsl('+h+', '+clamp(s,0,100)+'%, '+clamp(l,0,100)+'%)';};
function hsla(h, s, l, a) { return 'hsla('+h+', '+clamp(s,0,100)+'%, '+clamp(l,0,100)+'%, '+clamp(a,0,1)+')';};

function randomInteger(min, max) {
	if(max===undefined) {
		max = min;
		min = 0;
	}
	return Math.floor(Math.random() * (max+1-min)) +min;
}
function random(min, max) {
	if(min===undefined) {
		min = 0;
		max = 1;
	} else if(max=== undefined) {
		max = min;
		min = 0;
	}
	return (Math.random() * (max-min)) + min;
};

function map(value, min1, max1, min2, max2, clampResult) {
	var returnvalue = ((value-min1) / (max1 - min1) * (max2-min2)) + min2;
	if(clampResult) return clamp(returnvalue, min2, max2);
	else return returnvalue;
};

function clamp(value, min, max) {
	if(max<min) {
		var temp = min;
		min = max;
		max = temp;

	}
	return Math.max(min, Math.min(value, max));
};

function dist(x1, y1, x2, y2) {
	x2-=x1; y2-=y1;
	return Math.sqrt((x2*x2) + (y2*y2));
}