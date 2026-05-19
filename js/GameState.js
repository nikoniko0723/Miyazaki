class GameState {
    constructor() {
        this.data = this.loadData() || this.getDefaultData();
    }

    getDefaultData() {
        return {
            playerName: "",
            gender: "other",
            facility: "",
            guild: "",
            job: "",
            partner: "キャラクターjpg/ホタル.png",
            
            // Avatar config
            avatarBase: "男性.png",
            avatarHue: 0,
            
            // Detailed Avatar Config
            avatarConfig: {
                gender: "男性",
                body: "標準",
                hair: "ショート",
                face: "丸顔",
                skin: "#fef08a",
                eye: "ぱっちり",
                eyebrow: "普通",
                nose: "普通",
                mouth: "スマイル",
                voice: "明るい"
            },
            
            level: 1,
            exp: 120,
            hp: 80,
            mp: 65,
            care: 320,
            pt: 80,
            
            stats: {
                専門力: 30,
                相談力: 45,
                信頼力: 38,
                意欲: 52,
                倫理観: 41,
                体力耐性: 35
            },
            
            dailyDone: false,
            battleDone: false,
            partnerDone: false,
            currentArea: "hometown",

            inventory: { weapons: [], armor: [], items: [] },
            titles: [],
            equippedTitle: null,

            savedAt: null
        };
    }

    get maxHp() { return 100; }
    get maxMp() { return 100; }
    
    get expNext() {
        let next = 1000;
        for(let i=1; i<this.data.level; i++) {
            next = Math.floor(next * 1.3);
        }
        return next;
    }

    loadData() {
        const saved = localStorage.getItem('wellQuestSave');
        if (!saved) return null;
        try {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.avatarBase) {
                if (parsed.avatarBase.includes('avatar_girl') || parsed.avatarBase.includes('female')) {
                    parsed.avatarBase = "女性.png";
                } else if (parsed.avatarBase.includes('avatar_boy') || parsed.avatarBase.includes('male')) {
                    parsed.avatarBase = "男性.png";
                }
            }
            // Migrate: add new fields if missing
            if (!parsed.inventory) parsed.inventory = { weapons: [], armor: [], items: [] };
            if (!parsed.titles) parsed.titles = [];
            if (parsed.equippedTitle === undefined) parsed.equippedTitle = null;
            if (!parsed.currentArea) parsed.currentArea = 'hometown';
            return parsed;
        } catch (e) {
            return null;
        }
    }

    saveData() {
        this.data.savedAt = new Date().toISOString();
        localStorage.setItem('wellQuestSave', JSON.stringify(this.data));
    }

    hasSaveData() {
        return localStorage.getItem('wellQuestSave') !== null;
    }
    
    resetData() {
        this.data = this.getDefaultData();
        this.saveData();
    }
}

// Global instance
window.gameState = new GameState();
