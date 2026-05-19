class TitleScene extends BaseScene {
    getHtml() {
        return `
            <div id="title-scene" style="display:flex; flex-direction:column; height:100%; width:100%;">
                <div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center; z-index:1;">
                    <img src="キャラクターjpg/タイトル.png" alt="WELL QUEST" style="max-width:90%; max-height:300px; object-fit:contain; margin-bottom:40px; filter:drop-shadow(0 10px 15px rgba(0,0,0,0.5));">
                    
                    <button id="btn-start" class="primary" style="margin-bottom:16px; width:200px; font-size:20px;">はじめる</button>
                    <button id="btn-continue" style="width:200px;">つづきから</button>
                </div>
                <div style="padding:16px; text-align:center; font-size:10px; color:#fff; text-shadow:1px 1px 2px rgba(0,0,0,0.8); z-index:1; font-weight:bold;">
                    登場する法人・人物・利用者は全て架空です
                </div>
            </div>
        `;
    }

    init() {
        const btnStart = this.element.querySelector('#btn-start');
        const btnContinue = this.element.querySelector('#btn-continue');

        btnStart.addEventListener('click', () => {
            if (window.gameState.hasSaveData()) {
                if (confirm('セーブデータがありますが、最初から始めますか？')) {
                    window.gameState.resetData();
                    this.sm.changeScene('create');
                }
            } else {
                this.sm.changeScene('create');
            }
        });

        btnContinue.addEventListener('click', () => {
            if (window.gameState.hasSaveData()) {
                this.sm.changeScene('mainHub');
            } else {
                alert('セーブデータがありません。');
            }
        });
    }
}
