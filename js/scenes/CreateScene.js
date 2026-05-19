class CreateScene extends BaseScene {
    getHtml() {
        return `
            <div style="display:flex; flex-direction:column; height:100%;">
                <div class="header">
                    <h2 id="header-title" style="font-size:18px; color:var(--blue); font-weight:800; margin:0;">冒険の登録</h2>
                </div>
                <div class="content" style="background:var(--bg3); display:flex; flex-direction:column; align-items:center;">
                    
                    <!-- STEP 1: Profile (Name, Facility, Guild, Partner) -->
                    <div id="step-1-container" style="width:100%; max-width:400px;">
                        <p style="margin-bottom: 16px; color:var(--text); font-weight:bold; font-size:14px;">所属とパートナーを設定してください。</p>
                        
                        <div class="card rpg-parchment" style="margin-bottom:20px;">
                            <label style="display:block; margin-bottom:4px; font-size:13px; font-weight:bold;">お名前</label>
                            <input type="text" id="input-name" placeholder="冒険者の名前" style="width:100%; padding:12px; border:3px solid #d97706; border-radius:8px; font-family:inherit; font-weight:bold; outline:none; margin-bottom:16px;">
                        
                            <label style="display:block; margin-bottom:4px; font-size:12px; font-weight:bold;">施設</label>
                            <select id="select-facility" style="width:100%; padding:8px; border:3px solid #d97706; border-radius:8px; font-family:inherit; font-weight:bold; margin-bottom:12px;">
                                <option value="">-- 選択 --</option>
                                <option value="あおぞらホーム">あおぞらホーム</option>
                                <option value="あおぞらワークA">あおぞらワークA</option>
                                <option value="あおぞらワークB">あおぞらワークB</option>
                                <option value="あおぞら就労センター">あおぞら就労センター</option>
                                <option value="あおぞらキッズ">あおぞらキッズ</option>
                                <option value="あおぞらグループホーム">あおぞらグループホーム</option>
                                <option value="あおぞら認知症グループホーム">あおぞら認知症グループホーム</option>
                                <option value="あおぞら相談支援センター">あおぞら相談支援センター</option>
                                <option value="あおぞら発達センター">あおぞら発達センター</option>
                                <option value="あおぞら就業センター">あおぞら就業センター</option>
                                <option value="給食センター">給食センター</option>
                                <option value="法人本部">法人本部</option>
                            </select>

                            <label style="display:block; margin-bottom:4px; font-size:12px; font-weight:bold;">ギルド</label>
                            <select id="select-guild" style="width:100%; padding:8px; border:3px solid #d97706; border-radius:8px; font-family:inherit; font-weight:bold; margin-bottom:12px;">
                                <option value="">-- 選択 --</option>
                                <option value="ヒーラーズギルド">ヒーラーズギルド</option>
                                <option value="ケアラーズギルド">ケアラーズギルド</option>
                                <option value="ワーカーズギルド">ワーカーズギルド</option>
                                <option value="ソーシャルギルド">ソーシャルギルド</option>
                                <option value="チルドレンギルド">チルドレンギルド</option>
                                <option value="シェフズギルド">シェフズギルド</option>
                                <option value="アドミンギルド">アドミンギルド</option>
                            </select>

                            <select id="select-job" style="width:100%; padding:8px; border:3px solid #d97706; border-radius:8px; font-family:inherit; font-weight:bold; display:none;">
                                <option value="">-- 職種を選択 --</option>
                            </select>
                        </div>

                        <div class="card rpg-parchment" style="margin-bottom:20px;">
                            <label style="display:block; margin-bottom:4px; font-size:13px; font-weight:bold;">AIパートナー（13種類から選択）</label>
                            <div style="display:flex; gap:12px; align-items:center;">
                                <img id="preview-partner" src="キャラクターjpg/ホタル.png" style="width:80px; height:80px; object-fit:contain; border-radius:12px; border:3px solid #d97706;">
                                <div style="flex:1;">
                                    <select id="select-partner" style="width:100%; padding:12px; border:3px solid #d97706; border-radius:8px; font-family:inherit; font-weight:bold; outline:none;">
                                        <option value="ホタル.png">1. ホタル（静か・詩的）</option>
                                        <option value="モフリン.png">2. モフリン（ほんわか）</option>
                                        <option value="フクロ博士.png">3. フクロ博士（論理的）</option>
                                        <option value="コダマ.png">4. コダマ（明るく前向き）</option>
                                        <option value="ニャンガイド.png">5. ニャンガイド（直球）</option>
                                        <option value="ポポン.png">6. ポポン（穏やか・科学的）</option>
                                        <option value="ルーン.png">7. ルーン（熱い・情熱的）</option>
                                        <option value="ぷにょ.png">8. ぷにょ（無口・受け入れ）</option>
                                        <option value="ミルフィー.png">9. ミルフィー（元気）</option>
                                        <option value="クマたろう.png">10. クマたろう（どっしり）</option>
                                        <option value="コン.png">11. コン（几帳面・細かい）</option>
                                        <option value="わたぼう.png">12. わたぼう（中立・調整）</option>
                                        <option value="えっちゃん.png">13. えっちゃん（毒舌・優しい）</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button id="btn-next" class="primary" style="width:100%; font-size:18px; padding:16px;">次へ</button>
                    </div>

                    <!-- TRANSITION SCREEN -->
                    <div id="transition-screen" style="display:none; flex-direction:column; align-items:center; justify-content:center; height:100%; width:100%; text-align:center;">
                        <h2 style="color:var(--blue); font-size:24px; font-weight:800; margin-bottom:20px;">次は自身のアバターを設定するよ！</h2>
                        <button id="btn-start-avatar" class="primary" style="font-size:18px; padding:12px 24px;">OK</button>
                    </div>

                    <!-- STEP 2: Avatar Maker -->
                    <div id="step-2-container" style="display:none; width:100%; max-width:400px;">
                        
                        <div class="card rpg-parchment" style="margin-bottom:20px; padding:12px;">
                            <div class="rpg-ribbon">アバター作成</div>
                            
                            <div class="avatar-maker-layout">
                                <div class="avatar-preview-pane">
                                    <img id="preview-avatar" src="キャラクターjpg/男性.png" style="width:100px; height:100px; filter: hue-rotate(0deg);">
                                    <div style="font-size:10px; text-align:center; margin-top:10px; color:#92400e; font-weight:bold;">※詳細パーツシステム<br>準備中</div>
                                </div>
                                
                                <div class="avatar-tabs-pane">
                                    <div class="avatar-tabs">
                                        <div class="avatar-tab-btn active" data-tab="basic">基本</div>
                                        <div class="avatar-tab-btn" data-tab="hair">髪</div>
                                        <div class="avatar-tab-btn" data-tab="face">顔</div>
                                        <div class="avatar-tab-btn" data-tab="other">他</div>
                                    </div>
                                    
                                    <div id="tab-basic" class="tab-content">
                                        <label style="font-size:11px; font-weight:bold;">性別</label>
                                        <select id="av-gender" style="width:100%; padding:4px; margin-bottom:8px; font-family:inherit; border:2px solid #d1d5db; border-radius:4px;"><option>男性</option><option>女性</option><option>その他</option></select>
                                        <label style="font-size:11px; font-weight:bold;">体形</label>
                                        <div class="avatar-options-grid" id="grid-body" style="margin-bottom:8px;"></div>
                                        <label style="font-size:11px; font-weight:bold;">肌色</label>
                                        <div class="color-picker-grid" id="grid-skin"></div>
                                    </div>
                                    
                                    <div id="tab-hair" class="tab-content" style="display:none;">
                                        <label style="font-size:11px; font-weight:bold;">髪型</label>
                                        <div class="avatar-options-grid" id="grid-hair" style="margin-bottom:8px;"></div>
                                        <label style="font-size:11px; font-weight:bold;">髪色 (プレビュー反映)</label>
                                        <input type="range" id="input-hue" min="0" max="360" value="0" style="width:100%; margin-bottom:8px; accent-color:#d97706;">
                                    </div>
                                    
                                    <div id="tab-face" class="tab-content" style="display:none;">
                                        <label style="font-size:11px; font-weight:bold;">顔・輪郭</label>
                                        <div class="avatar-options-grid" id="grid-face" style="margin-bottom:8px;"></div>
                                        <label style="font-size:11px; font-weight:bold;">目</label>
                                        <div class="avatar-options-grid" id="grid-eye" style="margin-bottom:8px;"></div>
                                        <label style="font-size:11px; font-weight:bold;">口</label>
                                        <div class="avatar-options-grid" id="grid-mouth" style="margin-bottom:8px;"></div>
                                    </div>
                                    
                                    <div id="tab-other" class="tab-content" style="display:none;">
                                        <label style="font-size:11px; font-weight:bold;">眉</label>
                                        <div class="avatar-options-grid" id="grid-eyebrow" style="margin-bottom:8px;"></div>
                                        <label style="font-size:11px; font-weight:bold;">鼻</label>
                                        <div class="avatar-options-grid" id="grid-nose" style="margin-bottom:8px;"></div>
                                        <label style="font-size:11px; font-weight:bold;">声質</label>
                                        <div class="avatar-options-grid" id="grid-voice"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button id="btn-finish" class="primary" style="width:100%; font-size:18px; padding:16px; margin-bottom:30px;">冒険の旅へ！</button>
                    </div>

                </div>
            </div>
        `;
    }

    init() {
        // Start Step 1 BGM
        if (window.audioManager) {
            window.audioManager.playBGM('タイトル画面.mp3');
        }

        const step1 = this.element.querySelector('#step-1-container');
        const transition = this.element.querySelector('#transition-screen');
        const step2 = this.element.querySelector('#step-2-container');
        const headerTitle = this.element.querySelector('#header-title');

        // --- STEP 1 LOGIC ---
        const guildJobs = {
            "ヒーラーズギルド": ["看護師", "OT", "ST", "PT", "公認心理師"],
            "ケアラーズギルド": ["介護士", "生活支援員", "サービス管理責任者", "サービス提供責任者"],
            "ワーカーズギルド": ["就労支援員", "サービス管理責任者"],
            "ソーシャルギルド": ["相談員", "相談支援専門員", "就労相談員"],
            "チルドレンギルド": ["保育士", "児童指導員", "児童発達管理責任者"],
            "シェフズギルド": ["管理栄養士", "調理員"],
            "アドミンギルド": ["事務員", "経営管理"]
        };

        const selFacility = this.element.querySelector('#select-facility');
        const selGuild = this.element.querySelector('#select-guild');
        const selJob = this.element.querySelector('#select-job');
        
        selGuild.addEventListener('change', (e) => {
            const g = e.target.value;
            selJob.innerHTML = '<option value="">-- 職種を選択 --</option>';
            if (g && guildJobs[g]) {
                guildJobs[g].forEach(j => selJob.insertAdjacentHTML('beforeend', `<option value="${j}">${j}</option>`));
                selJob.style.display = 'block';
            } else {
                selJob.style.display = 'none';
            }
        });

        const selPartner = this.element.querySelector('#select-partner');
        const prevPartner = this.element.querySelector('#preview-partner');
        selPartner.addEventListener('change', (e) => {
            prevPartner.src = "キャラクターjpg/" + e.target.value;
        });

        // Click Next
        this.element.querySelector('#btn-next').addEventListener('click', () => {
            const name = this.element.querySelector('#input-name').value.trim();
            if (!name) { alert('お名前を入力してください'); return; }
            if (!selFacility.value) { alert('施設を選択してください'); return; }
            if (!selGuild.value) { alert('ギルドを選択してください'); return; }
            if (!selJob.value) { alert('職種を選択してください'); return; }

            step1.style.display = 'none';
            transition.style.display = 'flex';
        });

        // Click OK on Transition
        this.element.querySelector('#btn-start-avatar').addEventListener('click', () => {
            transition.style.display = 'none';
            step2.style.display = 'block';
            headerTitle.textContent = "アバター設定";
            
            // Switch BGM
            if (window.audioManager) {
                window.audioManager.playBGM('選択画面.mp3');
            }
        });

        // --- STEP 2 LOGIC ---
        const tabs = this.element.querySelectorAll('.avatar-tab-btn');
        const contents = this.element.querySelectorAll('.tab-content');
        tabs.forEach(t => {
            t.addEventListener('click', () => {
                tabs.forEach(btn => btn.classList.remove('active'));
                contents.forEach(c => c.style.display = 'none');
                t.classList.add('active');
                this.element.querySelector('#tab-' + t.dataset.tab).style.display = 'block';
            });
        });

        const config = {
            gender: "男性", body: "標準", hair: "ショート", face: "丸顔", skin: "#fef08a",
            eye: "ぱっちり", eyebrow: "普通", nose: "普通", mouth: "スマイル", voice: "明るい"
        };

        const populateGrid = (id, options, key) => {
            const grid = this.element.querySelector(id);
            options.forEach((opt, idx) => {
                const div = document.createElement('div');
                div.className = 'avatar-option';
                if(idx===0) div.classList.add('selected');
                div.textContent = opt;
                div.addEventListener('click', () => {
                    grid.querySelectorAll('.avatar-option').forEach(el => el.classList.remove('selected'));
                    div.classList.add('selected');
                    config[key] = opt;
                });
                grid.appendChild(div);
            });
        };

        populateGrid('#grid-body', ["スリム", "標準", "ぽっちゃり", "がっしり"], "body");
        populateGrid('#grid-hair', ["ショート", "ミディアム", "ロング", "ポニー", "ツイン", "坊主", "パーマ", "オールバック"], "hair");
        populateGrid('#grid-face', ["丸顔", "シャープ", "四角", "たまご"], "face");
        populateGrid('#grid-eye', ["ぱっちり", "たれ目", "つり目", "ジト目", "点", "キリッ"], "eye");
        populateGrid('#grid-mouth', ["スマイル", "ふつう", "への字", "ω"], "mouth");
        populateGrid('#grid-eyebrow', ["普通", "太眉", "細眉", "上がり"], "eyebrow");
        populateGrid('#grid-nose', ["普通", "高め", "低め", "なし"], "nose");
        populateGrid('#grid-voice', ["明るい", "落ち着き", "低め", "高め", "クール", "なし"], "voice");

        const gridSkin = this.element.querySelector('#grid-skin');
        const skinColors = ["#fef08a", "#fde047", "#fca5a5", "#fdba74", "#d97706", "#78350f"];
        skinColors.forEach((color, idx) => {
            const div = document.createElement('div');
            div.className = 'color-swatch';
            div.style.background = color;
            if(idx===0) div.classList.add('selected');
            div.addEventListener('click', () => {
                gridSkin.querySelectorAll('.color-swatch').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
                config.skin = color;
            });
            gridSkin.appendChild(div);
        });

        const selGender = this.element.querySelector('#av-gender');
        const inputHue = this.element.querySelector('#input-hue');
        const preview = this.element.querySelector('#preview-avatar');

        selGender.addEventListener('change', (e) => {
            config.gender = e.target.value;
            if(config.gender === "女性") {
                preview.src = "キャラクターjpg/女性.png";
            } else {
                preview.src = "キャラクターjpg/男性.png";
            }
        });

        inputHue.addEventListener('input', (e) => {
            preview.style.filter = `hue-rotate(${e.target.value}deg)`;
        });

        // Finish
        this.element.querySelector('#btn-finish').addEventListener('click', () => {
            const name = this.element.querySelector('#input-name').value.trim();

            window.gameState.data.facility = selFacility.value;
            window.gameState.data.guild = selGuild.value;
            window.gameState.data.job = selJob.value;
            window.gameState.data.playerName = name;
            window.gameState.data.partner = "キャラクターjpg/" + selPartner.value;
            
            window.gameState.data.avatarBase = (config.gender === "女性") ? "女性.png" : "男性.png";
            window.gameState.data.avatarHue = parseInt(inputHue.value);
            window.gameState.data.avatarConfig = config;

            window.gameState.saveData();
            
            // Go to Hub
            this.sm.changeScene('mainHub');
        });
    }
}
