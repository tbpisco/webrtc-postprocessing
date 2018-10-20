class WebGLUtils{

    constructor(){

    }

    static calculateNormals(vs, ind){
        var x=0; 
        var y=1;
        var z=2;
        
        var ns = [];
        for(var i=0;i<vs.length;i++){ 
            ns[i]=0.0;
        }
        
        for(var i=0;i<ind.length;i=i+3){ 
            var v1 = [];
            var v2 = [];
            var normal = [];
            //p1 - p0
             v1[x] = vs[3*ind[i+1]+x] - vs[3*ind[i]+x];
             v1[y] = vs[3*ind[i+1]+y] - vs[3*ind[i]+y];
             v1[z] = vs[3*ind[i+1]+z] - vs[3*ind[i]+z];
           // p0 - p1
             v2[x] = vs[3*ind[i+2]+x] - vs[3*ind[i+1]+x];
             v2[y] = vs[3*ind[i+2]+y] - vs[3*ind[i+1]+y];
             v2[z] = vs[3*ind[i+2]+z] - vs[3*ind[i+1]+z];            
            //cross product by Sarrus Rule
            normal[x] = v1[y]*v2[z] - v1[z]*v2[y];
            normal[y] = v1[z]*v2[x] - v1[x]*v2[z];
            normal[z] = v1[x]*v2[y] - v1[y]*v2[x];
            
             for(j=0;j<3;j++){ 
                ns[3*ind[i+j]+x] =  ns[3*ind[i+j]+x] + normal[x];
                 ns[3*ind[i+j]+y] =  ns[3*ind[i+j]+y] + normal[y];
                 ns[3*ind[i+j]+z] =  ns[3*ind[i+j]+z] + normal[z];
             }
        }

        for(var i=0;i<vs.length;i=i+3){ 
        
            var nn=[];
            nn[x] = ns[i+x];
            nn[y] = ns[i+y];
            nn[z] = ns[i+z];
            
            var len = Math.sqrt((nn[x]*nn[x])+(nn[y]*nn[y])+(nn[z]*nn[z]));
            if (len == 0) len = 0.00001;
            
            nn[x] = nn[x]/len;
            nn[y] = nn[y]/len;
            nn[z] = nn[z]/len;
            
            ns[i+x] = nn[x];
            ns[i+y] = nn[y];
            ns[i+z] = nn[z];
        }
        
        return ns;
    }

    static getShader(gl, id){

        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }
  
        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3)
                str += k.textContent;
            k = k.nextSibling;
        }
  
        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }
  
        gl.shaderSource(shader, str);
        gl.compileShader(shader);
  
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(shader));
            return null;
        }
  
        return shader;

    }

    static createCanvas(id, holder, size){

		var canvas = document.createElement("canvas");
		canvas.id = id;
		holder.appendChild(canvas);
		canvas.width = size.w;
        canvas.height = size.h;

        return canvas;
	}

    static getGLContext(canvas){
        var ctx = null;
		
		if (canvas == null){
			throw new Error('there is no canvas on this page');
			return null;
		}
				
		var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
	
		for (var i = 0; i < names.length; ++i) {
		try {
			ctx = canvas.getContext(names[i]);
		} 
		catch(e) {}
			if (ctx) {
				break;
			}
		}
		if (ctx == null) {
			throw new Error("Could not initialise WebGL");
			return null;
		}
		else {
			return ctx;
		}
	    gl = canvas.getContext("webgl");
	  
	    return gl;
    }
};