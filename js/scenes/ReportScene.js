class ReportScene extends BaseScene {
    getHtml() {
        const d = window.gameState.data;
        return `
            <div id="report-scene" style="display:flex; flex-direction:column; height:100%; width:100%; position:relative; overflow:hidden;">
                
                <!-- Background Gradient -->
                <div style="position:absolute; top:0; left:0; right:0; bottom:0; background: linear-gradient(135deg, #1e3a8a, #312e81, #1e1b4b); z-index:0;"></div>
                
                <!-- Header -->
                <div class="header" style="z-index: 5;">
                    <button id="btn-back" style="padding:8px 16px; font-size:12px;">← 戻る</button>
                    <h2 style="font-size:18px; color:var(--blue); font-weight:800; margin:0; margin-left:10px;">今日の日報報告</h2>
                </div>

                <div class="content" style="padding: 12px 20px; display:flex; gap:16px; z-index:5; flex:1; overflow-y:auto; flex-direction:column; justify-content:space-between;">
                    
                    <!-- Top: Dialogue & Live Partner -->
                    <div style="display:flex; gap:16px; align-items:center; justify-content:center; min-height: 120px;">
                        <div style="display:flex; flex-direction:column; align-items:center;">
                            <img src="${d.partner}" class="partner-img partner-live-anim" style="width:100px; height:100px; filter:drop-shadow(0 8px 16px rgba(0,0,0,0.4));">
                            <span class="rpg-ribbon" style="margin-top:-8px; padding: 2px 10px; font-size:9px;">Partner</span>
                        </div>
                        
                        <!-- Dialogue Box -->
                        <div class="rpg-wood-panel" style="flex:1; padding:12px;">
                            <div style="font-size:11px; color:#fde047; font-weight:bold; margin-bottom:4px; border-bottom:1px solid rgba(255,255,255,0.2);">パートナー</div>
                            <div id="partner-dialogue" style="font-size:13px; font-weight:bold; line-height:1.5;">
                                <!-- Personality-specific greeting -->
                            </div>
                        </div>
                    </div>

                    <!-- Center: Daily Report Form -->
                    <div class="rpg-parchment" style="flex:1; padding:16px; display:flex; flex-direction:column; gap:8px; border-radius:12px; margin-bottom:4px; border: 3px solid #d97706;">
                        <div style="font-size:13px; font-weight:bold; color:#b45309; text-align:center;">📝 クエスト：今日の日報を提出せよ！</div>
                        
                        <!-- Condition Selector -->
                        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                            <label style="font-size:12px; font-weight:bold; color:#78350f;">今日のコンディション:</label>
                            <div id="condition-rating" style="display:flex; gap:6px;">
                                <span class="cond-star" data-val="1" style="font-size:20px; cursor:pointer; filter:grayscale(1);">⭐</span>
                                <span class="cond-star" data-val="2" style="font-size:20px; cursor:pointer; filter:grayscale(1);">⭐</span>
                                <span class="cond-star" data-val="3" style="font-size:20px; cursor:pointer; filter:grayscale(0);">⭐</span>
                                <span class="cond-star" data-val="4" style="font-size:20px; cursor:pointer; filter:grayscale(1);">⭐</span>
                                <span class="cond-star" data-val="5" style="font-size:20px; cursor:pointer; filter:grayscale(1);">⭐</span>
                            </div>
                        </div>

                        <!-- Diary Input -->
                        <textarea id="report-text" placeholder="今日の出来事や、頑張ったこと、学んだことなどを記録しましょう..." style="width:100%; flex:1; min-height:80px; padding:8px; border:2px solid #b45309; border-radius:8px; font-family:inherit; font-size:12px; font-weight:bold; outline:none; resize:none; background:#fefce8; color:#78350f;"></textarea>

                        <!-- Submit Button -->
                        <button class="primary" id="btn-submit-report" style="width:100%; padding:10px; font-size:14px; margin-top:4px;">💾 日報を送信してクエスト完了！</button>
                    </div>

                </div>

                <!-- Bottom Nav -->
                <div class="bottom-nav" style="z-index:5;">
                    <button id="nav-home" class="nav-btn"><span>🏠</span>ホーム</button>
                    <button class="nav-btn active"><span>📝</span>日報</button>
                    <button id="nav-battle" class="nav-btn"><span>⚔️</span>バトル</button>
                    <button id="nav-shop" class="nav-btn"><span>🛒</span>ｼｮｯﾌﾟ</button>
                    <button id="nav-quest" class="nav-btn"><span>📜</span>クエスト</button>
                    <button id="nav-partner" class="nav-btn"><span>💬</span>ﾊﾟｰﾄﾅｰ</button>
                    <button id="nav-map" class="nav-btn"><span>🗺️</span>ﾏｯﾌﾟ</button>
                </div>
            </div>
        `;
    }

    init() {
        if (window.audioManager) {
            window.audioManager.playBGM('日報.mp3');
        }

        const d = window.gameState.data;
        const dialogueBox = this.element.querySelector('#partner-dialogue');
        
        // Partner Dialogue Dictionary
        const partnerDialogues = {
            "ホタル.png": "お疲れ様。今日一日のあなたの頑張りを、ここに書き留めよう……。無理にたくさん書かなくても大丈夫だからね。",
            "モフリン.png": "もふもふ〜！今日の日報を書いて、今日の冒険を完了するもふ！何があったかお話ししてほしいもふ！",
            "フクロ博士.png": "お疲れ様です。本日の業務の要約を記載し、データをギルドに送信しましょう。振り返りは自身の成長の礎ですぞ。",
            "コダマ.png": "今日も一日本当にお疲れ様！どんな一日だったか、君の言葉で教えて！日報クエスト、一緒にクリアしちゃおう！",
            "ニャンガイド.png": "お疲れニャン。さっさと今日の日報を書いて提出するニャ。そしたらゆっくりゴロゴロ休む時間ニャ！",
            "ポポン.png": "バイタル正常、業務終了です。本日の日報記録インターフェースを起動しました。活動のインプットをお願いします。",
            "ルーン.png": "オッシャァ！今日の日報クエストだな！お前の熱い頑張りをここに書き殴ってくれ！ギルドにばっちり報告してやるぜ！",
            "ぷにょ.png": "……ぷにょ……（にこっ）……きょうの……おしごと……かきかき……しようね……。",
            "ミルフィー.png": "お疲れ様でした！今日も無事に日報提出クエストまでたどり着きましたね！サクッとまとめて報告しちゃいましょう！",
            "クマたろう.png": "よく頑張って乗り切ったな。どんなに小さな出来事でも、お前さんがやったことは立派な支援やで。ゆっくりお書き。",
            "コン.png": "本日の支援記録の入力ですね。簡潔でも問題ありません。各項目に入力を行い、報告書を完成させて送信してください。",
            "わたぼう.jpg": "おつかれさまぁ……。今日はどんなどきどきがあったのぉ……？ゆっくり思い出して書いてみてねぇ……。",
            "えっちゃん.png": "今日もトラブルなく終わったかしら？日報をさっさと提出して、美味しいものでも食べて帰りなさいよ。"
        };

        const partnerFilename = d.partner.split('/').pop();
        const dialogueText = partnerDialogues[partnerFilename] || "今日もお疲れ様！日報を入力してクエストをクリアしよう！";
        dialogueBox.textContent = dialogueText;

        // Navigation Bindings
        const goHome = () => this.sm.changeScene('mainHub');
        const goPartner = () => this.sm.changeScene('partner');
        const goMap = () => this.sm.changeScene('worldMap');
        
        this.element.querySelector('#btn-back').addEventListener('click', goHome);
        this.element.querySelector('#nav-home').addEventListener('click', goHome);
        this.element.querySelector('#nav-partner').addEventListener('click', goPartner);
        this.element.querySelector('#nav-map').addEventListener('click', goMap);
        this.element.querySelector('#nav-battle').addEventListener('click', () => this.sm.changeScene('battle'));
        this.element.querySelector('#nav-shop').addEventListener('click', () => this.sm.changeScene('shop'));
        this.element.querySelector('#nav-quest').addEventListener('click', () => this.sm.changeScene('quest'));

        // Condition Rating selection logic
        let currentRating = 3;
        const stars = this.element.querySelectorAll('.cond-star');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const val = parseInt(star.dataset.val);
                currentRating = val;
                stars.forEach(s => {
                    const sVal = parseInt(s.dataset.val);
                    if (sVal <= val) {
                        s.style.filter = "grayscale(0)";
                    } else {
                        s.style.filter = "grayscale(1)";
                    }
                });
            });
        });

        // Submit logic
        const btnSubmit = this.element.querySelector('#btn-submit-report');
        const reportText = this.element.querySelector('#report-text');

        btnSubmit.addEventListener('click', () => {
            const text = reportText.value.trim();
            if (!text) {
                alert("日報の内容を入力してください！");
                return;
            }

            // Reward sequence!
            if (window.audioManager) {
                window.audioManager.playSE('レベルアップ.mp3'); // Play satisfying level up/reward sound if available
            }

            // Update gamestate
            d.dailyDone = true; // Mark quest as done
            d.exp += 100; // Reward EXP
            d.care += 20; // Reward Care Gold

            // Check level up
            const expNext = window.gameState.expNext;
            if (d.exp >= expNext) {
                d.exp -= expNext;
                d.level += 1;
                alert(`🎉 ギルドレベルアップ！ Lv.${d.level} になりました！`);
            }

            window.gameState.saveData();

            alert(`📝 日報が送信され、ギルド本部に報告されました！\n\n【報酬】\n💎 経験値 +100 EXP\n💰 ケアマネー +20 Care\n\nお疲れ様でした！`);
            
            // Go back to hub
            goHome();
        });
    }
}
