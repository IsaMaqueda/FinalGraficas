//Textures and maps from: http://planetpixelemporium.com/planets.html

//Polygonal detail
//Detail for all spheres
var sphere_detail = 25;
//Detail for all orbits
var orbit_detail = 48;

//Solar intensity
var solar_intensity = 1.1; //1.1 recommended
//Ambient Light intensity
var ambient_intensity = 1.2; //1.2 recommended
//Texture bump intensity
var bump_intensity = 0.2; //0.2 recommended
//Texture normal intensity
var normal_intensity = new THREE.Vector2(1,1); //(1,1) recommended

//All textures
var Textures =
{
    Su: new THREE.TextureLoader().load("../../images/sun_texture.jpg"),
    Me: new THREE.TextureLoader().load("../../images/mercurymap.jpg"),
    Ve: new THREE.TextureLoader().load("../../images/venusmap.jpg"),
    Ea: new THREE.TextureLoader().load("../../images/earthmap1k.jpg"),
    Mo: new THREE.TextureLoader().load("../../images/moonmap1k.jpg"),
    Ma: new THREE.TextureLoader().load("../../images/mars_1k_color.jpg"),
    Ab_a: new THREE.TextureLoader().load("../../models/asteroid/asteroid_a.png"),
    Ab_b: new THREE.TextureLoader().load("../../models/asteroid/asteroid_b.png"),
    Ab_c: new THREE.TextureLoader().load("../../models/asteroid/asteroid_c.png"),
    Ju: new THREE.TextureLoader().load("../../images/jupitermap.jpg"),
    Sa: new THREE.TextureLoader().load("../../images/saturnmap.jpg"),
    Sa_R: new THREE.TextureLoader().load("../../images/saturnringcolor.jpg"),
    Ur: new THREE.TextureLoader().load("../../images/uranusmap.jpg"),
    Ur_R: new THREE.TextureLoader().load("../../images/uranusringcolour.jpg"),
    Ne: new THREE.TextureLoader().load("../../images/neptunemap.jpg"),
    Pl: new THREE.TextureLoader().load("../../images/plutomap1k.jpg"),
    //The Moon's bump map is used as texture for Generic moons
    Gm: new THREE.TextureLoader().load("../../images/moonbump1k.jpg"),
    Player: new THREE.TextureLoader().load("../../models/ship/ship-mono.png"),
}

//Noise used for the sun
var Noises =
{
    //Noise
    Su: new THREE.TextureLoader().load("../../images/cloud.png"),
    //Solar spots
    Su_s: new THREE.TextureLoader().load("../../images/sunmap.jpg"),
}

//Planet ring transparencies
var Transparencies =
{
    Sa_R: new THREE.TextureLoader().load("../../images/saturnringpattern.gif"),
    Ur_R: new THREE.TextureLoader().load("../../images/uranusringtrans.gif"),
}

//All bump maps
var Bumps =
{
    Me: new THREE.TextureLoader().load("../../images/mercurybump.jpg"),
    Ve: new THREE.TextureLoader().load("../../images/venusbump.jpg"),
    Ea: new THREE.TextureLoader().load("../../images/earthbump1k.jpg"),
    Mo: new THREE.TextureLoader().load("../../images/moonbump1k.jpg"),
    Ma: new THREE.TextureLoader().load("../../images/mars_1k_topo.jpg"),
    Pl: new THREE.TextureLoader().load("../../images/plutobump1k.jpg"),
}

//All normal maps
var Normals =
{
    Ea: new THREE.TextureLoader().load("../../images/earth_normal.jpg"),
    Ma: new THREE.TextureLoader().load("../../images/mars_1k_normal.jpg"),
    Ab_a: new THREE.TextureLoader().load("../../models/asteroid/asteroid_a-normal.png"),
    Ab_b: new THREE.TextureLoader().load("../../models/asteroid/asteroid_b-normal.png"),
    Ab_c: new THREE.TextureLoader().load("../../models/asteroid/asteroid_c-normal.png"),
    Player: new THREE.TextureLoader().load("../../models/ship/ship-normal.png"),

}

//All materials
var Materials =
{
    Su: new THREE.ShaderMaterial({
        uniforms:
        {
            time: { type: "f", value: 0.2 },
            noiseTexture: { type: "t", value: Noises['Su'] },
            glowTexture: { type: "t", value: Textures['Su'] },
            spotTexture: { type: "t", value: Noises['Su_s'] }
        },
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
    }),
    Me: new THREE.MeshPhongMaterial({
        map: Textures['Me'],
        bumpMap: Bumps['Me'],
        bumpScale: bump_intensity,
    }),
    Ve: new THREE.MeshPhongMaterial({
        map: Textures['Ve'],
        bumpMap: Bumps['Ve'],
        bumpScale: bump_intensity,
    }),
    Ea: new THREE.MeshPhongMaterial({
        map: Textures['Ea'],
        normalMap: Normals['Ea'],
        normalScale: normal_intensity,
    }),
    Mo: new THREE.MeshPhongMaterial({
        map: Textures['Mo'],
        bumpMap: Bumps['Mo'],
        bumpScale: bump_intensity,
    }),
    Ma: new THREE.MeshPhongMaterial({
        map: Textures['Ma'],
        normalMap: Normals['Ma'],
        normalScale: normal_intensity,
    }),
    Ju: new THREE.MeshPhongMaterial({ map: Textures['Ju'] }),
    Sa: new THREE.MeshPhongMaterial({ map: Textures['Sa'] }),
    Sa_R: new THREE.MeshPhongMaterial({
        map: Textures['Sa_R'],
        alphaMap: Transparencies['Sa_R'],
        side: THREE.DoubleSide,
        transparent: true
    }),
    Ur: new THREE.MeshPhongMaterial({ map: Textures['Ur'] }),
    Ur_R: new THREE.MeshPhongMaterial({
        map: Textures['Ur_R'],
        alphaMap: Transparencies['Ur_R'],
        side: THREE.DoubleSide,
        transparent: true
    }),
    Ne: new THREE.MeshPhongMaterial({ map: Textures['Ne'] }),
    Pl: new THREE.MeshPhongMaterial({
        map: Textures['Pl'],
        bumpMap: Bumps['Pl'],
        bumpScale: bump_intensity,
    }),
    Gm: new THREE.MeshPhongMaterial({map: Textures['Gm']}),
    lzr: new THREE.MeshBasicMaterial({opacity: 0.9, transparent: true}),
}

//Generic Geometries for moons
var Geometries =
{
    //Generic Moon Geometry
    Gm: new THREE.SphereGeometry(Radii['Mo'],sphere_detail,sphere_detail),
    lzr: new THREE.SphereGeometry(Radii['Mo']/6, 8, 6)
}

//Obj files for asteroids, the ship, and aliens
var Obj =
{
    //Generic Asteroid objects
    Ab_a: "../../models/asteroid/asteroid_a.obj",
    Ab_b: "../../models/asteroid/asteroid_b.obj",
    Ab_c: "../../models/asteroid/asteroid_c.obj",
    Player: "../../models/ship/ship.obj",
}

//Generic Objects for asteroids, the ship, and aliens
var Objects =
{
    //Generic Asteroid objects
    Ab_a: loadOBJ(Obj['Ab_a'],Textures['Ab_a'],Normals['Ab_a']),
    Ab_b: loadOBJ(Obj['Ab_b'],Textures['Ab_b'],Normals['Ab_b']),
    Ab_c: loadOBJ(Obj['Ab_c'],Textures['Ab_c'],Normals['Ab_c']),
    Player: loadOBJ(Obj['Player'],Textures['Player'],Normals['Player']),
}