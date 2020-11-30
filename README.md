# FinalGraficas

## Requerimientos Fucnionales
* *Orbitas reales de los planetas*
* *Asteroides con diferent forma*
* *Shaders que agarren a los planetas*
* *Nave espacial que siga a la camara*
* *Minijuego en un planeta*


Instrucciones:

1. Crea 8 planetas (y plutón), con sus respectivas lunas, el son, y el cinturón de asteroides.
2. Los astros se pueden crear como esferas.
3. Los planetas y lunas tienen que tener su propia rotación.
4. Las lunas tienen que rotar al rededor de los planetas, y los planetas tienen que rotar al rededor del sol.
5. Dibuja las orbitas de cada planeta.
6. Cada elemento tiene que tener su propio materia, con texturas, normales, y bump maps (de existir).
7. La mayoría de las texturas las pueden encontrar en: http://planetpixelemporium.com/, http://www.celestiamotherlode.net/, https://www.solarsystemscope.com/textures/
8. Investiga cómo funciona el orbit controller de three.js e integralo en la escena.

Solución:

* Se transformó el ejemplo de clase threeJsScene para iniciar.
* Primero se creó la clase SpaceSPhere con la intención de ser un objeto que pueda contener a otros objetos del mismo tipo.
Todos los astros menos los anillos y órbitas serán de esta clase.
* Se crearon dos archivos para contener las variables que serán constantes.
    * units.js contiene las variables realistas de distancia, inclinación, tamaño, número de satélites y tiempo para las rotaciones y traslaciones de todos los astros. También contiene funciones que permiten reducir estos valores para mejor visualización.
    * materials.js contiene las texturas, transparencias, mapas, materiales, algunas geometrías y variables de iluminación, detalle poligonal e intensidad de relieve.
* Se crearon los objetos necesarios para visualizar una escena, y se añadió un orbit controler.
* Se crearon las funciones de optimización y visualización del sistema.
* Primero se crea el sol, con su respectivo shader basado en el ejemplo de clase threejsShaders y se agrega al arreglo de planetas.
* Después se crean el resto de los planetas, con sus repectivos satélites, anillos y órbita.
* Se crea el cinturón de asteroides.
* Las funciones de rotación y traslación funcionan de la siguente manera:
    * Cada planeta tiene un atributo padre que es un pivote al sol.
    * Cada satélite tiene lo mismo, pero es relativo a su planeta respectivo.
    * Los satélites son parte del grupo pivote de su planeta para que se puedan trasladar con él.
    * Cada astro tiene su propia rotación y traslación respectiva que se maneja por separado.
* Finalmente crear funciones y añadir al documento html botones que permitan:
    * Encender y apagar:
        * La luz ambiental
        * Todas las rotaciones
        * Todas las traslaciones
    * Invertir la cámara en z
    * Fijar el enfoque de la cámara a cada planeta o al sol

Librerías, frameworks o dependencias utilizadas:

* jquery
* gl-matrix

