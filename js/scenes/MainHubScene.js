class MainHubScene extends BaseScene {
    getHtml() {
        const d = window.gameState.data;
        const maxHp = window.gameState.maxHp;
        const maxMp = window.gameState.maxMp;
        const expNext = window.gameState.expNext;
        
        const hpPct = Math.floor((d.hp / maxHp) * 100);
        const mpPct = Math.floor((d.mp / maxMp) * 100);
        const expPct = Math.floor((d.exp / expNext) * 100);

        // Apply saved theme class to background container
        const savedTheme = d.theme || 'default';

        return `
            <div id="main-hub-scene" style="display:flex; flex-direction:column; height:100%; width:100%; position:relative; overflow:hidden;">
                
                <!-- Background Sparkle Effect with Theme Support -->
                <div class="sparkle-bg theme-${savedTheme}"></div>
                <div id="particles-container"></div>
                
                <!-- RPG Wood Panel Header (Top) -->
                <div class="rpg-wood-panel" style="margin: 8px 10px; padding: 10px; z-index: 5;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <div style="font-weight:800; color:#fde68a; font-size:16px; text-shadow:1px 1px 2px #000; line-height:1.2;">
                            ${d.playerName} <span style="font-size:11px; color:#d1d5db;">Lv.${d.level}</span>
                            <div style="font-size:9px; color:#fbbf24; font-weight:normal;">${d.facility} / ${d.job || d.guild}</div>
                        </div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <div style="font-weight:800; font-size:13px; color:#fcd34d; text-shadow:1px 1px 2px #000; text-align:right;">
                                💰${d.care}ケア &nbsp;&nbsp; 💎${d.pt}
                            </div>
                            <button id="btn-settings" style="background:#78350f; border-color:#d97706; box-shadow:none; padding:4px 8px; font-size:11px; color:#fff; border-radius:8px; cursor:pointer; font-weight:bold; margin-left:4px;">⚙️ 設定</button>
                        </div>
                    </div>
                    
                    <div style="display:flex; gap:12px; margin-top:2px;">
                        <div style="flex:1; display:flex; align-items:center; font-size:11px; font-weight:bold; gap:6px;">
                            <span style="width:20px; color:#34d399; text-shadow:1px 1px 1px #000;">HP</span>
                            <div class="status-bar-container" style="border-color:#1e293b; background:#0f172a; height:12px;"><div class="status-bar hp-bar" style="width:${hpPct}%"></div></div>
                            <span style="width:45px; text-align:right; color:#f8fafc; text-shadow:1px 1px 1px #000; font-size:10px;">${d.hp}/${maxHp}</span>
                        </div>
                        <div style="flex:1; display:flex; align-items:center; font-size:11px; font-weight:bold; gap:6px;">
                            <span style="width:20px; color:#60a5fa; text-shadow:1px 1px 1px #000;">MP</span>
                            <div class="status-bar-container" style="border-color:#1e293b; background:#0f172a; height:12px;"><div class="status-bar mp-bar" style="width:${mpPct}%"></div></div>
                            <span style="width:45px; text-align:right; color:#f8fafc; text-shadow:1px 1px 1px #000; font-size:10px;">${d.mp}/${maxMp}</span>
                        </div>
                        <div style="flex:1; display:flex; align-items:center; font-size:11px; font-weight:bold; gap:6px;">
                            <span style="width:25px; color:#fcd34d; text-shadow:1px 1px 1px #000;">EXP</span>
                            <div class="status-bar-container" style="border-color:#1e293b; background:#0f172a; height:12px;"><div class="status-bar exp-bar" style="width:${expPct}%"></div></div>
                            <span style="width:45px; text-align:right; color:#f8fafc; text-shadow:1px 1px 1px #000; font-size:10px;">${d.exp}/${expNext}</span>
                        </div>
                    </div>
                </div>

                <!-- Main Content Area (Horizontal Layout) - Fitted to 1 Viewport -->
                <div class="content" style="padding: 0 10px; display:flex; gap:12px; z-index:5; flex:1; overflow:hidden; margin-bottom: 6px;">
                    
                    <!-- Left Area: Characters (Large, Live Animated) -->
                    <div style="flex:1.2; display:flex; justify-content:center; align-items:flex-end; position:relative; padding-bottom:12px; min-height: 250px;">
                        <!-- Player Avatar (Live breathing) -->
                        <div style="display:flex; flex-direction:column; align-items:center; margin-right:-28px; z-index:2;">
                            <img src="キャラクターjpg/${d.avatarBase}" class="avatar-img avatar-live-anim" style="width:210px; height:210px; filter:hue-rotate(${d.avatarHue}deg) drop-shadow(0 8px 12px rgba(0,0,0,0.5)); margin-bottom: 5px;">
                            <span class="rpg-ribbon" style="margin-top:-16px; z-index:3; padding: 2px 12px; font-size:10px;">Player</span>
                        </div>
                        
                        <!-- AI Partner (Live floating + breathing) -->
                        <div style="display:flex; flex-direction:column; align-items:center; position:relative; z-index:1;">
                            <div id="partner-speech" class="speech-bubble" style="top:-85px; font-size:12px; padding:10px; opacity:0; transition:opacity 0.3s; max-width: 145px; line-height: 1.3;">お疲れ様！今日も頑張ろう！</div>
                            <img id="partner-img" src="${d.partner}" class="partner-img partner-live-anim" style="width:180px; height:180px; filter:drop-shadow(0 8px 12px rgba(0,0,0,0.5)); margin-bottom: 5px;">
                            <span class="rpg-ribbon" style="margin-top:-16px; z-index:3; padding: 2px 12px; font-size:10px; background: linear-gradient(to bottom, #10b981, #047857); border-color:#34d399;">Partner</span>
                        </div>
                    </div>

                    <!-- Right Area: Stats & Quests (Fitted strictly) -->
                    <div style="flex:0.9; display:flex; flex-direction:column; gap:8px; justify-content: space-between;">
                        
                        <!-- Radar Chart -->
                        <div class="rpg-wood-panel" style="display:flex; flex-direction:column; align-items:center; padding: 6px; background:rgba(0,0,0,0.5); border-radius: 8px;">
                            <div style="color:#fde68a; font-weight:800; margin-bottom:4px; text-shadow:1px 1px 2px #000; font-size:11px;">📊 コンピテンシー</div>
                            <div style="background: rgba(0,0,0,0.4); border-radius: 8px; padding: 4px; border: 2px solid #92400e; display:flex; justify-content:center; align-items:center;">
                                <canvas id="radar-canvas" width="160" height="160"></canvas>
                            </div>
                        </div>

                        <!-- Quest List -->
                        <div class="rpg-parchment" style="flex:1; display:flex; flex-direction:column; padding: 8px 12px; border-radius: 12px; position:relative; min-height: 110px;">
                            <div class="rpg-ribbon" style="position:absolute; top:-10px; left:50%; transform:translateX(-50%); background:linear-gradient(to bottom, #3b82f6, #1d4ed8); border-color:#60a5fa; font-size:10px; padding:2px 12px; z-index:4;">📋 デイリークエスト</div>
                            <ul style="list-style:none; font-size:11px; font-weight:bold; margin-top: 10px; flex:1; overflow-y:auto;">
                                <li style="margin-bottom:4px; padding-bottom:3px; border-bottom:1px dashed #b45309;">✅ ログイン <span style="color:#d97706; float:right;">+10EXP</span></li>
                                <li style="margin-bottom:4px; padding-bottom:3px; border-bottom:1px dashed #b45309;">${d.dailyDone ? '✅' : '⬜'} ひとこと日報 <span style="color:#d97706; float:right;">+100EXP</span></li>
                                <li style="margin-bottom:4px; padding-bottom:3px; border-bottom:1px dashed #b45309;">⬜ モンスター討伐 <span style="color:#d97706; float:right;">+80EXP</span></li>
                                <li>⬜ パートナーと話す <span style="color:#d97706; float:right;">+30EXP</span></li>
                            </ul>
                        </div>

                    </div>
                </div>

                <!-- Bottom Nav -->
                <div class="bottom-nav" style="z-index:5; flex-wrap:wrap; gap:2px; padding:4px;">
                    <button class="nav-btn active"><span>🏠</span>ホーム</button>
                    <button id="nav-report" class="nav-btn"><span>📝</span>日報</button>
                    <button id="nav-battle" class="nav-btn"><span>⚔️</span>バトル</button>
                    <button id="nav-friend" class="nav-btn"><span>🤝</span>ﾌﾚﾝﾄﾞ</button>
                    <button id="nav-admin" class="nav-btn"><span>🏢</span>管理者</button>
                    <button id="nav-shop" class="nav-btn"><span>🛒</span>ｼｮｯﾌﾟ</button>
                    <button id="nav-quest" class="nav-btn"><span>📜</span>ｸｴｽﾄ</button>
                    <button id="nav-partner" class="nav-btn"><span>💬</span>ﾊﾟｰﾄﾅｰ</button>
                    <button id="nav-map" class="nav-btn"><span>🗺️</span>ﾏｯﾌﾟ</button>
                </div>

                <!-- ⚙️ SETTINGS MODAL OVERLAY -->
                <div id="settings-modal" class="modal-overlay">
                    <div class="modal-content rpg-parchment settings-modal" style="text-align:left; background:#fff; border:4px solid #d97706; padding:16px; border-radius:16px;">
                        <div style="font-size:18px; font-weight:800; color:#b45309; text-align:center; border-bottom:2px dashed #b45309; padding-bottom:8px; margin-bottom:12px;">⚙️ 設定メニュー</div>
                        
                        <div style="display:flex; flex-direction:column; gap:12px;">
                            <!-- Avatar reset customizer -->
                            <div>
                                <label style="font-size:12px; font-weight:bold; color:#78350f;">👤 アバター設定:</label>
                                <button id="btn-settings-avatar" style="width:100%; padding:8px; font-size:12px; background:#fef3c7; border-color:#d97706; margin-top:4px;">アバターのカスタマイズ画面に戻る</button>
                            </div>

                            <!-- AI Partner select -->
                            <div>
                                <label style="font-size:12px; font-weight:bold; color:#78350f;">🤝 AIパートナーの変更:</label>
                                <select id="settings-select-partner" style="width:100%; padding:8px; border:2px solid #d97706; border-radius:8px; font-family:inherit; font-weight:bold; font-size:12px; margin-top:4px; outline:none;">
                                    <option value="キャラクターjpg/ホタル.png">1. ホタル（静か・詩的）</option>
                                    <option value="キャラクターjpg/モフリン.png">2. モフリン（ほんわか）</option>
                                    <option value="キャラクターjpg/フクロ博士.png">3. フクロ博士（論理的）</option>
                                    <option value="キャラクターjpg/コダマ.png">4. コダマ（明るく前向き）</option>
                                    <option value="キャラクターjpg/ニャンガイド.png">5. ニャンガイド（直球）</option>
                                    <option value="キャラクターjpg/ポポン.png">6. ポポン（穏やか・科学的）</option>
                                    <option value="キャラクターjpg/ルーン.png">7. ルーン（熱い・情熱的）</option>
                                    <option value="キャラクターjpg/ぷにょ.png">8. ぷにょ（無口・受け入れ）</option>
                                    <option value="キャラクターjpg/ミルフィー.png">9. ミルフィー（元気）</option>
                                    <option value="キャラクターjpg/クマたろう.png">10. クマたろう（どっしり）</option>
                                    <option value="キャラクターjpg/コン.png">11. コン（几帳面・細かい）</option>
                                    <option value="キャラクターjpg/わたぼう.png">12. わたぼう（中立・調整）</option>
                                    <option value="キャラクターjpg/えっちゃん.png">13. えっちゃん（毒舌・優しい）</option>
                                </select>
                            </div>

                            <!-- Font Size selector -->
                            <div>
                                <label style="font-size:12px; font-weight:bold; color:#78350f;">🔤 文字の大きさ:</label>
                                <div style="display:flex; gap:6px; margin-top:4px;">
                                    <button class="btn-settings-font" data-size="small" style="flex:1; padding:6px; font-size:11px; border-color:#9ca3af; box-shadow:none;">小</button>
                                    <button class="btn-settings-font" data-size="medium" style="flex:1; padding:6px; font-size:11px; border-color:#d97706; background:#fde047; box-shadow:none;">中</button>
                                    <button class="btn-settings-font" data-size="large" style="flex:1; padding:6px; font-size:11px; border-color:#9ca3af; box-shadow:none;">大</button>
                                </div>
                            </div>

                            <!-- Volume slider -->
                            <div>
                                <label style="font-size:12px; font-weight:bold; color:#78350f; display:flex; justify-content:space-between;">
                                    🔊 音量調節: <span id="volume-val-display">80%</span>
                                </label>
                                <input type="range" id="settings-volume-slider" min="0" max="100" value="80" style="width:100%; margin-top:6px; accent-color:#d97706; cursor:pointer;">
                            </div>

                            <!-- Language picker (multilingual support) -->
                            <div>
                                <label style="font-size:12px; font-weight:bold; color:#78350f;">🌐 言語 (Language):</label>
                                <select id="settings-select-lang" style="width:100%; padding:8px; border:2px solid #d97706; border-radius:8px; font-family:inherit; font-weight:bold; font-size:12px; margin-top:4px; outline:none;">
                                    <option value="ja">日本語 (Japanese)</option>
                                    <option value="en">English (英語)</option>
                                    <option value="zh-tw">繁體中文 (Traditional Chinese)</option>
                                    <option value="zh-cn">简体中文 (Simplified Chinese)</option>
                                    <option value="vi">Tiếng Việt (Vietnamese)</option>
                                </select>
                            </div>

                            <!-- suggestion 1: Background Theme selection -->
                            <div>
                                <label style="font-size:12px; font-weight:bold; color:#78350f;">🎨 背景テーマの変更:</label>
                                <div style="display:flex; gap:6px; margin-top:4px;">
                                    <button class="btn-settings-theme" data-theme="default" style="flex:1; padding:6px; font-size:10px; background:#fbcfe8; border-color:#f472b6; box-shadow:none; font-weight:bold;">青空</button>
                                    <button class="btn-settings-theme" data-theme="dark" style="flex:1; padding:6px; font-size:10px; background:#1e293b; color:#fff; border-color:#38bdf8; box-shadow:none; font-weight:bold;">夜間</button>
                                    <button class="btn-settings-theme" data-theme="forest" style="flex:1; padding:6px; font-size:10px; background:#a7f3d0; border-color:#34d399; box-shadow:none; font-weight:bold;">森林</button>
                                </div>
                            </div>

                            <!-- suggestion 2: Jukebox BGM selection -->
                            <div>
                                <label style="font-size:12px; font-weight:bold; color:#78350f;">🎵 BGM変更 (ジュークボックス):</label>
                                <select id="settings-select-bgm" style="width:100%; padding:8px; border:2px solid #d97706; border-radius:8px; font-family:inherit; font-weight:bold; font-size:12px; margin-top:4px; outline:none;">
                                    <option value="ステータス画面.mp3">ステータス画面 BGM</option>
                                    <option value="タイトル画面.mp3">タイトル画面 BGM</option>
                                    <option value="ワールドマップ.mp3">ワールドマップ BGM</option>
                                    <option value="日報.mp3">日報画面 BGM</option>
                                    <option value="選択画面.mp3">選択画面 BGM</option>
                                </select>
                            </div>
                        </div>

                            <!-- Export / Import Save Data -->
                            <div style="border-top:1px dashed #d97706; margin-top:8px; padding-top:8px;">
                                <label style="font-size:12px; font-weight:bold; color:#78350f;">💾 セーブデータ管理:</label>
                                <div style="display:flex; gap:6px; margin-top:6px;">
                                    <button id="btn-export-save" style="flex:1; padding:8px; font-size:11px; background:#1d4ed8; border-color:#3b82f6; color:#fff; box-shadow:none; border-radius:8px; font-weight:bold;">⬇️ エクスポート</button>
                                    <button id="btn-import-save" style="flex:1; padding:8px; font-size:11px; background:#065f46; border-color:#34d399; color:#fff; box-shadow:none; border-radius:8px; font-weight:bold;">⬆️ インポート</button>
                                </div>
                                <input type="file" id="import-file-input" accept=".json" style="display:none;">
                                <div style="font-size:10px; color:#78350f; margin-top:4px;">※エクスポートしたJSONファイルを別端末でインポートできます</div>
                            </div>
                            
                            <!-- Developer Tool: Admin Toggle -->
                            <div style="border-top:2px solid #ef4444; margin-top:8px; padding-top:8px;">
                                <label style="font-size:12px; font-weight:bold; color:#b91c1c;">🛠️ 管理者テスト (デモ用):</label>
                                <div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
                                    <input type="checkbox" id="settings-toggle-admin" style="width:16px; height:16px; cursor:pointer;">
                                    <span style="font-size:11px; font-weight:bold; color:#1e293b;">管理者モード（本部/施設長権限）にする</span>
                                </div>
                            </div>
                        
                        <button id="btn-close-settings" style="width:100%; padding:10px; font-size:14px; margin-top:16px; background:#ef4444; border-color:#b91c1c; color:#fff; box-shadow:none;">閉じる</button>
                    </div>
                </div>

            </div>
        `;
    }

    init() {
        const d = window.gameState.data;
        if (window.audioManager) {
            window.audioManager.playBGM(d.currentBgmTrack || 'ステータス画面.mp3');
        }

        // Apply saved font size if exists
        if (d.fontSize) {
            document.getElementById('app').className = 'font-' + d.fontSize;
        }

        // Generate Sparkle Particles
        const pContainer = this.element.querySelector('#particles-container');
        for(let i=0; i<20; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = Math.random() * 100 + '%';
            p.style.width = Math.random() * 3 + 2 + 'px';
            p.style.height = p.style.width;
            p.style.animationDelay = Math.random() * 4 + 's';
            p.style.animationDuration = Math.random() * 3 + 3 + 's';
            pContainer.appendChild(p);
        }

        // Partner Interactive Speech Bubbles (personality specific)
        const partnerImg = this.element.querySelector('#partner-img');
        const partnerSpeech = this.element.querySelector('#partner-speech');
        const partnerName = d.partner.split('/').pop().replace('.png', '');
        
        const reactions = {
            "ホタル": ["静かで落ち着く時間だね……。", "無理しちゃだめだよ……？", "何か私でお役に立てるかな……。", "いつも頑張ってて素敵……。"],
            "モフリン": ["もふもふ〜！ハッピーもふ！", "おやつもふ？休憩もふ？", "がんばってるお顔、大好きもふ！", "ぎゅーっとしてあげるもふ！"],
            "フクロ博士": ["本日の調子は良好ですか？", "適度なインターバルを挟んでください。", "支援技術の向上が期待できますな。", "データはしっかり保存済みです！"],
            "コダマ": ["今日も一緒で嬉しいな！", "君の笑顔が一番の回復薬だよ！", "疲れたら、深呼吸しよ！", "ファイト！君ならできるよ！"],
            "ニャンガイド": ["なにか用かニャ？おやつニャ？", "ダラダラするのも支援のコツニャ！", "真面目すぎると息が詰まるニャ！", "いいから撫でるニャー！"],
            "ポポン": ["生体電位安定。良好です。", "BGM周波数のリラックス効果判定中。", "日報クエストは完了ですか？", "適度な水分を補給してください。"],
            "ルーン": ["オウ！滾ってきたぜッ！", "どんな困難も突破してやる！", "あんたのパッションは最高だ！", "飯をしっかり食って強くなれ！"],
            "ぷにょ": ["ぷにょぷにょ〜！", "ぷにっ？（首を傾げている）", "（ぷにょは幸せそうに揺れている）", "ぷにー！"],
            "ミルフィー": ["お疲れ様ですっ！ハイテンション！", "応援のミルフィーパンチですっ！", "今日もギルドに貢献しちゃいましょ！", "ハッピー＆ラッキーですよ！"],
            "クマたろう": ["おお、頑張っとるな。", "肩の力を抜いてええんやで。", "疲れたらいつでも言いや。", "お前さんは本当によくやってる。"],
            "コン": ["本日の業務、整理整頓ですね。", "優先順位を立てて進めましょう。", "適度な休憩は作業効率を高めます。", "何かお手伝いはありますか？"],
            "わたぼう": ["のんびりぃ、いこうねぇ……。", "ふわふわの毛で包むよぉ……。", "がんばりやさんだねぇ……。", "おつかれさまぁ……ふわぁ……。"],
            "えっちゃん": ["フン、まあ頑張りなさいよ。", "あんた、無理して倒れないでよね！", "私がいなきゃ何にもできないんだから。", "ちょっとは私に感謝しなさいよね！"]
        };

        const personalSpeech = reactions[partnerName] || ["お疲れ様！今日も頑張ろう！", "何か手伝えることはある？"];

        partnerImg.addEventListener('click', () => {
            const randomMsg = personalSpeech[Math.floor(Math.random() * personalSpeech.length)];
            partnerSpeech.textContent = randomMsg;
            partnerSpeech.style.opacity = '1';
            
            setTimeout(() => {
                partnerSpeech.style.opacity = '0';
            }, 3000);
        });

        // Navigation Bindings
        this.element.querySelector('#nav-map').addEventListener('click', () => {
            this.sm.changeScene('worldMap');
        });
        this.element.querySelector('#nav-report').addEventListener('click', () => {
            this.sm.changeScene('report');
        });
        this.element.querySelector('#nav-partner').addEventListener('click', () => {
            this.sm.changeScene('partner');
        });
        this.element.querySelector('#nav-battle').addEventListener('click', () => {
            this.sm.changeScene('battle');
        });
        this.element.querySelector('#nav-shop').addEventListener('click', () => {
            this.sm.changeScene('shop');
        });
        this.element.querySelector('#nav-quest').addEventListener('click', () => {
            this.sm.changeScene('quest');
        });
        
        // New features binding
        this.element.querySelector('#nav-friend').addEventListener('click', () => {
            this.sm.changeScene('friend');
        });

        const btnAdmin = this.element.querySelector('#nav-admin');
        const updateAdminButtonState = () => {
            if (!d.isAdmin) {
                btnAdmin.style.opacity = '0.4';
                btnAdmin.style.filter = 'grayscale(100%)';
                btnAdmin.style.pointerEvents = 'none';
                btnAdmin.onclick = null;
            } else {
                btnAdmin.style.opacity = '1';
                btnAdmin.style.filter = 'none';
                btnAdmin.style.pointerEvents = 'auto';
                btnAdmin.onclick = () => this.sm.changeScene('admin');
            }
        };
        // Initial setup for admin button
        updateAdminButtonState();

        // Settings Modal Open/Close Logic
        const modal = this.element.querySelector('#settings-modal');
        const btnSettings = this.element.querySelector('#btn-settings');
        const btnCloseSettings = this.element.querySelector('#btn-close-settings');

        btnSettings.addEventListener('click', () => {
            modal.classList.add('active');
            
            // Sync current values in form
            this.element.querySelector('#settings-select-partner').value = d.partner;
            this.element.querySelector('#settings-volume-slider').value = Math.round((window.audioManager.maxVolume || 0.8) * 100);
            this.element.querySelector('#volume-val-display').textContent = Math.round((window.audioManager.maxVolume || 0.8) * 100) + '%';
            this.element.querySelector('#settings-select-lang').value = d.lang || 'ja';
            this.element.querySelector('#settings-select-bgm').value = d.currentBgmTrack || 'ステータス画面.mp3';
            
            // Sync Admin toggle
            this.element.querySelector('#settings-toggle-admin').checked = !!d.isAdmin;

            // Highlight active font size button
            const activeFontSize = d.fontSize || 'medium';
            this.element.querySelectorAll('.btn-settings-font').forEach(btn => {
                if (btn.dataset.size === activeFontSize) {
                    btn.style.background = '#fde047';
                    btn.style.borderColor = '#d97706';
                } else {
                    btn.style.background = '#f3f4f6';
                    btn.style.borderColor = '#9ca3af';
                }
            });

            // Highlight active background theme button
            const activeTheme = d.theme || 'default';
            this.element.querySelectorAll('.btn-settings-theme').forEach(btn => {
                if (btn.dataset.theme === activeTheme) {
                    btn.style.boxShadow = '0 0 0 3px #fbbf24';
                } else {
                    btn.style.boxShadow = 'none';
                }
            });
        });

        btnCloseSettings.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // 1. Settings - Avatar customizer transition
        this.element.querySelector('#btn-settings-avatar').addEventListener('click', () => {
            modal.classList.remove('active');
            this.sm.changeScene('create');
        });

        // 2. Settings - AI Partner selector update
        const settingsSelectPartner = this.element.querySelector('#settings-select-partner');
        settingsSelectPartner.addEventListener('change', (e) => {
            d.partner = e.target.value;
            window.gameState.saveData();
            
            // Update partner images immediately on main screen
            const mainPartnerImg = this.element.querySelector('#partner-img');
            mainPartnerImg.src = d.partner;

            // Trigger reactive speech change
            const newName = d.partner.split('/').pop().replace('.png', '');
            partnerSpeech.textContent = `${newName}「新しくあなたのパートナーになったよ！よろしくね！」`;
            partnerSpeech.style.opacity = '1';
            setTimeout(() => { partnerSpeech.style.opacity = '0'; }, 3500);
        });

        // 3. Settings - Font Size Adjuster
        this.element.querySelectorAll('.btn-settings-font').forEach(btn => {
            btn.addEventListener('click', () => {
                const size = btn.dataset.size;
                d.fontSize = size;
                window.gameState.saveData();

                // Apply globally to index.html #app
                document.getElementById('app').className = 'font-' + size;

                // Sync button UI inside modal
                this.element.querySelectorAll('.btn-settings-font').forEach(b => {
                    if (b.dataset.size === size) {
                        b.style.background = '#fde047';
                        b.style.borderColor = '#d97706';
                    } else {
                        b.style.background = '#f3f4f6';
                        b.style.borderColor = '#9ca3af';
                    }
                });
            });
        });

        // 4. Settings - Volume Slider Control
        const volSlider = this.element.querySelector('#settings-volume-slider');
        const volDisplay = this.element.querySelector('#volume-val-display');
        volSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            volDisplay.textContent = val + '%';
            window.audioManager.setVolume(val / 100);
        });

        // 5. Settings - Language Picker (multilingual mode)
        const selectLang = this.element.querySelector('#settings-select-lang');
        selectLang.addEventListener('change', (e) => {
            const lang = e.target.value;
            d.lang = lang;
            window.gameState.saveData();
            
            if (lang !== 'ja') {
                alert(`🌐 Multilingual System Alert:\nLanguage set to "${lang.toUpperCase()}". Translation packages are now loading in the background (Demo Mode).`);
            }
        });

        // 6. Suggestion 1 - Theme Background changer
        this.element.querySelectorAll('.btn-settings-theme').forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                d.theme = theme;
                window.gameState.saveData();

                // Update background sparkle container class immediately
                const bgSparkle = this.element.querySelector('.sparkle-bg');
                bgSparkle.className = 'sparkle-bg theme-' + theme;

                // Sync highlights
                this.element.querySelectorAll('.btn-settings-theme').forEach(b => {
                    if (b.dataset.theme === theme) {
                        b.style.boxShadow = '0 0 0 3px #fbbf24';
                    } else {
                        b.style.boxShadow = 'none';
                    }
                });
            });
        });

        // 7. Suggestion 2 - BGM Selector jukebox
        const selectBgm = this.element.querySelector('#settings-select-bgm');
        selectBgm.addEventListener('change', (e) => {
            const bgmFile = e.target.value;
            d.currentBgmTrack = bgmFile;
            window.gameState.saveData();
            
            if (window.audioManager) {
                window.audioManager.playBGM(bgmFile);
            }
        });

        // 8. Export save data as JSON
        this.element.querySelector('#btn-export-save').addEventListener('click', () => {
            const json = JSON.stringify(window.gameState.data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'wellquest_save.json';
            a.click();
            URL.revokeObjectURL(url);
            alert('✅ セーブデータをwellquest_save.jsonとしてダウンロードしました！');
        });

        // 9. Import save data from JSON
        const importFileInput = this.element.querySelector('#import-file-input');
        this.element.querySelector('#btn-import-save').addEventListener('click', () => {
            importFileInput.click();
        });
        importFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const parsed = JSON.parse(ev.target.result);
                    if (!parsed.playerName) throw new Error('Invalid save file');
                    window.gameState.data = parsed;
                    window.gameState.saveData();
                    alert('✅ インポート完了！「' + parsed.playerName + '」のデータを読み込みました。画面を再読み込みします。');
                    this.sm.changeScene('mainHub');
                } catch(err) {
                    alert('❌ インポートに失敗しました。正しいWELL QUESTのセーブファイルを選択してください。');
                }
            };
            reader.readAsText(file);
        });

        // 10. Admin Toggle logic
        const chkAdmin = this.element.querySelector('#settings-toggle-admin');
        chkAdmin.addEventListener('change', (e) => {
            d.isAdmin = e.target.checked;
            window.gameState.saveData();
            updateAdminButtonState();
            if (d.isAdmin) {
                alert('管理者モードをONにしました！\n本部/施設長権限として「管理者」ボタンが利用可能です。');
            } else {
                alert('管理者モードをOFFにしました。\n一般職員として「管理者」ボタンはグレーアウトします。');
            }
        });

        // Draw radar chart
        this.drawRadarChart();
    }

    drawRadarChart() {
        const canvas = this.element.querySelector('#radar-canvas');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        const stats = window.gameState.data.stats;
        
        const labels = Object.keys(stats);
        const values = Object.values(stats);
        const maxVal = 100;
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 45; // custom radius scaled down to fit 160x160 beautifully
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background grid (Hexagon)
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = 1.2;
        for (let i = 1; i <= 4; i++) {
            ctx.beginPath();
            const r = radius * (i / 4);
            for (let j = 0; j < 6; j++) {
                const angle = (Math.PI * 2 / 6) * j - Math.PI / 2;
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);
                if (j === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }
        
        // Draw axis lines
        for (let j = 0; j < 6; j++) {
            const angle = (Math.PI * 2 / 6) * j - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        
        // Draw values
        ctx.beginPath();
        for (let j = 0; j < 6; j++) {
            const val = values[j] / maxVal;
            const angle = (Math.PI * 2 / 6) * j - Math.PI / 2;
            const r = radius * val;
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);
            if (j === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = "rgba(250, 204, 21, 0.45)"; // Gold fill
        ctx.fill();
        ctx.strokeStyle = "#fde047";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Draw points and labels
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        for (let j = 0; j < 6; j++) {
            const angle = (Math.PI * 2 / 6) * j - Math.PI / 2;
            // Point
            const val = values[j] / maxVal;
            const px = centerX + (radius * val) * Math.cos(angle);
            const py = centerY + (radius * val) * Math.sin(angle);
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fillStyle = "#fff";
            ctx.fill();
            ctx.strokeStyle = "#ca8a04";
            ctx.lineWidth = 1.5;
            ctx.stroke();
            
            // Label
            const lx = centerX + (radius + 15) * Math.cos(angle);
            const ly = centerY + (radius + 10) * Math.sin(angle);
            ctx.fillStyle = "#fefce8";
            ctx.font = "bold 9px 'M PLUS Rounded 1c'";
            
            ctx.shadowColor = "black";
            ctx.shadowBlur = 3;
            ctx.fillText(labels[j], lx, ly);
            ctx.shadowBlur = 0;
        }
    }
}
