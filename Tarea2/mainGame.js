//global variables 
let renderer = null, //renderer variable
    controls = null, //control variable
    scene = null, // scene variable
    world = null, //phisical world var 
    worldpos = new THREE.Vector3(),
    camera = null, //camera 
    player = null, //player 
    playerbody = null, //Player Cannon body
    cameraTargetPlanet = null, //Planet camera points at
    ambientLight = null, //light 
    playerMode = false, //if player is there
    gameIsOn = true, //if user is playing game 
    gameOver = false, //if game is over variable 
    total_enemies = 10, //total number of enemies of the game 
    enemy_dir = new THREE.Vector3(), //Aides with assigning enemy direction
    global_rotation = true, //Boolean for global rotations
    global_translation = true, //Boolean for global transalations
    SolarSystem = null; //The sun, asteroid belt, and orbits parent group

//Array containing the code for each planet, the order is important
planets = ['Me', 'Ve', 'Ea', 'Ma', 'Ju', 'Sa', 'Ur', 'Ne', 'Pl']
asteroids = ['Ab_a', 'Ab_b', 'Ab_c']
//Arrays that will contain SpaceSpheres representing planets and asteroids
planetArray = [];
asteroidArray = [];
//Arrays that will contain Enemies and their target's code
Enemies = [];
Targets = [];

//Time vaiables for rotations
let duration = 100; // ms
let currentTime = Date.now();

function animate() 
{
    let now = Date.now();
    //gets the diference between where the game started and where ot is at, 
    let deltat = now - currentTime;
    currentTime = now;
    //gets a fraction 
    let fract = deltat / duration;
    //Each angle is equivalent to 1 Earth hour approximately
    let angle = Math.PI * 2 * fract;

    //Move the sun shader
    sunShader(fract);
    //Check current camera focus
    //updateOrbitTarget(planetArray[cameraTargetPlanet]);
    //Iterate over each planet and satelite and apply rotation and translation
    planetArray.forEach(planet =>
    {
        rotatePlanetsAndSatelites(planet, angle);
    });

    //Iterate over each asteroid and apply rotation and translation
    //*  the 24 multiplier makes days into hours
    //year speed and say speed are variables defined in unit.js 
    asteroidArray.forEach(asteroid =>
    {
        if (global_translation)
            asteroid.parent.rotation.y += (angle / (asteroid.year * 24)) * yearSpeed;
        if (global_rotation)
            asteroid.sphere.rotation.y += (angle / (asteroid.day * 24)) * daySpeed;
    });

    //Move aliens to their target
    Enemies.forEach(alien =>
    {
        let target_b_p = alien.target_ss.body.position
        alien.lookAt(target_b_p.x, target_b_p.y, target_b_p.z)
        alien.getWorldDirection(enemy_dir)
        alien.position.add(enemy_dir.multiplyScalar(alien.speed))
        alien.body.position.copy(alien.position)
    });

    //Update all physics except for enemies and player
    updatePhysics(fract);
}

//Applies movement to the sun shader
function sunShader(fract)
{
    planetArray[0].sphere.material.uniforms.time.value += fract / 100;
}

//Rotates and transaltes a planet and its satelites
// Recieves the planet as a SpaceSphere and the angle unit to rotate
function rotatePlanetsAndSatelites(spaceSphere, angle)
{
    //Rotate and transalte planet
    //*  the 24 multiplier makes days into hours
    if (global_translation)
    {
        spaceSphere.parent.rotation.y += (angle / (spaceSphere.year * 24)) * yearSpeed;
        //Move the collider
        spaceSphere.sphere.getWorldPosition(worldpos)
        spaceSphere.body.position.copy(worldpos);
    }
    if (global_rotation)
        spaceSphere.sphere.rotation.y += (angle / (spaceSphere.day * 24)) * daySpeed;
    //Rotate and transalte satelites
    if (spaceSphere.SatelitesArray.length)
    {
        //Iterate over satelites
        spaceSphere.SatelitesArray.forEach(satelite =>
        {
            if (global_translation)
                satelite.parent.rotation.y += (angle / (satelite.year / 365 * 24)) * yearSpeed * sateliteSpeedYear;
            if (global_rotation)
                satelite.sphere.rotation.y += (angle / (satelite.day * 24)) * daySpeed * sateliteSpeedDay;
        });
    }
}

//Runs animations
function run()
{
    //If the game is on
    if (gameIsOn)
    {
        requestAnimationFrame(function () { run(); });

        //Update the player
        if (controls != null)
            controls.update();

        // Render the scene
        renderer.render(scene, camera);

        animate();
        //Game was lost
        if (gameOver)
        {
            document.getElementById("GameOver").style.visibility = 'visible';
            gameSwitch();
        }
    }
}

//The SpaceSphere class
/*
radius = sphere radius
day = rotation time
year = translation time
parent_group = host pivot group
solar_distance = distance from host
tilt = object's tilt in the x axis
geometry = mesh geometry
material = mesh material
*/

class SpaceSphere
{
    constructor(radius, day, year, parent_group, solar_distance, tilt, geometry, material)
    {
        //Assign variables
        this.radius = radius;
        this.day = day;
        this.year = year;
        this.parent = parent_group;

        this.body = null;

        //Array to store local satelites
        this.SatelitesArray = [];
        //Create the sphere mesh
        this.sphere = new THREE.Mesh(geometry, material);
        //Shadow variables
        this.sphere.receiveShadow = true;
        this.sphere.castShadow = true;
        //Scale distance to earth's radius units and apply
        this.distance = solar_distance * au_to_er;
        this.sphere.position.z = this.distance;
        //Apply tilt to object
        this.tilt = radians(tilt);
        this.sphere.rotateX(-this.tilt);
        //Add the object to its parent object, self made
        this.parent.add(this.sphere);
    }

    //Adjusts and adds the satelite recieved to the array
    // Recieves a SpaceSphere object as input
    addSatelite(satelite)
    {
        //Add satelite to parent group, to make translation possible
        this.parent.add(satelite.parent);
        // Set satelite parent position
        satelite.parent.position.x = this.sphere.position.x;
        satelite.parent.position.y = this.sphere.position.y;
        satelite.parent.position.z = this.sphere.position.z;
        //Adds the satelite recieved to the array
        this.SatelitesArray.push(satelite)
        //Rotates the satelite parent's tilt to fit the host's
        satelite.parent.rotateX(-this.tilt);
        //Randomly rotates the satelite around the host
        satelite.parent.rotation.y += radians(Math.random() * 360);
    }

    //Asigns the orbit to teh object
    makePlanetOrbit()
    {
        this.orbit = makeOrbit(this.distance);
    }

    //Adds a ring
    // Recieves the inner and outer radio as a pair and the mesh material
    addRing([r1, r2], ring_m)
    {
        //Creates the ring geometry
        let ring_g = new THREE.RingBufferGeometry(r1, r1 + r2, sphere_detail * 2);
        //Applies the ring texture corretly
        // code from: https://discourse.threejs.org/t/applying-a-texture-to-a-ringgeometry/9990
        let pos = ring_g.attributes.position;
        let v3 = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++)
        {
            v3.fromBufferAttribute(pos, i);
            ring_g.attributes.uv.setXY(i, v3.length() < r2 ? 0 : 1, 1);
        }
        //Invert the ring texture and transparency
        ring_m.map.wrapS = THREE.RepeatWrapping;
        ring_m.map.repeat.x = -1;
        ring_m.alphaMap.wrapS = THREE.RepeatWrapping;
        ring_m.alphaMap.repeat.x = -1;
        //Create and save the ring mesh
        this.ring = new THREE.Mesh(ring_g, ring_m);
        this.ring.castShadow = true;
        this.ring.recieveShadow = true;
        //Rotate the ring appropriately
        this.ring.rotateX(-this.tilt - radians(90));
        //Set the ring position
        this.ring.position.z = this.distance;
        //Add ring to object parent
        this.parent.add(this.ring);
    }
};

//Recieves degrees and returns radians
function radians(d)
{
    return Math.PI * d / 180;
}

//Creates the planet orbit
// Recieves the inner radius
// Returns a Mesh representing the orbit
function makeOrbit(d)
{
    let orbit_g = new THREE.RingGeometry(d, d + orbit_width, orbit_detail);
    let orbit_m = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    let orbit = new THREE.Mesh(orbit_g, orbit_m);
    orbit.rotation.x = Math.PI / 2;
    return orbit;
}

//Creates n asteroids
// Recieves an n number
// Returns an array of SpaceSpheres
// Uses the same geometry for all asteroids
async function addAsteroids(n)
{
    for (let index = 0; index < n; index++)
    {
        //Add a minor orbital offset
        let orbit_offset = Math.random() - 0.6;
        //Scale the asteroid down in all 3 dimensions
        let asteroid_scaler_x = Math.random() * 0.002 + 0.004;
        let asteroid_scaler_y = Math.random() * 0.002 + 0.004;
        let asteroid_scaler_z = Math.random() * 0.002 + 0.004;
        //Add a rotation and translation offset
        // based on the asteroid belt range
        let days_offset = Math.random() * 0.6 - 0.4;
        let years_offset = Math.random() * 898.976 - 519.459;

        //Get asteroid model and extract geometry and material
        let asteroid_geo = null;
        let asteroid_mat = null;
        let asteroid_type = Math.round(Math.random() * 2);
        let asteroidModel = await Objects[asteroids[asteroid_type]]
        asteroidModel.traverse(function (child)
        {
            if (child.isMesh)
            {
                asteroid_geo = child.geometry;
                asteroid_mat = child.material;
            }
        });
        //Create asteroid object
        let asteroid = new SpaceSphere(
            Radii['Ab'],
            Days['Ab'] + days_offset,
            SolarYears['Ab'] + years_offset,
            new THREE.Object3D,
            (SolarDistances['Ab'] + orbit_offset),
            Tilts['Ab'] + Math.random() * 180 - 90,
            asteroid_geo,
            asteroid_mat);
        //Scales the asteroid
        asteroid.sphere.scale.set(asteroid_scaler_x, asteroid_scaler_y, asteroid_scaler_z);
        asteroid.sphere.castShadow = true;
        asteroid.sphere.recieveShadow = true;
        //Make the asteroid color darker depending on the type
        switch (asteroid_type)
        {
            case 0:
                asteroid.sphere.material.color.setHSL(0, 0, Math.random() * 0.35 + 0.1)
                break;
            case 1:
                asteroid.sphere.material.color.setHSL(0, 0, Math.random() * 0.35 + 0.1)
                break;
            case 2:
                asteroid.sphere.material.color.setHSL(0, 0, Math.random() * 0.35 + 0.3)
                break;
        }
        //Adds a y axis offset
        asteroid.sphere.position.y += Math.random() * 2 - 1;
        //Randomly rotates the asteroid around the sun
        asteroid.parent.rotation.y += radians(Math.random() * 360);
        //Add asteroid to array
        asteroidArray.push(asteroid);
    }

    //Create the asteroid belt orbit and make it darker
    let asteroidOrbit = makeOrbit(SolarDistances['Ab'] * au_to_er);
    asteroidOrbit.material.color.setHSL(0, 0, 0.4);
    SolarSystem.add(asteroidOrbit);

    //Add asteroids to scene
    asteroidArray.forEach(asteroid =>
    {
        asteroid.parent.add(asteroid.sphere);
        scene.add(asteroid.parent)
        asteroid.parent.updateMatrixWorld();
    });
}

//Adds n generic moons to a host
// Recieves an n number and the host's planet code
// Returns an array of SpaceSpheres
// Used the same geometry for all satelites
function addMoons(n, host)
{
    let Moonarray = []
    for (let index = 0; index < n; index++)
    {
        //Add a minor orbital offset
        let orbit_offset = Math.random() * 0.1;
        //Scale the satelite to a bigger size, maximum a tenth of its host
        let lunar_scaler = Math.random() * Radii[host] / 10;
        let size_scaler = new THREE.Vector3(lunar_scaler, lunar_scaler, lunar_scaler);
        //Add a rotation and translation offset
        let days_offset = Math.random() * 35 - 5;
        let years_offset = Math.random() * 15 - 5;
        //Create satelite object
        let sat = new SpaceSphere(
            Radii['Mo'],
            SateliteDays['Mo'] + days_offset,
            SateliteYears['Mo'] + years_offset,
            new THREE.Object3D,
            Radii['Mo'] + orbit_offset + Radii[host] / au_to_er,  //in Earth's radius units
            Tilts['Mo'] + Math.random() * 90 - 45, //Add a random tilt
            Geometries['Gm'],
            Materials['Gm']);
        //Scale the satelite
        sat.sphere.scale.add(size_scaler);
        sat.sphere.castShadow = true;
        sat.sphere.recieveShadow = true;
        //Make the satelite color brighter
        sat.sphere.material.color.setHSL(0, 0, Math.random() * 0.4 + 0.8)
        //Adds a y axis offset
        sat.sphere.position.y += Math.random() * 2 - 1;
        //Add satelite to array
        Moonarray.push(sat);
    }
    return Moonarray;
}

//Returns a sphere geometry from a recieved radius
function returnSphere(r)
{
    let figure = new THREE.SphereGeometry(r, sphere_detail, sphere_detail);
    return figure;
}

//Creates the sun
// Recieves the Solar System group
// Returns the sun as a SpaceSphere object
function makeSun(SolarSystemGroup)
{
    let sun = new SpaceSphere(Radii['Su'],
        Days['Su'],
        SolarYears['Su'],
        SolarSystemGroup,
        SolarDistances['Su'],
        Tilts['Su'],
        returnSphere(Radii['Su']),
        Materials['Su']);

    //Makes all Sun's textures repeat wrap
    sun.sphere.material.uniforms.noiseTexture.value.wrapS = THREE.RepeatWrapping;
    sun.sphere.material.uniforms.noiseTexture.value.wrapT = THREE.RepeatWrapping;
    sun.sphere.material.uniforms.glowTexture.value.wrapS = THREE.RepeatWrapping;
    sun.sphere.material.uniforms.glowTexture.value.wrapT = THREE.RepeatWrapping;;
    sun.sphere.material.uniforms.spotTexture.value.wrapS = THREE.RepeatWrapping;;
    sun.sphere.material.uniforms.spotTexture.value.wrapT = THREE.RepeatWrapping;;

    //Adds Sun to Solar System
    sun.parent.add(sun.sphere)
    sun.sphere.castShadow = false;
    sun.sphere.receiveShadow = false;
    return sun;
}

//Makes the sunlight as a PointLight
// Returns a PointLight
function makeSunlight()
{
    let sunlight = new THREE.PointLight();
    sunlight.intensity = solar_intensity * 2;
    sunlight.decay = 2;
    sunlight.castShadow = true;

    //for the shadows 
    sunlight.shadow.mapSize.width = 4096 / 1.5; // default/1.5
    sunlight.shadow.mapSize.height = 4096 / 1.5; // default/1.5
    sunlight.shadow.camera.near = 0.89 / 4; // default/4
    sunlight.shadow.camera.far = 500; // default

    return sunlight;
}

//Makes the planet based on its code
// Recieves the planet code as string and returns a SpaceSphere object
function makePlanet(code)
{
    //Create the planet based on it's constants
    let planet = new SpaceSphere(
        Radii[code],
        Days[code],
        SolarYears[code],
        new THREE.Object3D,
        SolarDistances[code],
        Tilts[code],
        returnSphere(Radii[code]),
        Materials[code]);

    //Randomly rotates the planet around the sun
    planet.parent.rotation.y = radians(Math.random() * 360);

    //Add orbital tilt to the planet parent
    planet.parent.rotateZ(radians(orbitTilts[code]))

    //Name the sphere as the planet code
    planet.sphere.name = code;

    //Add Satelites and rings if applicable
    switch (code)
    {
        case 'Ea':
            //Create the moon
            // It is a special satelite since it has a bump map and different texture
            let moon = new SpaceSphere(
                Radii['Mo'],
                SateliteDays['Mo'],
                SateliteYears['Mo'],
                new THREE.Object3D,
                Radii['Mo'] + SateliteDistances['Mo'],
                Tilts['Mo'],
                returnSphere(Radii['Mo']),
                Materials['Mo']);
            moon.sphere.receiveShadow = true;
            moon.sphere.castShadow = true;
            //Add the Moon to Earth
            planet.addSatelite(moon);
            //Start Earth at a static position, under player
            planet.parent.rotation.x = 0;
            planet.parent.rotation.y = 0;
            planet.parent.rotation.z = 0;
            break;
        case 'Sa':
            planet.addRing(Ring_radii[code], Materials[code + '_R']);
            break;
        case 'Ur':
            planet.addRing(Ring_radii[code], Materials[code + '_R']);
            break;
    }

    //Create a satelite array and add it to the host planet
    let moons = addMoons(n_Satelites[code], code);
    moons.forEach(satelite =>
    {
        planet.addSatelite(satelite);
    });

    return planet;
}

//Switches the ambient light on and off
function switchAmbientLight()
{
    if (ambientLight.intensity)
        ambientLight.intensity = 0;
    else
        ambientLight.intensity = ambient_intensity;
}

//Switches all rotations on and off
function switchRotation()
{
    global_rotation = !global_rotation;
}

//Switches all translations on and off
function switchTranslation()
{
    global_translation = !global_translation;
}

//Start the physical cannon world
function initPhysicalWorld()
{
    world = new CANNON.World();

    // Add physical bodies for planets
    planetArray.forEach(planet =>
    {
        planet.body = addPhysicalBody(planet.sphere, { mass: 1 });
        planet.body.tag = 'planet';
        planet.body.ss = planet;
    });

    //Overrite sun as its own entity
    planetArray[0].body.tag = 'sun';
}

//Add physical body to space
function addPhysicalBody(mesh, bodyOptions)
{
    var shape;
    // create a Sphere shape for spheres
    // a Box shape otherwise
    if (mesh.geometry.type === 'SphereGeometry' ||
        mesh.geometry.type === 'SphereBufferGeometry')
    {
        mesh.geometry.computeBoundingSphere();
        shape = new CANNON.Sphere(mesh.geometry.boundingSphere.radius);
    }
    else
    {
        mesh.geometry.computeBoundingBox();
        var box = mesh.geometry.boundingBox;
        //Special case for player and enemy
        if (mesh.name == 'vehicle_playerShip' || mesh.name == 'vehicle_enemyShip')
        {
            //Shrink its collider/hitbox
            box = new THREE.Box3();
            let newMesh = mesh.parent.clone();
            newMesh.scale.add(new THREE.Vector3(-0.001, -0.001, -0.001));
            box.setFromObject(newMesh);
        }
        shape = new CANNON.Box(new CANNON.Vec3(
            (box.max.x - box.min.x) / 2,
            (box.max.y - box.min.y) / 2,
            (box.max.z - box.min.z) / 2
        ));
    }
    var body = new CANNON.Body(bodyOptions);
    body.addShape(shape);
    body.position.copy(mesh.parent.position);
    body.computeAABB();
    // disable collision response so objects don't move when they collide
    // against each other
    body.collisionResponse = false;
    // keep a reference to the mesh so we can update its properties later
    body.mesh = mesh;
    world.addBody(body);
    return body;
}
//function to update the phisics of the game, this controls the collitions of an enemy, a planet the player 
function updatePhysics(delta)
{
    world.step(delta);

    world.contacts.forEach(function (contact) 
    {
        //Enemy's colisions
        if (contact.bj.tag == 'enemy')
        {
            //Enemy hits a planet
            if (contact.bi.tag == 'planet')
            {
                let plnt = document.getElementById(contact.bi.mesh.name + "_t").className;
                switch (plnt)
                {   //if it hits a planet 1 time 
                    case 'hit0':
                        document.getElementById(contact.bi.mesh.name + "_t").className = 'hit1'
                        break;
                        //if it hits a planet 2 time 
                    case 'hit1':
                        document.getElementById(contact.bi.mesh.name + "_t").className = 'hit2'
                        break;
                        //if it hits a planet 3 time 
                    //Planet is destroyed and enemies that targeted it change target
                    case 'hit2':
                        document.getElementById(contact.bi.mesh.name + "_t").className = 'hit3'
                        planetArray.splice(planetArray.indexOf(contact.bi.ss), 1);
                        Enemies.forEach(alien =>
                        {
                            if (alien.target_ss == contact.bi.ss)
                                alien.target_ss = planetArray[1 + Math.trunc(Math.random() * planetArray.length - 1)];
                        });
                        scene.remove(contact.bi.mesh.parent);
                        world.removeBody(contact.bi);
                        break;
                    default:
                        break;
                }
                //Enemy is destroyed
                Enemies.splice(Enemies.indexOf(contact.bj.mesh.parent), 1);
                world.removeBody(contact.bj);
                scene.remove(contact.bj.mesh.parent);
                //If no more enemies, game won
                if (Enemies.length == 0)
                {
                    document.getElementById("GameOver").innerHTML = 'Invasion Stopped';
                    gameOver = true;
                }
            }
            //Enemy hits sun
            if (contact.bi.tag == 'sun')
            {
                //Enemy is destroyed
                Enemies.splice(Enemies.indexOf(contact.bj.mesh.parent), 1);
                world.removeBody(contact.bj);
                scene.remove(contact.bj.mesh.parent);
                //If no more enemies, game won
                if (Enemies.length == 0)
                {
                    document.getElementById("GameOver").innerHTML = 'Invasion Stopped';
                    gameOver = true;
                }
            }
            //Enemy is hit by laser
            if (contact.bi.tag == 'lzr')
            {
                //Enemy is destroyed
                Enemies.splice(Enemies.indexOf(contact.bj.mesh.parent), 1);
                world.removeBody(contact.bj);
                scene.remove(contact.bj.mesh.parent);
                //If no more enemies, game won
                if (Enemies.length == 0)
                {
                    document.getElementById("GameOver").innerHTML = 'Invasion Stopped';
                    gameOver = true;
                }
            }
            //Enemy is hit by player, game is lost
            if (contact.bi.tag == 'player')
            {
                gameOver = true;
            }
            document.getElementById('n_enemies').innerHTML = 'Enemies: ' + Enemies.length;
        }
        //Player collides with planet or sun, game is lost
        if (contact.bj.tag == 'player')
        {
            if (contact.bi.tag == 'planet' || contact.bi.tag == 'sun')
            {
                gameOver = true;
            }
        }

    });
};

//function that adds a player to the scene 
async function addPlayer()
{
    //wait for object to load
    player = await Objects['Player'];
    //Shrink to a smaller scale
    player.scale.set(0.004, 0.004, 0.004);
    //Start over Earth
    player.position.z = SolarDistances['Ea'] * au_to_er;
    player.position.y = 1 + Radii['Ea'];
    //adds shadows 
    player.children[0].receiveShadow = true;
    player.children[0].castShadow = true;
    player.children[0].geometry.rotateY(Math.PI)
    playerMode = !playerMode;
    //initializes the camera in the same position as the player 
    camera.position.z = player.position.z + 2.5;
    camera.position.y = player.position.y + 0.5;
    camera.position.x = player.position.x;
    //Initialise controls
    controls = new THREE.PlayerControls(camera, player);
    //gives the speed 
    controls.movementSpeed = 0.21;
    controls.turnSpeed = 0.05;
    //adds player to the scene 
    scene.add(player)
    //Remove previous boundries
    player.children[0].geometry.boundingSphere = null;
    player.children[0].geometry.boundingBox = null;
    //adds a physical body to the layer 
    playerbody = addPhysicalBody(player.children[0], { mass: 1 });
    //tags the player 
    playerbody.tag = 'player';
}

//Adds enemies to the game
async function addEnemies()
{
    //Create enemies
    for (let index = 0; index < total_enemies; index++)
    {
        let enemy = null
        //gets a random type of enemy, each type has a diferent color, speed, damage and 3D model 
        let enemy_type = Math.round(1 + Math.random() * 9);
        //Wait for randm enemy type to load
        enemy = await Objects['Enemy' + 10 % enemy_type];
        //Assign speed according to type
        switch (10 % enemy_type)
        {
            case 0:
                enemy.speed = 0.2 / 10;
                break;
            case 1:
                enemy.speed = 0.2 / 8;
                break;
            case 2:
                enemy.speed = 0.2 / 6;
                break;
            case 3:
                enemy.speed = 0.2 / 5;
                break;
            case 4:
                enemy.speed = 0.2 / 5;
                break;
        }
        //Scale down
        enemy.scale.set(0.02, 0.02, 0.02);
        //Start above or below "horizon" to avoid spawn collisions
        if (index % 2 == 0)
            enemy.position.y = (Math.random() * -20) - 2;
        else
            enemy.position.y = (Math.random() * 20) + 2;
        //Assign random starting position, between Mars and Uranus
        let r = (SolarDistances['Ma'] + Math.random() * SolarDistances['Ur']) * au_to_er;
        let t = radians(Math.random() * 360)
        enemy.position.z = r * Math.cos(t)
        enemy.position.x = r * Math.sin(t)
        enemy.children[0].receiveShadow = true;
        enemy.children[0].castShadow = true;
        //Assign planet enemy will target
        enemy.target_ss = planetArray[1 + Math.trunc(Math.random() * planetArray.length - 1)];
        Targets.push(enemy.target_ss.sphere.name);
        //adds a physical body to the enemy 
        enemy.body = addPhysicalBody(enemy.children[0], { mass: 1 });
        enemy.body.tag = 'enemy';
        Enemies.push(enemy)
        scene.add(enemy)
    }
    //Create nuber of enemies and starting targets
    document.getElementById('n_enemies').innerHTML = 'Enemies: ' + Enemies.length;
    document.getElementById('targets').innerHTML = 'Targets: ' + Targets;
}

//Pauses the game
function gameSwitch()
{
    gameIsOn = !gameIsOn;
}

//creates a scene with the canvas element 
function createScene(canvas)
{
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.shadowMap.enabled = true;

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Set shadow map
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Set the background color
    scene.background = new THREE.Color(0.05, 0.05, 0.05);
    // scene.background = new THREE.Color( "rgb(100, 100, 100)" );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 4000);
    //scene.add(camera);

    // Create a group to hold all the objects
    SolarSystem = new THREE.Object3D;

    // This light globally illuminates all objects in the scene equally.
    // Cannot cast shadows
    ambientLight = new THREE.AmbientLight(0xffccaa, ambient_intensity);
    scene.add(ambientLight);

    //Start the Solar System at origin and add to scene
    SolarSystem.position.set(0, 0, 0);
    scene.add(SolarSystem);
    SolarSystem.updateMatrixWorld();

    //Add mouse handling so we can rotate the scene
    //controls = new THREE.OrbitControls(camera, renderer.domElement);
    //controls.update();

    //Visualization functions
    adjustSizes();
    adjustDistances();
    //Optimization functions
    lessMoons();
    lessAsteroids();

    //Create the Sun and add to scene
    let sun = makeSun(SolarSystem, scene);
    // Push the sun as the first planet
    planetArray.push(sun);

    //Create the sunlight
    let sunlight = makeSunlight();
    scene.add(sunlight);

    //Define and create the planets
    // Adds the planet to the scene and the orbit to the planet
    // Pushes them in the correct order
    planets.forEach(p =>
    {
        planet = makePlanet(p);
        planet.makePlanetOrbit();
        scene.add(planet.parent);
        planet.parent.updateMatrixWorld();
        //planet.orbit.rotateY(radians(orbitTilts[p]))
        planet.parent.add(planet.orbit)
        planetArray.push(planet);
    });

    //Function that adds asteroids
    addAsteroids(n_Asteroids);

    //Update the camera with the sun as it's target
    //updateCameraTarget(0);
    //Start the camera close to Pluto
    //camera.position.z = SolarDistances['Pl'] * au_to_er + 20;
    //Stop translations and rotations for easier startup loading
    switchTranslation();
    switchRotation();
    //Start physical world for collisions
    initPhysicalWorld();
    addPlayer();
    addEnemies();
    //Start translations and rotations
    switchTranslation();
    switchRotation();
}
