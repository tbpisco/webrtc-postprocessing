class ImageLoader {

    constructor(){
        
    }

    static load(src){
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => reject(error);
            image.src = src;
        })
    }
}