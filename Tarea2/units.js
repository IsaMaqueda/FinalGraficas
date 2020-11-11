//Values from:
// https://nssdc.gsfc.nasa.gov/planetary/factsheet/
// https://www.enchantedlearning.com/subjects/astronomy/planets/

//Celestial bodies code
/*
Su = Sun
Me = Mercury
Ve = Venus
Ea = Earth
Mo = Moon
Ma = Mars
Ab = Asteroid Belt (asteroid)
Ju = Jupiter
Sa = Saturn
Ur = Uranus
Ne = Neptune
Pl = Pluto
Gm = Generic Moon
*/

//Time modifiers
 // Suggested settings guarentee that all objects move
//The speed at which days pass, 1 is realistic
var daySpeed = 1.1; //1.1 suggested
//The speed at which years pass, 1 is realistic
var yearSpeed = 5.333; //5.333 suggested
//The speed at which satelites rotate pass, 1 is realistic
var sateliteSpeedDay = 10.1; //10.01 suggested
//The speed at which satelites rotate around their host pass, 1 is realistic
var sateliteSpeedYear = 0.01; //0.1 suggested
//* They all need to be positive
//* Using values that are too big or small can cause objects to not move at all or dissapear

//Distance variables
//Distances to the sun in Astronomical Units
var SolarDistances =
{
    Su: 0,
    Me: 0.3871,
    Ve: 0.723,
    Ea: 1,
    Ma: 1.523,
    Ab: 2.8, //2.2 - 3.2 average range
    Ju: 5.2,
    Sa: 9.53,
    Ur: 19.19,
    Ne: 30,
    Pl: 39.5,
}

//Distances from satelites to their respective planet in AU
var SateliteDistances =
{
    Mo: 0.00257, //384400km
}

//1 Astronomical Unit to Earth's radius
var au_to_er = 23454.8;

//Reduce the distance between planets to allow better visualization
// Values are close to scale
function adjustDistances()
{
    SolarDistances =
    {
        Su: 0,
        Me: 1.39,
        Ve: 1.72,
        Ea: 2,
        Ma: 2.52,
        Ab: 3.8, //3.2 - 4.2
        Ju: 6.2,
        Sa: 10.53,
        Ur: 20.19,
        Ne: 31,
        Pl: 40,
    }
    //Modify the ratio of AU and Earth's radius
    au_to_er = 12;
}

//Size variables
//Planet radii
//Earth's radius is 1
var Radii =
{
    Su: 109.3,
    Me: 0.3829,
    Ve: 0.9499,
    Ea: 1,
    Mo: 0.2727,
    Ma: 0.532,
    Ab: 0.00156786, // 1Km
    Ju: 10.97,
    Sa: 9.140,
    Ur: 3.981,
    Ne: 3.865,
    Pl: 0.187,
}

//Planet ring radii, as a pair of inner and outer
//Earth's radius is 1
var Ring_radii =
{
    Sa: [Radii['Sa'] + 1.04, 18.924], //Sa+6630km , 120700km
    Ur: [Radii['Ur'] + 1.976, 15.365], //Ur+12603km , 98000km
}

//Reduce the size of celestial bodies to allow better visualization
// Values are not up to scale
function adjustSizes()
{
    Radii =
    {
        Su: 13,
        Me: 0.383,
        Ve: 0.95,
        Ea: 1,
        Mo: 0.2,
        Ma: 0.5,
        Ab: 0.05, //~320km 
        Ju: 6,
        Sa: 7,
        Ur: 2.1,
        Ne: 2,
        Pl: 0.2,
    }

    Ring_radii =
    {
        Sa: [Radii['Sa'] + 1.04, 9], //Sa+6630km , 120700km
        Ur: [Radii['Ur'] + 1.976, 4.365], //Ur+12603km , 98000km
    }

    Geometries =
    {
        Ab: new THREE.SphereGeometry(Radii['Ab'], sphere_detail, sphere_detail),
        Gm: new THREE.SphereGeometry(Radii['Mo'], sphere_detail, sphere_detail),
    }

}

//Tilt variables
//Celestial body tilts in degrees
var Tilts =
{
    Su: 7.25,
    Me: 0.03,
    Ve: 177.8,
    Ea: 23.44,
    Mo: 6.68,
    Ma: 25.29,
    Ab: 0, //Will be random on creation
    Ju: 3.13,
    Sa: 26.73,
    Ur: 97.8,
    Ne: 28.32,
    Pl: 122.47,
}

//Orbit variables
//Celestial body orbit tilts in degrees
var orbitTilts =
{
    Su: 0, //No orbit
    Me: 7,
    Ve: 3.4,
    Ea: 0, //Is used as a base
    Ma: 1.9,
    Ju: 1.3,
    Sa: 2.5,
    Ur: 0.8,
    Ne: 1.8,
    Pl: 17.2,
}

//Width for all orbits
var orbit_width = 0.25;

//Time variables
//Lenght in days it takes to complete a revolution around itself
// never 0 since it causes division by 0
var Days =
{
    //Negative means they spin backwards
    Su: 24.5, //approximately at the equator
    Me: 58.7,
    Ve: -243,
    Ea: 1,
    Ma: 1.026,
    Ab: 1, //*
    Ju: 0.41,
    Sa: 0.425,
    Ur: -0.7458333,
    Ne: 0.7958333,
    Pl: -6.39,
}

//Lenght in days it takes to complete a revolution around the sun
// never 0 since it causes division by 0
var SolarYears =
{
    //Realistically, it is Day['Su'] but for visualization it is made slower
    /* 
    If the number is lower than one of the planets, it causes backwards spinning
    It happens since the entire Solar system is considered the Sun's parent
    */
    Su: 100000,
    Me: 87.96,
    Ve: 224.68,
    Ea: 365.26,
    Ma: 686.98,
    Ab: 1711.342,
    Ju: 4329.63,
    Sa: 10751.44,
    Ur: 30685.55,
    Ne: 60155.65,
    Pl: 90410.5,
}

//Satelite variables
// The moon is used as a base for all satelites

//Number of satelites each planet has
var n_Satelites =
{
    Me: 0,
    Ve: 0,
    Ea: 0, //Special case due to unique mesh, realistically 1
    Ma: 2,
    Ju: 79,
    Sa: 82,
    Ur: 27,
    Ne: 14,
    Pl: 5,
}

//Reduces the number of moons each planet has
function lessMoons()
{
    n_Satelites =
    {
        Me: 0,
        Ve: 0,
        Ea: 0, //Special case
        Ma: 2,
        Ju: 19,
        Sa: 22,
        Ur: 17,
        Ne: 14,
        Pl: 5,
    }
}

//Lenght in days it takes to complete a revolution around itself
// never 0 since it causes division by 0
var SateliteDays =
{
    Mo: 27.3,
}

//Lenght in days it takes to complete a revolution around the host
// never 0 since it causes division by 0
var SateliteYears =
{
    //The moon rotates as fast as it translates
    Mo: SateliteDays['Mo'],
}

//Asteroid variables
var n_Asteroids = 150;

//Halves the number of asteroids
function lessAsteroids()
{
    n_Asteroids /= 2;
}