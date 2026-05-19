class SceneManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scenes = {};
        this.currentScene = null;
    }

    registerScene(id, sceneClass) {
        this.scenes[id] = sceneClass;
    }

    async changeScene(id, data = null) {
        if (this.currentScene) {
            // Fade out current scene
            this.currentScene.element.classList.remove('active');
            await this.wait(400); // match CSS transition
            if(this.currentScene.onExit) this.currentScene.onExit();
            this.currentScene.element.remove();
        }

        const SceneClass = this.scenes[id];
        if (!SceneClass) {
            console.error(`Scene ${id} not found.`);
            return;
        }

        this.currentScene = new SceneClass(this, data);
        
        // Setup scene DOM
        const el = document.createElement('div');
        el.className = 'scene';
        el.id = id;
        el.innerHTML = this.currentScene.getHtml();
        this.container.appendChild(el);
        this.currentScene.element = el;
        
        // Initialize scene logic
        if(this.currentScene.init) this.currentScene.init();

        // Trigger reflow
        void el.offsetWidth;

        // Fade in
        el.classList.add('active');
    }
    
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Base Scene class that other scenes will extend
class BaseScene {
    constructor(sceneManager, data) {
        this.sm = sceneManager;
        this.data = data;
        this.element = null;
    }
    
    getHtml() { return ""; }
    init() {}
    onExit() {}
}
