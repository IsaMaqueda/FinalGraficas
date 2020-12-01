# FinalGraficas

### Isabel Maqueda Rolon A01652906
### Andres Campos Tams A01024385

## El proyecto final propuesto fue el siguiente: continuando el Sistema Solar de la Tarea 2, añadir valores reales al sistema solar, al igual que crear un minijuego. 

## Requerimientos Fucnionales
* *Crea 8 planetas (y plutón), con sus respectivas lunas, el son, y el cinturón de asteroides.*
* *Los planetas se crean como esferas*
* *Los planetas y lunas tienen que tener su propia rotación. La rotacion esta de acuerdo con los valores reales, sacados de https://nssdc.gsfc.nasa.gov/planetary/factsheet/ y https://www.enchantedlearning.com/subjects/astronomy/planets/* 
* *Las lunas tienen que rotar al rededor de los planetas, y los planetas tienen que rotar al rededor del sol.*
* *Dibujar orbitas reales de los planetas, donde la informacion fue sacada de https://www.hilarispublisher.com/open-access/mathematically-describing-planetary-orbits-in-two-dimensions-2168-9679-1000414.pdf*
* *Asteroides no creado como esferas, sino con forma en 3D*
* *Cada elemento tiene que tener su propio materia, con texturas, normales, y bump maps (de existir).*
* *Shaders para cada planeta*
* *Nave espacial que siga a la camara*
* *Minijuego: en donde la nave espacial tenga que esquivar asteroides, y cuando no pueda, pierda*
* *Menu*



## Solución:

* Se transformó el ejemplo de clase threeJsScene para iniciar.

* Todos los objetos que se añaden a la escena se guardan en variables globales definidas al principio. 

* Se crearon dos archivos para contener las variables que serán constantes.
    * units.js contiene las variables realistas de distancia, inclinación, tamaño, número de satélites y tiempo para las rotaciones y traslaciones de todos los astros. También contiene funciones que permiten reducir estos valores para mejor visualización.
    * materials.js contiene las texturas, transparencias, mapas, materiales, algunas geometrías y variables de iluminación, detalle poligonal e intensidad de relieve, al igual que los modelos 3D para los asteroides

* Se ceraron los siguientes archivos, que se utilizan para el manejo de modelos 3D y los controles, para que se pueda mover la nave al igual que acepte commandos del teclado.
    * loader.js contiene las funciones para poder subir un objeto basado en un modelo 3D a THREE.js, como se vio en 
    * controller.js contiene las funciones para el manejo del mouse, al igual que la funcionalidad del teclado, que hace posible la interracion de la nave en la escena. Utilizando THREE.ThirdPersonControls, tiene una funcion update en donde se maneja todo el movimiento de la nave. 
    * PlayerControls.js contiene las funciones que maneja el comportamiento  del jugador, el enemigo  y los lasers del jugador, utilizando coliders y THREE.PlayerControls. Tambien maneja zoom y la rotacion  de la camara y la nave. 


* Primero se creó la clase SpaceSPhere con la intención de ser un objeto que pueda contener a otros objetos del mismo tipo.
Todos los astros menos los anillos y órbitas serán de esta clase.

* Se crearon los objetos necesarios para visualizar una escena, y se añadió un orbit controler.

* Se crearon las funciones de optimización y visualización del sistema.

* Primero se crea el sol, con su respectivo shader basado en el ejemplo de clase threejsShaders y se agrega al arreglo de planetas. Para que cada planeta sea parte del shader del sol, se utilizo un shadowMap tipo THREE.PCFSoftShadowMap, ya que la luz principal del sol es un objeto THREE.PointLight, como se vio en la clase de Lights and Shadows. 
* Después se crean el resto de los planetas, con sus repectivos satélites, anillos y órbita.
* Se crea el cinturón de asteroides. Los asteroides son los unicos planetas que no son una esfera. Para eso se puede escoger entre tres tipos diferentes de modelo 3D, con un random eliguiendo que modelo se crea. Cada asteroide es diferente, ya que el tamaño, el color, la rotacion y la posicion son creadas aleatoriamente, al igual que su tipo. 

* Las funciones de rotación y traslación funcionan de la siguente manera:
    * Cada planeta tiene un atributo padre que es un pivote al sol.
    * Cada satélite tiene lo mismo, pero es relativo a su planeta respectivo.
    * Los satélites son parte del grupo pivote de su planeta para que se puedan trasladar con él.
    * Cada astro tiene su propia rotación y traslación respectiva que se maneja por separado.

* Despues crear funciones y añadir al documento html botones que permitan, en el sistema solar normal:
    * Encender y apagar:
        * La luz ambiental
        * Todas las rotaciones
        * Todas las traslaciones
    * Invertir la cámara en z
    * Fijar el enfoque de la cámara a cada planeta o al sol

* Para el sistema solar normal, que no es juego, se agrega una nave con THREE.ThirdPersonControls para que pueda explorar el sistema solar.

* Para el minijuego, primero se tiene que hacer un mudo fisico, en donde los objetos puedan interactuar con otros objetos. Para eso se crea una funcion que utiliza CANNON.World(), y que crea un cuerpo fisico a cada planeta y asteroide, con una masa de 1 y lo añade a la escena.  Como se vio en Physics.js

* Despues se agrega una nave con THREE.PlayerControls y un cuerpo fisico, utilizando CANNON para el manejo de los colliders y su cuerpo fisico. El jugador tiene lasers que matan al enemigo, y su comportamiento esta definido en PlayerControls.js 

* Despues se tienen que crear los enemigos, que tienen un numero finito de enemigos definido al principio, y se elige aleatoriamente que tipo de enemigo es, al igual que su velocidad y comportamiento.

* El minijuego tiene una variable que dice si el jugador perdio o no, y cuando el jugador muere se termina el juego.


Librerías, frameworks o dependencias utilizadas:

* jquery
* gl-matrix
* cannon.js 
* three.js

