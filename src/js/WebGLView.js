class WebGLView {

    constructor(element, canvasSize, holder, shader){
        this.canvasSize = canvasSize;
        this.holder = holder;
        this.shader = shader;
        this.setCurrentTexture(element);
        this.init();
    }

    init(){

        let canvas = WebGLUtils.createCanvas("webgl-canvas", this.holder, this.canvasSize);
        this.gl = WebGLUtils.getGLContext(canvas);
        this.texture = new Texture().create( this.gl, this.getCurrentTexture() );
        this.setupVerticesAndTexture();
        this.configureShader(this.shader);
        this.setupAttributesAndUniform();

        this.renderLoop();
    }

    setupVerticesAndTexture(){

        let textureVertices = [ 
          
            -1.0,-1.0,
             1.0,-1.0,
            -1.0, 1.0,
    
            -1.0, 1.0,
             1.0,-1.0,
             1.0, 1.0
        ];
        
        let textureCoords = [  
    
             0.0, 1.0,
             1.0, 1.0,
             0.0, 0.0,
    
             0.0, 0.0,
             1.0, 1.0,
             1.0, 0.0
    
             
        ];

        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureVertices), this.gl.STATIC_DRAW); 
        
        this.textureBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoords),  this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

      };
      
      configureShader(id){
        
        var gl = this.gl;

        var vertexShader = WebGLUtils.getShader(gl, "post-common-vs");
        var fragmentShader = WebGLUtils.getShader(gl, id);
    
        if(this.shaderPostProcess) {
            gl.deleteProgram(this.shaderPostProcess);
        }
    
        this.shaderPostProcess = gl.createProgram();
        gl.attachShader(this.shaderPostProcess, vertexShader);
        gl.attachShader(this.shaderPostProcess, fragmentShader);
        gl.linkProgram(this.shaderPostProcess);
    
        if (!gl.getProgramParameter(this.shaderPostProcess, gl.LINK_STATUS)) {
            throw new Error("Could not initialise post-process shader");
        }
        
        this.shaderPostProcess.aVertexPositionTexture   = gl.getAttribLocation(this.shaderPostProcess, "aVertexPositionTexture");
        this.shaderPostProcess.aVertexTextureCoords   = gl.getAttribLocation(this.shaderPostProcess, "aVertexTextureCoords");
        this.shaderPostProcess.uSampler = gl.getUniformLocation(this.shaderPostProcess, "uSampler");
        this.shaderPostProcess.uSamplerChroma = gl.getUniformLocation(this.shaderPostProcess, "uSamplerChroma");
    
    };

    setupAttributesAndUniform(){

        this.gl.useProgram(this.shaderPostProcess);

        this.gl.enableVertexAttribArray(this.shaderPostProcess.aVertexPositionTexture); 
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.vertexAttribPointer(this.shaderPostProcess.aVertexPositionTexture, 2, this.gl.FLOAT, false, 0, 0);
    
        this.gl.enableVertexAttribArray(this.shaderPostProcess.aVertexTextureCoords);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureBuffer);
        this.gl.vertexAttribPointer(this.shaderPostProcess.aVertexTextureCoords, 2, this.gl.FLOAT, false, 0, 0);
        
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        
        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureChroma);
    
        var u_image0Location = this.gl.getUniformLocation(this.shaderPostProcess, "uSampler");
        var u_image1Location = this.gl.getUniformLocation(this.shaderPostProcess, "uSamplerChroma");
        this.gl.uniform1i(u_image0Location,  0);
        this.gl.uniform1i(u_image1Location,  1);
        
    };
      
    draw() {
    
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.getCurrentTexture());
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    
    };

    setCurrentTexture(value){
        this.currentTexture = value;
    };

    getCurrentTexture(){
        return this.currentTexture;
    };

    updateTexture(value){
        this.setCurrentTexture(value);
    }

    renderLoop(){
    
        requestAnimFrame(this.renderLoop.bind(this));
        this.draw();
    
    };



}