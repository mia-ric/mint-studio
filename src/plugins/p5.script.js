
const p5Script = {
    loadScript: function (filepath) {
        const result = {};
        globalThis._incrementPreload();
        
        const script = document.createElement('script');
        script.src = filepath;
        script.onload = () => {
            result.filepath = filepath;
            this._decrementPreload();
        }
        document.head.appendChild(script);
        return result;
    }
}
p5.prototype.registerPreloadMethod('loadScript', p5Script);

globalThis.loadScript = p5Script.loadScript;
