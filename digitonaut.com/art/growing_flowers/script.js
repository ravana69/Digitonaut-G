var w = c.width = window.innerWidth,
		h = c.height = window.innerHeight,
		ctx = c.getContext( '2d' ),
		
		// no opts this time, I don't have much time!
		
		flowers = [],
		tick = 0;

ctx.fillStyle = '#111';
ctx.fillRect( 0, 0, w, h );

function anim(){
	
	window.requestAnimationFrame( anim );
	
	++tick;
	
	if( flowers.length < 50 && Math.random() < .3 )
		flowers.push( new Flower );
	
	ctx.fillStyle = 'rgba(0,0,0,.04)';
	ctx.fillRect( 0, 0, w, h );
	
	flowers.map( function( flower ){ flower.step(); } );
}
function Flower(){
	
	this.reset();
}
Flower.prototype.reset = function(){
	
	this.x = ( Math.random() * w ) |0;
	this.y = ( Math.random() * ( h - 50 ) ) |0;
	
	this.particles = [];
	
	this.growTime = 100 + 50 * Math.random();
	this.growTimeScalar = Math.PI * 2 + Math.PI * 4 * Math.random();
	this.time = 0;
	this.stemLight = 40 + 20 * Math.random();
	
	this.jitterTimeScalar = Math.PI + Math.PI * Math.random();
	this.baseJitter = 10 + 10 * Math.random();
	this.addedJitter = 5 + 5 * Math.random();
	
	this.particleChance = .5 + .1 * Math.random();
	
	this.petals = 4 + ( 4 * Math.random() ) |0;
	this.radiant = Math.PI * 2 / this.petals;
	this.spacing = ( .7 + .2 * Math.random() ) * this.radiant;
	this.rot = Math.random() * this.spacing;
	this.rotVel = .01 + .02 * Math.random();
	
	this.bloom = 0;
	this.bloomVel = .7 + 1 * Math.random();
	this.maxBloom = 30 + 20 * Math.random();
	
	this.state = 'growing';
}
Flower.prototype.step = function(){
	
	if( this.state === 'growing' ){
		
		++this.time;
		
		if( this.time < this.growTime ){
			
			var prop = this.time / this.growTime;
			
			ctx.fillStyle = 'hsl(0,0%,light%)'.replace( 'light', this.stemLight + 10 * Math.random() );
			
			ctx.fillRect(
			
				this.x + Math.sin( prop * this.growTimeScalar ) * ( this.baseJitter + this.addedJitter * Math.cos( prop * this.jitterTimeScalar ) ),
				h - ( this.y * prop ),
				6, 6
			);
			
			if( Math.random() < this.particleChance ){
				
				ctx.fillRect( this.x - 10 + 20 * Math.random(), h - ( this.y * prop ) - 10 + 20 * Math.random(), 2, 4 );
			}
		} else {
			
			var prop = this.time / this.growTime;
			
			this.y = h - this.y + 3;
			this.x += Math.sin( prop * this.growTimeScalar ) * ( this.baseJitter + this.addedJitter * Math.cos( prop * this.jitterTimeScalar ) ) + 3;
			this.state = 'blooming';
		}
	} else {
		
		this.rot += this.rotVel;
		this.bloom += this.bloomVel;
		
		for( var i = 0; i < this.petals; ++i ){
			
			ctx.fillStyle = 'hsl(hue,80%,50%)'.replace( 'hue', this.x / w * 360 + tick );
			
			var radiant = this.radiant * i + this.rot;
			
			ctx.beginPath();
			ctx.moveTo( this.x, this.y );
			ctx.lineTo( this.x + this.bloom * Math.cos( radiant ),
								 this.y + this.bloom * Math.sin( radiant ) );
			ctx.lineTo( this.x + this.bloom * Math.cos( radiant + this.spacing ),
								 this.y + this.bloom * Math.sin( radiant + this.spacing ) );
			
			ctx.fill();
		}
		
		if( this.bloom > this.maxBloom )
			this.reset();
	}
}

anim();