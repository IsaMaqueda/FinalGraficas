//source: https://github.com/PiusNyakoojo/PlayerControls
// Creates the Player Controls, recieves as parameters the camera, playre and the domElement
THREE.PlayerControls = function ( camera, player, domElement ) {

	//puts the parameters as variables of the constructor 
	this.camera = camera;
	this.player = player;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// API

	this.enabled = true;

	this.center = new THREE.Vector3( player.position.x, player.position.y, player.position.z );

	//the speed for the movement 
	this.moveSpeed = 0.2;
	this.turnSpeed = 0.1;

	//allows the player to zoom
	this.userZoom = !true;
	this.userZoomSpeed = 1.0;

	//allows  the player to rotate
	this.userRotate = true;
	this.userRotateSpeed = 1.5;

	//this makes it so the player can't rotate on it's own
	this.autoRotate = false;
	this.autoRotateSpeed = 0.1;
   	 this.YAutoRotation = false;
    
    	this.playerDistanceX = 1.6;
   	 this.playerDistanceZ = 1.6;

	this.minPolarAngle = 0;
	this.maxPolarAngle = Math.PI;

	this.minDistance = 0;
	this.maxDistance = Infinity;

	// internals

    var scope = this;
    
	//this allows the player to use the lasers 
    var canShoot = true;
    var shootTimeout = 100;

	//where the lasers are stored 
    var Lasers = []

	var EPS = 0.000001;
	var PIXELS_PER_ROUND = 1800;

	//the rotation Three.js Vectors
	var rotateStart = new THREE.Vector2();
	var rotateEnd = new THREE.Vector2();
	var rotateDelta = new THREE.Vector2();

	//The zoom Three.js Vectors 
	var zoomStart = new THREE.Vector2();
	var zoomEnd = new THREE.Vector2();
	var zoomDelta = new THREE.Vector2();

	var phiDelta = 0;
	var thetaDelta = 0;
	var scale = 1;

	//creates a vector in the player position 
	var lastPosition = new THREE.Vector3( player.position.x, player.position.y, player.position.z );
	//starts the player in a still position 
	var playerIsMoving = false;

	var keyState = {};
	var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2 };
	var state = STATE.NONE;

	// events

	var changeEvent = { type: 'change' };

	//rotates to the left, gets as a parameter the angle 
	this.rotateLeft = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		thetaDelta -= angle;

	};
	//rotates to the right, gets as a parameter the angle 
	this.rotateRight = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		thetaDelta += angle;

	};
	//rotates up , gets as a parameter the angle 
	this.rotateUp = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		phiDelta -= angle;

	};
	//rotates down, gets as a parameter the angle 
	this.rotateDown = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		phiDelta += angle;

	};

	//Zooms the camera in, gets as a parameter the scale 
	this.zoomIn = function ( zoomScale ) {

		if ( zoomScale === undefined ) {

			zoomScale = getZoomScale();

		}

		scale /= zoomScale;

	};
	//Zooms the camera out, gets as a parameter the scale 
	this.zoomOut = function ( zoomScale ) {

		if ( zoomScale === undefined ) {

			zoomScale = getZoomScale();

		}

		scale *= zoomScale;

	};

	//this initializes the camera position as the same as the player 
	this.init = function() {

		this.camera.position.x = this.player.position.x + 1;
		this.camera.position.y = this.player.position.y + 1;
		this.camera.position.z = this.player.position.x + 1;

		this.camera.lookAt( this.player.position );
		
	};

	this.update = function() { 

		//checks which key is pressed 
		this.checkKeyStates();

		//this puts the center as the player position 
		this.center = this.player.position;

		//puts the position as the camera position 
		var position = this.camera.position;
		var offset = position.clone().sub( this.center );

		// angle from z-axis around y-axis

		var theta = Math.atan2( offset.x, offset.z );

		// angle from y-axis

		var phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );

		theta += thetaDelta;
		phi += phiDelta;

		// restrict phi to be between desired limits
		phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, phi ) );

		// restrict phi to be between EPS and PI-EPS
		phi = Math.max( EPS, Math.min( Math.PI - EPS, phi ) );

		var radius = offset.length() * scale;
		
		//gets the radious 
		radius = Math.max( this.minDistance, Math.min( this.maxDistance, radius ) );

		//gets the offset of x, y ,z 
		offset.x = radius * Math.sin( phi ) * Math.sin( theta );
		offset.y = radius * Math.cos( phi );
		offset.z = radius * Math.sin( phi ) * Math.cos( theta );

		//if aoutorotate is true, then rotates the camera 
		if ( this.autoRotate ) {

			this.camera.position.x += this.autoRotateSpeed * ( ( this.player.position.x + this.playerDistanceX * Math.sin( this.player.rotation.y ) ) - this.camera.position.x );
			this.camera.position.z += this.autoRotateSpeed * ( ( this.player.position.z + this.playerDistanceZ * Math.cos( this.player.rotation.y ) ) - this.camera.position.z );

		} else {
			//if it's false, rotates the camera as the ofset 
			position.copy( this.center ).add( offset );

		}

		//rotates the camera to the center 
		this.camera.lookAt( this.center );

		thetaDelta = 0;
		phiDelta = 0;
		scale = 1;
		
		//checks if the player is moving or zooming 
		if ( state === STATE.NONE && playerIsMoving ) {

			this.autoRotate = true;

		} else {

			this.autoRotate = false;

		}

		if ( lastPosition.distanceTo( this.player.position) > 0 ) {

			lastPosition.copy( this.player.position );

		} else if ( lastPosition.distanceTo( this.player.position) == 0 ) {

			playerIsMoving = false;

        }

        playerbody.position.copy(player.position);
        //allows the lase to be controled 
        this.laserControl()
	//
        this.shipPlanetCollision()

	};

	//this check the keys pressed 
	this.checkKeyStates = async function () {

	    if (keyState[32]) {

	        // spacebar - move forward
            playerIsMoving = true;

	        this.player.position.x -= this.moveSpeed * Math.sin( this.player.rotation.y );
	        this.player.position.z -= this.moveSpeed * Math.cos( this.player.rotation.y );

	        this.camera.position.x -= this.moveSpeed * Math.sin( this.player.rotation.y );
	        this.camera.position.z -= this.moveSpeed * Math.cos( this.player.rotation.y );

        }

	    if (keyState[38] || keyState[87]) {

            // up arrow or 'w' - move upward

	        this.player.position.x += this.moveSpeed * Math.sin( this.player.rotation.x );
	        this.player.position.y += this.moveSpeed * Math.cos( this.player.rotation.x );

	        this.camera.position.x += this.moveSpeed * Math.sin( this.player.rotation.x );
	        this.camera.position.y += this.moveSpeed * Math.cos( this.player.rotation.x );

	    }

	    if (keyState[40] || keyState[83]) {

	        // down arrow or 's' - move downward

	        this.player.position.x -= this.moveSpeed * Math.sin( this.player.rotation.x );
	        this.player.position.y -= this.moveSpeed * Math.cos( this.player.rotation.x );

	        this.camera.position.x -= this.moveSpeed * Math.sin( this.player.rotation.x );
	        this.camera.position.y -= this.moveSpeed * Math.cos( this.player.rotation.x     );

	        //this.player.position.x += this.moveSpeed * Math.sin( this.player.rotation.y );
	        //this.player.position.z += this.moveSpeed * Math.cos( this.player.rotation.y );

	        //this.camera.position.x += this.moveSpeed * Math.sin( this.player.rotation.y );
	        //this.camera.position.z += this.moveSpeed * Math.cos( this.player.rotation.y );

	    }

	    if (keyState[37] || keyState[65]) {

	        // left arrow or 'a' - rotate left
	        playerIsMoving = true;

	        this.player.rotation.y += this.turnSpeed;

	    }

	    if (keyState[39] || keyState[68]) {

	        // right arrow or 'd' - rotate right
	        playerIsMoving = true;

            this.player.rotation.y -= this.turnSpeed;

	    }
	    if ( keyState[81] ) {

	        // 'q' - strafe left
	        playerIsMoving = true;

	        this.player.position.x -= this.moveSpeed * Math.cos( this.player.rotation.y );
	        this.player.position.z += this.moveSpeed * Math.sin( this.player.rotation.y );

	        this.camera.position.x -= this.moveSpeed * Math.cos( this.player.rotation.y );
	        this.camera.position.z += this.moveSpeed * Math.sin( this.player.rotation.y );

	    }

	    if ( keyState[69] ) {

	        // 'e' - strage right
	        playerIsMoving = true;

	        this.player.position.x += this.moveSpeed * Math.cos( this.player.rotation.y );
	        this.player.position.z -= this.moveSpeed * Math.sin( this.player.rotation.y );

	        this.camera.position.x += this.moveSpeed * Math.cos( this.player.rotation.y );
	        this.camera.position.z -= this.moveSpeed * Math.sin( this.player.rotation.y );

        }
        
        //Shoot a laser
        if (keyState[16] || keyState[189]) {
            this.shootLaser();
        }

	};

	//gets the rotation angle
	function getAutoRotationAngle() { 

		return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

	}
	
	//gets the zoom scale 
	function getZoomScale() {

		return Math.pow( 0.95, scope.userZoomSpeed );

    }
    //shoots the lasers 
    this.shootLaser = async function ()
    {
	    //check if the player can shoot lasers 
        if(canShoot)
        {
            canShoot = ! canShoot;
		//creates a laser 
            let laser = new THREE.Mesh(Geometries['lzr'], Materials['lzr']);
		// initializes the laser in the position of the player 
            laser.position.copy(this.player.position)
		//puts the rotation of the laser the same as the player 
            laser.rotation.y = (this.player.rotation.y)
            laser.rotateX(Math.PI/2)
            laser.rotateY(Math.random()*Math.PI/4)
            laser.position.x -= 0.5 * Math.sin( this.player.rotation.y );
            laser.position.z -= 0.5 * Math.cos( this.player.rotation.y );
		//scales the laser 
            laser.scale.set(1,5,1);
	// adds laser to the scene 
            scene.add(laser);
		// adds a physical body to the laser with CANNON 
            let lzrbody = addPhysicalBody(laser, {mass: 1});
		//tags the laser 
            lzrbody.tag = 'lzr';
		//push the lazer to the array 
            Lasers.push({mesh: laser, time: Date.now(), body: lzrbody});
		//makes it so there is a delay between the lasers 
            await new Promise(r => setTimeout(r,shootTimeout*5));
            canShoot = ! canShoot;
        }
    }

	//this function controls the lasers 
    this.laserControl = async function ()
    {
	    
        Lasers.forEach(lzr => {
		//deletes the lazer after some time has passed, as to not saturate the scene 
            if(lzr['time'] + 2500 < Date.now())
            {
                scene.remove(lzr['mesh'])
                Lasers.splice(Lasers.indexOf(lzr),1)
                world.removeBody(lzr['body']);
            }
            else
            {
		    //moves the lazer in the scene 
                lzr['mesh'].position.x -= this.moveSpeed * 2 * Math.sin( this.player.rotation.y );
                lzr['mesh'].position.z -= this.moveSpeed * 2 * Math.cos( this.player.rotation.y );
                lzr['body'].position.copy(lzr['mesh'].position);
            }
        });
    }

	//
    this.shipPlanetCollision= async function()
    {
        planetArray.forEach(planet =>
        {
            //console.log(planet.sphere.position)
            /*var dst = math.distance(Object.values(planet.sphere.position),Object.values(player.position));
            if(dst - 0.4 <= planet.radius)
            {
                console.log('collided')
            }*/
        });
    }

	/*function onMouseDown( event ) {

		if ( scope.enabled === false ) return;
		if ( scope.userRotate === false ) return;

		event.preventDefault();

		if ( event.button === 0 ) {

			state = STATE.ROTATE;

			rotateStart.set( event.clientX, event.clientY );

		} else if ( event.button === 1 ) {

			state = STATE.ZOOM;

			zoomStart.set( event.clientX, event.clientY );

		}

		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'mouseup', onMouseUp, false );

	}

	function onMouseMove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();

		if ( state === STATE.ROTATE ) {

			rotateEnd.set( event.clientX, event.clientY );
			rotateDelta.subVectors( rotateEnd, rotateStart );

			scope.rotateLeft( 2 * Math.PI * rotateDelta.x / PIXELS_PER_ROUND * scope.userRotateSpeed );
			scope.rotateUp( 2 * Math.PI * rotateDelta.y / PIXELS_PER_ROUND * scope.userRotateSpeed );

			rotateStart.copy( rotateEnd );

		} else if ( state === STATE.ZOOM ) {

			zoomEnd.set( event.clientX, event.clientY );
			zoomDelta.subVectors( zoomEnd, zoomStart );

			if ( zoomDelta.y > 0 ) {

				scope.zoomIn();

			} else {

				scope.zoomOut();

			}

			zoomStart.copy( zoomEnd );
		}

	}

	function onMouseUp( event ) {

		if ( scope.enabled === false ) return;
		if ( scope.userRotate === false ) return;

		document.removeEventListener('mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );

		state = STATE.NONE;

	}

	function onMouseWheel( event ) {

		if ( scope.enabled === false ) return;
		if ( scope.userRotate === false ) return;

		var delta = 0;

		if ( event.wheelDelta ) { //WebKit / Opera / Explorer 9

			delta = event.wheelDelta;

		} else if ( event.detail ) { // Firefox

			delta = - event.detail;

		}

		if ( delta > 0 ) {

			scope.zoomOut();

		} else {

			scope.zoomIn();

		}

	}*/

	//creates an event when you press a key 
	function onKeyDown( event ) {

    	event = event || window.event;

        keyState[event.keyCode || event.which] = true;

    }

	//creates an event when you stop pressing the key 
    function onKeyUp( event ) {

        event = event || window.event;

        keyState[event.keyCode || event.which] = false;

    }

	this.domElement.addEventListener('contextmenu', function( event ) { event.preventDefault(); }, false );
	//this.domElement.addEventListener('mousedown', onMouseDown, false );
	//this.domElement.addEventListener('mousewheel', onMouseWheel, false );
	//this.domElement.addEventListener('DOMMouseScroll', onMouseWheel, false ); // firefox
	this.domElement.addEventListener('keydown', onKeyDown, false );
	this.domElement.addEventListener('keyup', onKeyUp, false );

};

THREE.PlayerControls.prototype = Object.create( THREE.EventDispatcher.prototype );
