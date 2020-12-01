//source: class of Loaders, Computer Grafics

//function that returns a if a promise is fullfiled while loading an object 
function promisifyLoader ( loader, onProgress ) 
{
    function promiseLoader ( url ) {
  
      return new Promise( ( resolve, reject ) => {
  
        loader.load( url, resolve, onProgress, reject );
  
      } );
    }
  
    return {
      originalLoader: loader,
      load: promiseLoader,
    };
}

//error mesage 
const onError = ( ( err ) => { console.error( err ); } );

//function that loads an 3D object from a file. recieves as parameters the file, texture and normal map
async function loadOBJ(obj_file,texture,normalMap)
{
    let objPromiseLoader = promisifyLoader(new THREE.OBJLoader());

    try {
        let object = await objPromiseLoader.load(obj_file);
                
        object.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.material.map = texture;
                child.material.normalMap = normalMap;
            }
        } );
        return object;
    }
    catch(err)
    {
        console.error( err );
    }
}
