class BattleScene extends BaseScene {
    getHtml() {
        const d = window.gameState.data;
        const maxHp = window.gameState.maxHp;
        const maxMp = window.gameState.maxMp;
        const pName = d.partner ? d.partner.split('/').pop().replace(/\.(png|jpg|jpeg)$/i, '') : 'パートナー';

        return `
            <style>
                /* Premium Battle Styles */
                @keyframes floatBob {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-8px) rotate(1deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                @keyframes breathe {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.03); }
                    100% { transform: scale(1); }
                }
                @keyframes damageFlash {
                    0% { background: rgba(239, 68, 68, 0); }
                    50% { background: rgba(239, 68, 68, 0.4); }
                    100% { background: rgba(239, 68, 68, 0); }
                }
                @keyframes healGlow {
                    0% { box-shadow: 0 0 0 rgba(16, 185, 129, 0); }
                    50% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.8); }
                    100% { box-shadow: 0 0 0 rgba(16, 185, 129, 0); }
                }
                @keyframes shieldBarrier {
                    0% { border-color: rgba(59, 130, 246, 0.3); box-shadow: inset 0 0 0 rgba(59, 130, 246, 0); }
                    50% { border-color: rgba(59, 130, 246, 1); box-shadow: inset 0 0 20px rgba(59, 130, 246, 0.4); }
                    100% { border-color: rgba(59, 130, 246, 0.3); box-shadow: inset 0 0 0 rgba(59, 130, 246, 0); }
                }
                
                .float-anim {
                    animation: floatBob 3s ease-in-out infinite;
                }
                .breathe-anim {
                    animation: breathe 3.5s ease-in-out infinite;
                }
                .battle-flash {
                    animation: damageFlash 0.4s ease-out;
                }
                .heal-glow-active {
                    animation: healGlow 0.8s ease-in-out;
                }
                .shield-active {
                    animation: shieldBarrier 1.5s linear infinite;
                    border: 3px solid rgba(59, 130, 246, 0.8) !important;
                }
                
                /* DQ-Style Retro Combat Choice buttons */
                .battle-choice-btn {
                    width: 100%;
                    padding: 5px 8px;
                    font-size: 10px;
                    font-weight: 800;
                    text-align: left;
                    line-height: 1.25;
                    background: #0b0f2c;
                    border: 2px double #d97706;
                    border-radius: 6px;
                    cursor: pointer;
                    color: #ffffff;
                    font-family: inherit;
                    transition: all 0.15s;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.5);
                    position: relative;
                    white-space: normal;
                    word-wrap: break-word;
                    height: auto;
                }
                .battle-choice-btn::before {
                    content: "▶";
                    margin-right: 6px;
                    opacity: 0;
                    transition: opacity 0.15s;
                }
                .battle-choice-btn:hover:not(:disabled) {
                    background: #1e1b4b;
                    border-color: #fbbf24;
                    color: #fde68a;
                    transform: scale(1.015);
                }
                .battle-choice-btn:hover:not(:disabled)::before {
                    opacity: 1;
                }
                .battle-choice-btn:active:not(:disabled) {
                    transform: scale(1);
                }
                .battle-choice-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                .skill-btn {
                    flex: 1;
                    padding: 8px 4px;
                    font-size: 10px;
                    font-weight: bold;
                    background: linear-gradient(to bottom, #3b82f6, #1d4ed8);
                    border: 2px solid #60a5fa;
                    border-radius: 8px;
                    color: white;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: center;
                }
                .skill-btn:hover:not(:disabled) {
                    background: linear-gradient(to bottom, #60a5fa, #2563eb);
                    box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
                }
                .skill-btn:disabled {
                    background: #6b7280;
                    border-color: #9ca3af;
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                
                .overlay-flash {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    pointer-events: none;
                    z-index: 99;
                    background: transparent;
                }
                
                /* Pokémon-Style Arena and Status Styles */
                .pokemon-battlefield {
                    flex: 1;
                    min-height: 160px;
                    position: relative;
                    background: linear-gradient(to bottom, #7dd3fc, #bae6fd, #e2e8f0);
                    border-bottom: 4px solid #1e293b;
                    overflow: hidden;
                }
                .pokemon-base-enemy {
                    position: absolute;
                    left: 70%;
                    transform: translateX(-50%);
                    bottom: 5px;
                    width: 180px;
                    height: 48px;
                    background: rgba(16, 185, 129, 0.45);
                    border-radius: 50%;
                    border: 2px solid #059669;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                .pokemon-base-player {
                    position: absolute;
                    left: 30%;
                    transform: translateX(-50%);
                    bottom: 5px;
                    width: 220px;
                    height: 60px;
                    background: rgba(52, 211, 153, 0.6);
                    border-radius: 50%;
                    border: 3px solid #10b981;
                    box-shadow: 0 6px 8px rgba(0,0,0,0.15);
                }
                .pokemon-status-plate {
                    background: #f8fafc;
                    border: 3px solid #334155;
                    box-shadow: 3px 3px 0 #1e293b;
                    padding: 6px 10px;
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                    z-index: 10;
                }
                .pokemon-status-plate.enemy-plate {
                    position: absolute;
                    right: 10px;
                    top: 10px;
                    width: 150px;
                    border-radius: 12px 0 12px 0;
                }
                .pokemon-status-plate.player-plate {
                    position: absolute;
                    left: 10px;
                    top: 10px;
                    width: 160px;
                    border-radius: 0 12px 0 12px;
                }
            </style>

            <div id="battle-scene" style="display:flex; flex-direction:column; height:100%; width:100%; position:relative; overflow:hidden; background: linear-gradient(135deg, #0f172a, #1e1b4b, #311042);">
                <!-- Combat Overlay Flash container -->
                <div id="combat-flash" class="overlay-flash"></div>

                <!-- Background Sparkle Effect -->
                <div class="sparkle-bg"></div>
                
                <!-- Header (Wood Panel) -->
                <div class="rpg-wood-panel" style="margin: 8px 10px; padding: 10px; z-index: 5;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <button id="btn-run-battle" style="padding:6px 12px; font-size:11px; background:#ef4444; border-color:#b91c1c; color:#fff; font-weight:bold;">🏃 逃げる</button>
                        <h2 style="font-size:16px; color:#fde68a; font-weight:800; margin:0; text-shadow:1px 1px 2px #000;">⚔️ メンタルバトル ⚔️</h2>
                        <div style="font-weight:800; font-size:11px; color:#fcd34d; text-shadow:1px 1px 2px #000;">
                            💖ケア: ${d.care} &nbsp;&nbsp; 🪙コイン: ${d.pt}
                        </div>
                    </div>
                </div>

                <!-- Pokémon-Style Battlefield Area (Upper Half) -->
                <div class="pokemon-battlefield">
                    <!-- Grassy combat base platforms -->
                    <div class="pokemon-base-enemy"></div>
                    <div class="pokemon-base-player"></div>

                    <!-- 1. RIGHT-BOTTOM: Enemy Status Plate -->
                    <div class="pokemon-status-plate enemy-plate">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span id="enemy-name" style="font-weight:800; color:#1e293b; font-size:11px;">出現したストレス</span>
                            <span style="font-size:9px; font-weight:bold; color:#b45309;"></span>
                        </div>
                        <div style="display:flex; align-items:center; gap:4px;">
                            <span style="font-size:8px; font-weight:bold; background:#ef4444; color:#fff; padding:1px 3px; border-radius:3px;">体力</span>
                            <div class="status-bar-container" style="border:2px solid #1e293b; background:#64748b; height:9px; flex:1; border-radius:4px; overflow:hidden;">
                                <div id="enemy-hp-bar" class="status-bar hp-bar" style="width:100%; background:#22c55e; height:100%; transition:width 0.3s ease;"></div>
                            </div>
                        </div>
                        <div style="font-size:9px; text-align:right; color:#475569; font-weight:bold;" id="enemy-hp-text">100/100</div>
                    </div>

                    <!-- 2. RIGHT: Enemy Sprite -->
                    <div style="position:absolute; left:70%; transform: translateX(-50%); bottom:15px; width:180px; display:flex; flex-direction:column; justify-content:flex-end; align-items:center; z-index:5;">
                        <img id="enemy-img" src="キャラクターjpg/バーンアウト魔王.png" class="float-anim" style="max-width:140px; max-height:140px; object-fit:contain; filter:drop-shadow(0 6px 8px rgba(0,0,0,0.35));">
                        <span id="enemy-sprite-name" style="font-size:8px; background:rgba(0,0,0,0.6); color:#fff; padding:1px 6px; border-radius:4px; font-weight:bold; margin-top:4px; z-index:5;">出現したストレス</span>
                    </div>

                    <!-- 3. LEFT: Self / Player + Support -->
                    <div id="player-battle-box" style="position:absolute; left:30%; transform: translateX(-50%); bottom:8px; display:flex; align-items:flex-end; gap:6px; z-index:10;">
                        <!-- Player Sprite -->
                        <div style="display:flex; flex-direction:column; align-items:center;">
                            <img id="player-avatar-img" src="キャラクターjpg/${d.avatarBase}" class="avatar-live-anim breathe-anim" style="width:100px; height:100px; object-fit:contain; filter:hue-rotate(${d.avatarHue}deg) drop-shadow(0 8px 12px rgba(0,0,0,0.4)); transform:scaleX(-1);">
                            <span style="font-size:8px; background:rgba(0,0,0,0.6); color:#fff; padding:1px 6px; border-radius:4px; font-weight:bold; margin-top:-6px; z-index:5;">${d.playerName}</span>
                        </div>
                        <!-- Support AI partner next to player -->
                        <div style="display:flex; flex-direction:column; align-items:center;">
                            <img id="partner-battle-img" src="${d.partner}" class="partner-live-anim breathe-anim" style="width:65px; height:65px; object-fit:contain; filter:drop-shadow(0 6px 10px rgba(0,0,0,0.3)); margin-bottom:5px;">
                            <span style="font-size:7px; background:rgba(16,185,129,0.8); color:#fff; padding:1px 4px; border-radius:3px; font-weight:bold; margin-top:-4px; z-index:5;">${pName}</span>
                        </div>
                    </div>

                    <!-- 4. LEFT-TOP: Player Status Plate -->
                    <div class="pokemon-status-plate player-plate">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-weight:800; color:#15803d; font-size:11px;">${d.playerName}</span>
                            <span style="font-size:9px; font-weight:bold; color:#16a34a;">レベル${d.level || 1}</span>
                        </div>
                        <!-- HP -->
                        <div style="display:flex; align-items:center; gap:4px;">
                            <span style="font-size:8px; font-weight:bold; background:#22c55e; color:#fff; padding:1px 3px; border-radius:3px;">体力</span>
                            <div class="status-bar-container" style="border:2px solid #1e293b; background:#64748b; height:9px; flex:1; border-radius:4px; overflow:hidden;">
                                <div id="player-hp-bar" class="status-bar hp-bar" style="width:100%; background:#22c55e; height:100%; transition:width 0.3s ease;"></div>
                            </div>
                        </div>
                        <!-- MP -->
                        <div style="display:flex; align-items:center; gap:4px;">
                            <span style="font-size:8px; font-weight:bold; background:#3b82f6; color:#fff; padding:1px 3px; border-radius:3px;">気力</span>
                            <div class="status-bar-container" style="border:2px solid #1e293b; background:#64748b; height:9px; flex:1; border-radius:4px; overflow:hidden;">
                                <div id="player-mp-bar" class="status-bar mp-bar" style="width:100%; background:#3b82f6; height:100%; transition:width 0.3s ease;"></div>
                            </div>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center; font-size:9px; font-weight:bold; color:#475569;">
                            <div style="display:flex; gap:4px;">
                                <span id="shield-badge" style="display:none; color:#3b82f6;">🛡️ シールド</span>
                                <span id="listen-badge" style="display:none; color:#ca8a04;">👂 傾聴中</span>
                            </div>
                            <div style="margin-left:auto;">
                                体力: <span id="player-hp-text">80/100</span> &nbsp;&nbsp;
                                気力: <span id="player-mp-text">55/100</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bottom Panel Dashboard (Dialogue & Skills Left / Combat Choices Right) -->
                <div style="display:flex; padding:6px; gap:8px; background:#475569; border-top:4px solid #1e293b; z-index:5; flex:1.7; overflow:visible; margin-bottom:4px;">
                    
                    <!-- LEFT COLUMN: Battle Dialog Log & MP Skills -->
                    <div style="width:45%; display:flex; flex-direction:column; gap:4px; justify-content:space-between;">
                        <!-- Retro monologue box -->
                        <div style="flex:1; background:#ffffff; border:3px solid #334155; border-radius:8px; padding:8px; overflow-y:auto; box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);">
                            <div id="battle-log" style="font-size:11px; font-weight:bold; line-height:1.4; color:#1e293b; font-family: monospace;">
                                ストレスとのバトルが始まった！
                            </div>
                        </div>

                        <!-- MP Skills Deck -->
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:4px;">
                            <button class="skill-btn" id="skill-assess" title="🔍 アセスメント: 状況を分析して敵の行動パターンを見抜く（ダメージ15）" style="font-size:9.5px; padding:6px 2px;">🔍 アセスメント</button>
                            <button class="skill-btn" id="skill-listen" title="👂 傾聴（リスニング）: 相手の感情に共感し、次の正解時のダメージを2倍にする" style="font-size:9.5px; padding:6px 2px;">👂 傾聴中</button>
                            <button class="skill-btn" id="skill-team" title="👥 チーム連携: 仲間と連携して自身のMPを30回復する（消費MP20）" style="font-size:9.5px; padding:6px 2px;">👥 チーム連携</button>
                            <button class="skill-btn" id="skill-record" title="📝 支援経過記録: 正確な記録を盾とし、敵の次の攻撃ダメージを無効化する" style="font-size:9.5px; padding:6px 2px;">📝 支援経過記録</button>
                            <button class="skill-btn" id="skill-selfcare" title="💖 セルフケア: 自己管理を行い、自身のHPを25回復する（消費MP10）" style="grid-column: span 2; font-size:9.5px; padding:6px 2px;">💖 セルフケア</button>
                        </div>
                    </div>

                    <!-- RIGHT COLUMN: 4-Choice Battle Commands -->
                    <div style="width:55%; display:flex; flex-direction:column; background:#0f172a; border:2px solid #fbbf24; border-radius:6px; padding:6px; overflow-y:auto; justify-content:flex-start; gap:4px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                        <div id="battle-quiz-title" style="font-size:10px; font-weight:800; color:#fde68a; text-align:left; border-bottom:1px dashed rgba(251,191,36,0.3); padding-bottom:2px; margin-bottom:2px; line-height:1.2;">
                            専門職として最も適切な対応を選択してください：
                        </div>
                        
                        <div style="display:flex; flex-direction:column; gap:3px;">
                            <button class="battle-choice-btn" id="choice-0" data-idx="0">選択肢 1</button>
                            <button class="battle-choice-btn" id="choice-1" data-idx="1">選択肢 2</button>
                            <button class="battle-choice-btn" id="choice-2" data-idx="2">選択肢 3</button>
                            <button class="battle-choice-btn" id="choice-3" data-idx="3">選択肢 4</button>
                        </div>
                    </div>
                </div>

                <!-- Bottom Navigation -->
                <div class="bottom-nav" style="z-index:5;">
                    <button id="nav-home" class="nav-btn"><span>🏠</span>マイページ</button>
                    <button id="nav-report" class="nav-btn"><span>📝</span>日報</button>
                    <button class="nav-btn active"><span>⚔️</span>バトル</button>
                    <button id="nav-shop" class="nav-btn"><span>🛒</span>ショップ</button>
                    <button id="nav-quest" class="nav-btn"><span>📜</span>クエスト</button>
                    <button id="nav-partner" class="nav-btn"><span>🤝</span>パートナー</button>
                    <button id="nav-map" class="nav-btn"><span>🗺️</span>マップ</button>
                </div>

                <!-- VICTORY / DEFEAT FEEDBACK MODAL OVERLAY -->
                <div id="battle-modal" class="modal-overlay" style="z-index:999;">
                    <div class="modal-content rpg-parchment" style="max-width:350px; text-align:center; border:4px solid #ca8a04; border-radius:16px; padding:20px; background:#fff;">
                        <h3 id="modal-battle-title" style="font-size:22px; font-weight:900; color:#d97706; margin-bottom:12px;">🎉 クエストクリア！ 🎉</h3>
                        <div id="modal-battle-body" style="font-size:12px; font-weight:bold; color:#78350f; line-height:1.6; margin-bottom:16px; text-align:left;">
                            適切な専門的対応により、見事にストレスの解決に成功しました！
                        </div>
                        <button id="btn-battle-modal-close" class="primary" style="width:100%; padding:12px; font-size:14px; font-weight:bold;">メインハブへ戻る</button>
                    </div>
                </div>

            </div>
        `;
    }
    init() {
        if (window.audioManager) {
            window.audioManager.playBGM('戦闘シーン.mp3');
        }

        const d = window.gameState.data;

        // Route bindings for Bottom Nav & Exit button
        const goHome = () => {
            if (window.audioManager) window.audioManager.playBGM(d.currentBgmTrack || 'メインハブ.mp3');
            sm.changeScene('mainHub');
        };
        this.element.querySelector('#btn-run-battle').addEventListener('click', () => {
            if (confirm("戦闘から逃げ出しますか？（現在のクエスト進行度は失われます）")) goHome();
        });
        this.element.querySelector('#nav-home').addEventListener('click', goHome);
        this.element.querySelector('#nav-report').addEventListener('click', () => {
            if (window.audioManager) window.audioManager.playBGM('報告画面.mp3');
            sm.changeScene('report');
        });
        this.element.querySelector('#nav-partner').addEventListener('click', () => {
            if (window.audioManager) window.audioManager.playBGM('選択画面.mp3');
            sm.changeScene('partner');
        });
        this.element.querySelector('#nav-shop').addEventListener('click', () => {
            sm.changeScene('shop');
        });
        this.element.querySelector('#nav-quest').addEventListener('click', () => {
            sm.changeScene('quest');
        });
        this.element.querySelector('#nav-map').addEventListener('click', () => {
            if (window.audioManager) window.audioManager.playBGM('ワールドマップ.mp3');
            sm.changeScene('worldMap');
        });

        // Monster Database
        const getJobGroup = (j) => {
            if (["看護師", "OT", "PT", "ST"].includes(j)) return "nursing";
            if (["生活支援員", "サービス管理責任者", "サービス提供責任者"].includes(j)) return "care";
            if (["保育士", "児童指導員", "児童発達管理責任者"].includes(j)) return "childcare";
            if (["相談員", "相談支援専門員", "就労相談員"].includes(j)) return "social";
            if (["公認心理師"].includes(j)) return "psychology";
            if (["就労支援員"].includes(j)) return "workers";
            if (["管理栄養士", "調理員"].includes(j)) return "nutrition";
            if (["事務員", "経営管理"].includes(j)) return "admin";
            return "care";
        };

        const jobSpecificQuestions = {
            "nursing": {
                "burnout": {
                    title: "【バーンアウト・自己管理】看護職の倫理綱領第14条『自己研鑽と健康管理』に基づき、過度な夜勤や多忙な業務で心身が疲弊した際、看護職として取るべき適切な自己管理行動はどれですか？",
                    choices: [
                        "疲労を隠して勤務を続け、ミスが発生した際に対処する",
                        "自己のストレスサイン（不眠、焦燥感など）に気づき、上司や産業医に相談して適切な休息を確保する",
                        "ストレス発散のためにSNSで職場の不満や患者の愚痴を実名で投稿する",
                        "他者に責任を転嫁し、業務時間中に無断で現場を離脱する"
                    ],
                    correct: 1,
                    explain: "正解：看護職の倫理綱領第14条では『自己の健康維持・増進に努める』ことが示されています。燃え尽き症候群を防ぐため、早期に自己の心身の変化に気づき、組織のサポート体制（面談や勤務調整）を活用することが専門職としての責任ある行動です。"
                },
                "claim": {
                    title: "【クレーム対応】病棟で患者の家族から「看護師の態度が冷たい」と強い怒りを伴う苦情を受けました。対面での初期対応として、最も適切な共感的コミュニケーションはどれですか？",
                    choices: [
                        "「こちらも忙しいので誤解です」と感情的に反論し、対話を打ち切る",
                        "相手の怒りの背景にある不安や不満を真摯に受け止めて傾聴し、まずは不快な思いをさせたことに対して謝意を示し、事実関係を確認する",
                        "要求をすべて無条件で受け入れ、その場で不可能な約束をする",
                        "苦情を無視してその場から立ち去り、他のスタッフにも報告しない"
                    ],
                    correct: 1,
                    explain: "正解：苦情対応の基本は「真摯な傾聴と共感」です。感情的にならず相手の主張を聞き、不快な思いをさせた点に限定して謝意を表し、事実確認を行うことで二次クレームを防ぐことができます。"
                },
                "papers": {
                    title: "【看護記録と法的証拠】看護師が日々の看護記録（経過記録など）を記入する際、経過記録や看護計画などに法的証拠としても通用する適切な記述方法はどれですか？",
                    choices: [
                        "後で思い出しながら、主観的な憶測や感想を中心に記入する",
                        "客観的事実に基づき、実施したケアや観察事項、バイタルサインの数値を正確かつタイムリーに記入する",
                        "業務時間が終わらないため、前日の記録をそのままコピー＆ペーストする",
                        "ミスを隠蔽するために、不都合な出来事やヒヤリハットは一切記録に残さない"
                    ],
                    correct: 1,
                    explain: "正解：看護記録は、実施した看護行為の証明であり、法的証拠となる重要書類です。主観を排し、客観的事実（5W1H）に基づき、正確かつ遅滞なく記録することが義務付けられています。"
                },
                "harass": {
                    title: "【ハラスメント防止】職場で先輩看護師が後輩に対して「仕事が遅い、看護師に向いていない」などの人格を否定する暴言を繰り返している現場を目撃しました。あなたが取るべき適切なコンプライアンス姿勢はどれですか？",
                    choices: [
                        "厳しい指導の一環として、見て見ぬふりをする",
                        "客観的な事実（日時、発言内容、目撃者など）を正確に記録し、職場のハラスメント相談窓口や上位管理者に速やかに報告・相談する",
                        "目撃したハラスメントの様子を、噂話として他の同僚や患者に面白おかしく話す",
                        "感情的になって先輩看護師を直接大声で糾弾し、職場内で激しい衝突を引き起こす"
                    ],
                    correct: 1,
                    explain: "正解：ハラスメントの放置は職場環境の悪化を招きます。客観的な事実を記録し、法人の正式な手続き（相談窓口や管理者への報告）を通じて、組織的に解決を図ることがコンプライアンスに基づく正しい姿勢です。"
                },
                "ghost": {
                    title: "【他職種連携】高齢患者の退院調整において、医師、理学療法士（PT）、ソーシャルワーカーとカンファレンスを行うことになりました。看護職としての適切な多職種連携のあり方はどれですか？",
                    choices: [
                        "看護部門だけの判断で退院日とケア方針を決定し、他職種には事後報告のみとする",
                        "各専門職の専門性と役割を尊重し、日常生活動作（ADL）や生活背景の情報を共有し、患者中心の退院支援計画を共同で策定する",
                        "多職種カンファレンスは時間の無駄だと考え、出席を拒否して自身の業務を優先する",
                        "退院後の生活課題について、他職種にすべて丸投げし、看護師としての意見表明を行わない"
                    ],
                    correct: 1,
                    explain: "正解：多職種連携（チームアプローチ）では、各専門職の知見を統合し、患者のQOL向上を目指します。互いの役割を理解し、一貫したアプローチをとるために情報を共有し、協働することが求められます。"
                }
            },
            "care": {
                "burnout": {
                    title: "【燃え尽き症候群・自己管理】介護福祉士倫理綱領第4条に基づき、身体的負荷やシフト勤務による心身の疲労（バーンアウト）のサインを感じた時、取るべき適切な自己管理行動はどれですか？",
                    choices: [
                        "限界まで我慢して働き、倒れるまで業務を続ける",
                        "自己の健康状態や疲労を自覚し、適切な休息を取るとともに、勤務体制の調整について上司に相談する",
                        "業務時間中にサボり、同僚に自身の担当業務を押し付ける",
                        "ストレスを解消するために、利用者のケアに対して感情的に怒鳴る"
                    ],
                    correct: 1,
                    explain: "正解：介護職の安定したサービス提供には、従事者の心身の健康が不可欠です。自身のストレスや疲労を適切にコントロールし、必要に応じて上司に勤務調整等を相談することが自己管理の基本です。"
                },
                "claim": {
                    title: "【クレーム対応・BPSD】認知症の利用者の家族から「預けた衣類が紛失した」と強い不満の連絡がありました。介護専門職としての初期対応として最も適切なものはどれですか？",
                    choices: [
                        "「こちらでは管理できません」と突き放す",
                        "家族の不満や困惑を真摯に受け止めて傾聴し、事実確認（事業所内の捜索や記録の確認）を速やかに行い、状況を報告すると約束する",
                        "紛失の責任を他の職員になすりつける",
                        "面倒を避けるため、家族からの電話を途中で切る"
                    ],
                    correct: 1,
                    explain: "正解：利用者や家族からのクレームに対しては、誠実な傾聴と迅速な事実確認が基本です。信頼関係を維持し、二次トラブルを防ぐための初動対応が求められます。"
                },
                "papers": {
                    title: "【書類・記録】厚生労働省の『身体拘束ゼロへの手引き』に基づき、やむを得ず身体拘束を行う場合の『三原則（切迫性、非代替性、一時性）』について記録する際、適切な方法はどれですか？",
                    choices: [
                        "手続きを省略し、「問題なし」とだけ簡潔に記録する",
                        "身体拘束が必要となった具体的な状態、理由、時間、および三原則を満たす客観的な事実を詳細かつ正確に記録する",
                        "記録の手間を省くため、事後にまとめて適当な理由を捏造して記入する",
                        "家族の同意書さえあれば、日々の経過記録への記入は不要と判断する"
                    ],
                    correct: 1,
                    explain: "正解：身体拘束はやむを得ない場合の一時的な措置であり、その実施には厳格な記録と管理が義務付けられています。客観的な記録を残すことは、利用者の人権擁護およびスタッフ自身の保護に繋がります。"
                },
                "harass": {
                    title: "【ハラスメント・虐待防止】同僚の介護職員が、利用者に対して大声で威嚇するような言葉をかけている（心理的虐待の疑い）場面に遭遇しました。取るべき適切な行動はどれですか？",
                    choices: [
                        "「指導の一環である」と解釈し、何もしない",
                        "虐待防止の観点から毅然とした態度を取り、目撃した客観的な事実（日時、当事者、発言）を記録して、速やかに管理責任者に報告する",
                        "自身もその言葉遣いを真似して利用者を扱う",
                        "本人に直接つかみかかり、暴力を振るって制止する"
                    ],
                    correct: 1,
                    explain: "正解：高齢者虐待防止法に基づき、虐待やその疑いを発見した場合は速やかに通報・報告する義務があります。個人の感情的な対応を避け、組織のシステムを通じて利用者を守る姿勢が求められます。"
                },
                "ghost": {
                    title: "【他職種連携】利用者のADL（日常生活動作）低下に伴い、ケアマネジャーや医師、訪問看護師とケア方針を見直すことになりました。介護職員としての連携のあり方はどれですか？",
                    choices: [
                        "介護の現場での気づきや生活動作の実態を正確に他職種に共有し、連携して新たなケアプランの策定に協力する",
                        "他職種の意見には一切耳を貸さず、介護職員のこだわりだけで介護方針を主張し続ける",
                        "カンファレンスには出席せず、決定事項に従うだけにする",
                        "利用者の健康状態の変化を他職種に報告せず、施設内だけで抱え込む"
                    ],
                    correct: 1,
                    explain: "正解：介護は多職種が連携する『チームケア』によって成り立ちます。介護現場で得られた生活実態の情報を他職種に正確に伝えることで、利用者に最適な支援を提供できます。"
                }
            },
            "childcare": {
                "burnout": {
                    title: "【ストレス管理】日々の子どもたちの安全確保や保護者対応で強いストレスを抱え、燃え尽きそうになった時、保育専門職として適切な自己管理はどれですか？",
                    choices: [
                        "ストレスを隠して一人で抱え込み、ミスを起こすまで働き続ける",
                        "自身の心身の疲労や感情の揺らぎを自覚し、園長や主任に相談して休息を取るなどのメンタルケアを行う",
                        "子どもたちに対して感情的にイライラをぶつけ、厳しく叱責する",
                        "保護者の悪口を実名でブログやSNSに書き込んで発散する"
                    ],
                    correct: 1,
                    explain: "正解：保育士は子どもたちの命と成長を預かる専門職です。保育の質を維持するためには、保育者自身の精神的安定が必須であり、早期の自己分析と相談窓口の活用が重要です。"
                },
                "claim": {
                    title: "【保護者クレーム対応】保護者から「お迎え時に子どもの服が汚れていた。着替えさせてほしかった」と不満を告げられました。保育士としての適切な共感的対応はどれですか？",
                    choices: [
                        "「保育園は泥遊びをする場所です」と正論を言って拒絶する",
                        "保護者の指摘を真摯に受け止め、着替えの配慮が足りなかった点について共感と謝意を示し、園での状況を説明して今後の改善を約束する",
                        "他の担任保育士の配慮不足であると責任を押し付ける",
                        "クレーマーとみなして無視し、他の保護者にもその保護者の悪口を話す"
                    ],
                    correct: 1,
                    explain: "正解：保護者からの意見や苦情には、子どもの育ちを共に見守るパートナーとして誠実に対応することが必要です。共感を示しつつ、園での状況を説明し、信頼関係を深める姿勢が重要です。"
                },
                "papers": {
                    title: "【保育記録・児童発達】保育所保育指針に基づき、児童票や指導計画などの記録を作成する際、最も適切な記述方法はどれですか？",
                    choices: [
                        "保育士の主観的な感想や「可愛い」といった曖昧な評価だけで書く",
                        "子どもの発達段階や具体的な行動、言葉を客観的事実に基づいて記録し、今後の支援方針を明確にする",
                        "面倒なので前月と同じ文章を丸ごとコピーする",
                        "児童の個人情報が記載された児童票を、持ち帰って自宅のパソコンで作成する"
                    ],
                    correct: 1,
                    explain: "正解：保育記録は子どもの健やかな成長を支え、適切な保育計画を立案するための基礎資料です。個人情報保護に留意しつつ、客観的な事実に基づいた正確な記録が求められます。"
                },
                "harass": {
                    title: "【不適切保育・ハラスメント】同僚の保育士が、特定の幼児に対して「言うことを聞かないなら部屋の外に出す」といった不適切な言葉がけ（心理的虐待の疑い）をしている場面を目撃しました。適切な行動はどれですか？",
                    choices: [
                        "保育の現場ではよくある指導だと考えて放置する",
                        "子どもの人権擁護の観点から不適切保育の防止意識を強く持ち、客観的な事実を記録した上で園長や相談窓口に報告する",
                        "自身もその不適切な言葉がけを真似して子どもをコントロールする",
                        "同僚を他人の前で大声で怒鳴りつけ、激しい言い争いを行う"
                    ],
                    correct: 1,
                    explain: "正解：『児童福祉法』や『保育士倫理綱領』に基づき、子どもの尊厳を守ることは最優先事項です。不適切な保育を発見した場合は、組織の正式な報告ルートを通じて解決を図るべきです。"
                },
                "ghost": {
                    title: "【他職種・専門機関連携】発達に特別な配慮が必要な児童の支援において、保護者の同意のもとで地域の発達支援センターや医師と連携することになりました。適切な連携姿勢はどれですか？",
                    choices: [
                        "保育園だけの判断で独自の方針を貫き、他機関のアドバイスは拒絶する",
                        "専門機関のアドバイスや共通の支援方針を共有し、園生活での支援方法に反映させ、一貫した支援体制を構築する",
                        "連携の調整は面倒なため、すべての対応を保護者一人に任せて丸投げする",
                        "児童の障害や発達の状況を、保護者の承諾を得ずにSNSで公開して他機関と共有する"
                    ],
                    correct: 1,
                    explain: "正解：子どもの発達支援には、医療・療育・教育・福祉が一体となった『チームアプローチ』が必要です。専門機関と連携し、一貫した支援を行うことが極めて重要です。"
                }
            },
            "social": {
                "burnout": {
                    title: "【相談援助・自己管理】困難なケース（多重債務、虐待、孤立など）の相談が重なり、相談員自身が精神的に共倒れ（二次的トラウマ、燃え尽き）しそうになった時、取るべき適切な行動はどれですか？",
                    choices: [
                        "誰にも言わずに我慢し、相談者の前で感情的になるまで耐える",
                        "自身の心理的な限界やストレスを自覚し、ケース検討会やスーパービジョン、産業医の面談を利用して適切なサポートを得る",
                        "相談業務を一方的に拒否し、相談者を窓口で怒鳴りつける",
                        "相談者の愚痴や個人情報をSNSに投稿してうさを晴らす"
                    ],
                    correct: 1,
                    explain: "正解：対人援助職は『相談者との関係性』そのものがツールであるため、援助者自身のメンタルケアが不可欠です。スーパービジョン等のサポートシステムを活用することが倫理的にも求められます。"
                },
                "claim": {
                    title: "【相談援助・クレーム対応】生活保護の申請に来た相談者から「対応が遅い！今すぐ金を払え」と窓口で激しい怒りをぶつけられました。対人援助専門職としての初期対応として最も適切なものはどれですか？",
                    choices: [
                        "「ルールですので無理です」と怒鳴り返し、警察を呼ぶと脅す",
                        "相手の焦りや困窮による感情の高ぶりを受け止めて傾聴し、冷静に現在の状況（事実関係）を確認し、法制度に則った迅速な手続きの流れを説明する",
                        "同情して、自己負担の現金をその場で個人的に貸し付ける",
                        "面倒な相談者を避けるため、他の相談員の担当に変える"
                    ],
                    correct: 1,
                    explain: "正解：困窮状態にある相談者は、不安や焦りから激しい感情を示すことがあります。援助者は冷静さを保ちつつ共感的に傾聴し、法制度の範囲内で何ができるかを客観的かつ丁寧に伝えることが必要です。"
                },
                "papers": {
                    title: "【アセスメントと記録】社会福祉士倫理綱領に基づき、相談者のケース記録（インテーク・アセスメントシート）を記録・管理する際、適切な方法はどれですか？",
                    choices: [
                        "自身の憶測や偏見、感情的な判断だけで記録を作成する",
                        "相談者の発言内容、客観的な事実、実施した支援内容を事実に基づき、主観的なバイアスを排除して正確かつ速やかに記録する",
                        "記録を第三者に無断で見せるなど、個人情報の漏洩を気にせず放置する",
                        "記録の作成は重要ではないと考え、メモ程度で済ませて正式な書類を作らない"
                    ],
                    correct: 1,
                    explain: "正解：ケース記録は支援の継続性を保ち、説明責任（アカウンタビリティ）を果たすための重要書類です。事実に即して客観的に記録し、徹底した個人情報管理を行うことが厳格に求められています。"
                },
                "harass": {
                    title: "【ハラスメント・コンプライアンス】職場で上司が、相談者に対して「どうせ自業自得だ」と人権を蹂躙するような差別的発言をしているのを耳にしました。社会福祉士・専門職として取るべき姿勢はどれですか？",
                    choices: [
                        "組織の序列を重視し、上司の差別発言を黙認・容認する",
                        "相談者の人権擁護および社会正義の推進に基づき、客観的な事実を記録し、法人のコンプライアンス窓口や上位の管理者に速やかに相談・報告する",
                        "その上司の差別発言を録音し、無断でインターネットの掲示板に晒す",
                        "上司に対して感情的な暴力を振るい、職場内で直接対決する"
                    ],
                    correct: 1,
                    explain: "正解：対人援助職は、いかなる人権侵害や差別も容認しない倫理的使命（社会正義の追求）を持っています。組織のコンプライアンスシステムを活用し、適正なプロセスで報告・対処すべきです。"
                },
                "ghost": {
                    title: "【多職種・他機関連携】地域で社会的孤立状態にある高齢者の支援において、行政、医療機関、民生委員とサービス担当者会議を開催することになりました。適切な多職種連携はどれですか？",
                    choices: [
                        "自身の機関だけで支援方針を決定し、他機関との情報共有を遮断する",
                        "各機関の専門性や民生委員の地域性を尊重し、情報を一元化して一貫した地域支援ネットワークを構築する",
                        "外部連携は手続きが煩雑なため、一切行わずにすべて自前で抱え込む",
                        "相談者の個人情報やアセスメント内容を、本人の同意なく不特定多数のSNSグループで共有する"
                    ],
                    correct: 1,
                    explain: "正解：複雑な生活課題を抱える相談者を支援するには、地域の多職種・多機関がそれぞれの役割を果たし、連携する『ソーシャルワーク・ネットワーク』の構築が不可欠です。"
                }
            },
            "psychology": {
                "burnout": {
                    title: "【心理職・自己管理】多くのクライエントからの深刻な相談を受ける中で、自身の心理的な疲弊（逆転移や二次的受傷）を感じた時、適切な対処法はどれですか？",
                    choices: [
                        "専門職としての弱音は許されないと考え、誰にも相談せず一人で耐え抜く",
                        "自己の心理状態（感情の揺らぎや疲労）を自覚し、自身の教育分析やスーパービジョン、メンタルケアを能動的に受ける",
                        "クライエントに対して冷淡な態度を取り、カウンセリングを適当に切り上げる",
                        "精神安定のために、クライエントのカウンセリング内容を匿名ブログで暴露して発散する"
                    ],
                    correct: 1,
                    explain: "正解：心理職は、自身の感情や心理的健康そのものが支援ツールとなります。二次的受傷や燃え尽きを防ぐため、スーパービジョンや専門家としての自己管理システムを継続的に活用することが必要不可欠です。"
                },
                "claim": {
                    title: "【心理カウンセリング・枠組み】クライエントから「時間外にも電話で話を聞いてほしい」「個人的に会ってほしい」と強い要求（二重関係や枠の逸脱）がありました。適切な対応はどれですか？",
                    choices: [
                        "クライエントの要求にすべて応じ、プライベートの時間も割いて個人的に付き合う",
                        "クライエントへの共感を示しつつ、カウンセリングの枠組み（契約された時間・場所）の重要性を冷静に説明し、適切な心理的境界線を維持する",
                        "「わがままを言うならカウンセリングを打ち切る」と感情的に拒絶する",
                        "クライエントの過度な依存を喜び、精神的支配を強める"
                    ],
                    correct: 1,
                    explain: "正解：心理職倫理において、多重関係（二重関係）の回避と適切な境界線（バウンダリー）の維持は極めて重要です。明確な枠組みを守ることは、結果としてクライエントを保護することに繋がります。"
                },
                "papers": {
                    title: "【心理アセスメントと記録】公認心理師法第42条等に基づき、クライエントのアセスメント結果（心理検査結果やカルテ）を記録・管理する際の適切な方法はどれですか？",
                    choices: [
                        "心理検査の数値を恣意的に書き換え、解釈を事実と異なる内容で記録する",
                        "実施した検査（WAIS、ロールシャッハ等）の客観的データ、および面接の事実経過を、主観的なバイアスを排除して正確かつ厳重に記録・管理する",
                        "クライエントの検査結果を、同僚との雑談の中で面白おかしく話しネタにする",
                        "個人情報の紛失リスクを無視し、カルテを誰でもアクセスできる共用PCに暗号化せず保存する"
                    ],
                    correct: 1,
                    explain: "正解：心理検査や面接記録は、極めて秘匿性の高い個人情報です。事実に基づき正確に記録することに加え、厳格な守秘義務とデータ管理を行うことが公認心理師法でも厳格に求められています。"
                },
                "harass": {
                    title: "【ハラスメント・倫理】他のセラピストがクライエントに対して「あなたの性格が悪いから病気になる」などと人格を攻撃するような発言を行っている現場を目撃しました。適切な姿勢はどれですか？",
                    choices: [
                        "治療技法の一環であると盲信し、見て見ぬふりをする",
                        "クライエントの尊厳と安全を守るため、客観的な事実を記録し、法人の倫理委員会やコンプライアンス相談窓口に報告する",
                        "自身もその不適切なカウンセリング手法を取り入れ、クライエントを攻撃する",
                        "目撃したその場で大声で怒鳴り、セラピスト同士の暴力的対立を引き起こす"
                    ],
                    correct: 1,
                    explain: "正解：心理職にはクライエントの尊厳を守り、危害を加えない倫理（無危害の原則）があります。不適切なセラピーやハラスメントを発見した場合は、適切なコンプライアンスシステムを通じて介入を図ることが求められます。"
                },
                "ghost": {
                    title: "【多職種連携・公認心理師法】公認心理師法第42条第2項に基づき、クライエントに主治医（医師）がいる場合の多職種連携において、適切な心理職のあり方はどれですか？",
                    choices: [
                        "医師の指導を完全に無視し、心理職の独断のみでクライエントの治療方針を決定する",
                        "クライエントに主治の医師があるときは、その指示に従い、緊密な情報共有と適切な役割分担を行い、チーム医療・ケアを遂行する",
                        "多職種との連携はカウンセリングの純粋性を損なうと考え、一切の情報共有を拒否する",
                        "主治医の批判をクライエントに話し、医師とクライエントの信頼関係を意図的に破壊する"
                    ],
                    correct: 1,
                    explain: "正解：公認心理師法第42条第2項では『主治の医師があるときは、その指示を受けなければならない』と法定義務が定められています。他職種と緊密に連携し、クライエントに最善 of 統合的アプローチを提供することが求められます。"
                }
            },
            "workers": {
                "burnout": {
                    title: "【就労支援・自己管理】就職が難航する利用者の対応や目標管理のプレッシャーにより、支援員自身が焦燥感や燃え尽きを感じた時、適切な自己管理行動はどれですか？",
                    choices: [
                        "利用者に八つ当たりし、「やる気がないなら辞めろ」と叱責する",
                        "自己の焦りやメンタルの変化に気づき、上司やチームでのケース検討会を活用して支援方針を再検討し、自身の心の安定を図る",
                        "プレッシャーを避けるために無断で欠勤し、業務を放棄する",
                        "利用者の就職活動実績の数値を偽装して、見かけの成果を上げる"
                    ],
                    correct: 1,
                    explain: "正解：就労支援員は利用者の『働く意欲』をサポートする役割です。支援者自身の焦りは利用者に伝わり悪影響を与えます。自身の感情やメンタルをコントロールし、チームでケースを抱えることが大切です。"
                },
                "claim": {
                    title: "【クレーム対応・就労支援】就職活動中の利用者から「紹介された企業が合わなかった！お前の紹介の仕方が悪い」と激しい抗議を受けました。適切な対応はどれですか？",
                    choices: [
                        "「あなたが選んだ会社です」と冷たく突き放し、一切の支援を打ち切る",
                        "利用者の不満や就活への不安・焦りを丁寧に傾聴し、ミスマッチが生じた原因（労働条件や業務内容のズレ）を客観的に整理し、今後の就活方針を共同で修正する",
                        "企業の側に立って利用者の能力不足を責め立てる",
                        "クレーマーとして扱い、以後の面談では利用者の意見をすべて無視する"
                    ],
                    correct: 1,
                    explain: "正解：就労支援における苦情やミスマッチは、自己理解を深めるプロセスでもあります。利用者の感情を受け止めつつ、事実関係を客観的に整理し、次に活かす建設的なアプローチが求められます。"
                },
                "papers": {
                    title: "【個別支援計画の作成】障害者総合支援法等に基づき、利用者の就労移行支援計画（個別支援計画）を作成・更新する際の適切なプロセスはどれですか？",
                    choices: [
                        "利用者の意向や実態を完全に無視し、支援員が勝手に作った計画書にサインだけさせる",
                        "利用者のアセスメント結果に基づき、本人の希望や課題を反映した具体的な目標・支援内容を策定し、本人および多職種との合意形成を経てタイムリーに作成・交付する",
                        "過去の別の利用者の計画書を名前だけ書き換えて流用する",
                        "計画書の作成自体を行わず、口頭の約束だけで支援を進める"
                    ],
                    correct: 1,
                    explain: "正解：個別支援計画は、就労支援の法的な根拠であり方針を定める重要書類です。本人の自己決定を尊重し、アセスメントに基づき多職種と連携して作成し、定期的にモニタリングを行うことが義務付けられています。"
                },
                "harass": {
                    title: "【ハラスメント防止・企業連携】実習先の企業で、利用者が実習指導員から人権を否定するような言動（パワハラや差別的扱い）を受けていると相談がありました。適切な行動はどれですか？",
                    choices: [
                        "実習先との関係悪化を恐れ、「実習とはそういう厳しいものだ」と我慢を強いる",
                        "利用者の安全確保と権利擁護を最優先し、客観的な事実を詳細にヒアリングして記録し、支援事業所の管理者および実習先企業の責任者と連携して対応策を講じる",
                        "その企業の評判をSNSで拡散し、企業の社会的信用を直接攻撃する",
                        "実習指導員に対して感情的に乗り込み、大声で激しく抗議する"
                    ],
                    correct: 1,
                    explain: "正解：実習中や就職後のハラスメントに対しては、支援機関として迅速な介入と権利擁護を行う義務があります。客観的な事実関係を抑えた上で、企業側と正式なプロセスで交渉・調整を行うべきです。"
                },
                "ghost": {
                    title: "【多機関・多職種連携】精神障害のある利用者の就労定着支援において、主治医、ハローワーク、障害者職業センターと情報共有を行うことになりました。適切な連携はどれですか？",
                    choices: [
                        "連携機関の意見を聞かず、自事業所だけの判断で就労定着計画を強行する",
                        "個人情報保護の同意を得た上で、各専門機関と緊密な連絡調整を行い、役割分担（医療面の配慮、職務調整等）を明確にして一体的な支援を行う",
                        "外部機関連携の手続きは煩雑であるため、他機関との連絡を拒絶して抱え込む",
                        "利用者のアセスメントシートや個人情報を、本人の承諾を得ずに一般公開のSNSに投稿する"
                    ],
                    correct: 1,
                    explain: "正解：障害特性に応じた安定的な就労継続には、医療・労働・福祉の『有機的な多機関連携』が不可欠です。本人の同意を前提に情報を的確に共有し、チームで支える体制を構築することが重要です。"
                }
            },
            "nutrition": {
                "burnout": {
                    title: "【栄養管理・自己管理】大量調理の管理業務や、個別指導での利用者のモチベーション低下に悩まされ、栄養専門職として心身の燃え尽きを感じた時、適切な自己管理行動はどれですか？",
                    choices: [
                        "献立の栄養計算や衛生チェックを怠り、手抜き業務を行う",
                        "自己のストレスや疲労を自覚し、主任管理栄養士や産業医に相談して適切なサポートを受け、安定した判断力と健康を維持する",
                        "利用者に対して「自己管理ができていないから病気になる」と暴言を吐く",
                        "業務のストレスを避けるために無断で現場を休業する"
                    ],
                    correct: 1,
                    explain: "正解：栄養管理業務は、人々の健康と命を支える科学的な判断力が求められるため、従事者自身の健全な状態が不可欠です。自己のメンタルヘルスに配慮し、組織のサポートを得る姿勢が大切です。"
                },
                "claim": {
                    title: "【クレーム対応・栄養指導】「提供された療養食がまずくて食べられない！何とかしろ」と患者やその家族から強い抗議を受けました。適切な初期対応はどれですか？",
                    choices: [
                        "「治療のためですので我慢してください」と冷たく拒絶する",
                        "患者の食欲低下や病状による焦りなどの感情を丁寧に傾聴し、嗜好や硬さ、味付けの工夫（栄養管理基準の範囲内での代替メニュー提案）を客観的に検討し、誠実に説明する",
                        "調理スタッフの調理技術が低いからだと責任をなすりつける",
                        "面倒を避けるため、その患者の食事提供自体を取りやめる"
                    ],
                    correct: 1,
                    explain: "正解：療養食に対するクレームは、患者の心身の衰弱や食事への不安から生じることが多いです。共感を持って傾聴し、栄養基準を遵守しつつ、調理や工夫の可能性を模索する姿勢が求められます。"
                },
                "papers": {
                    title: "【衛生管理と記録】食品衛生法やHACCP（ハサップ）に基づき、調理現場の温度管理記録（中心温度や冷蔵庫の温度）を記録・管理する際の適切な方法はどれですか？",
                    choices: [
                        "温度測定を省略し、「全て正常」と予測した数値を毎日適当に記入する",
                        "規定された時間と方法で正確に温度を測定し、数値を遅滞なくありのまま記録し、異常が検知された場合は直ちにマニュアル通りに対処・報告する",
                        "記録を紛失しても気にせず、監査の前に帳尻を合わせて一括で偽装作成する",
                        "温度管理記録の作成自体が不要であると判断して記録を残さない"
                    ],
                    correct: 1,
                    explain: "正解：HACCP手法において、重要管理点（CCP）のモニタリング記録は、食中毒防止の法的証拠となる最重要書類です。事実に即した正確な記録と、異常時の迅速なマニュアル対応が義務付けられています。"
                },
                "harass": {
                    title: "【ハラスメント防止・厨房マネジメント】厨房内で、チーフ調理師が若手調理員に対して「給料泥棒」などの暴言を浴びせ、厨房全体の衛生管理環境が悪化している場面に直面しました。管理栄養士として取るべき行動はどれですか？",
                    choices: [
                        "厨房の上下関係は厳しくて当たり前だと考え、見て見ぬふりをする",
                        "安全で衛生的な給食管理体制を維持するため、客観的な事実（発言、日時）を詳細に記録し、施設の管理責任者やハラスメント窓口に速やかに報告・相談する",
                        "若手調理員に同調し、チーフ調理師の陰口を厨房全体で言いふらす",
                        "チーフ調理師に対してその場で感情的に大声で罵り合いを行い、調理業務を中断させる"
                    ],
                    correct: 1,
                    explain: "正解：ハラスメントは職場の精神的健康を損ねるだけでなく、注意力を低下させ食中毒や調理事故の発生リスクを高めます。客観的事実を記録し、組織の然るべきルートで早期に解決を図ることが求められます。"
                },
                "ghost": {
                    title: "【多職種連携・NST】高齢者の摂食嚥下障害や低栄養状態の改善において、医師、看護師、言語聴覚士（ST）、歯科医師とNST（栄養サポートチーム）を構成して連携することになりました。適切な連携姿勢はどれですか？",
                    choices: [
                        "栄養部門だけの判断で栄養摂取プランを固め、他職種の嚥下能力の評価や医師の診断結果は無視する",
                        "各職種の評価結果（嚥下機能、口腔状態、臨床的リスク）を統合し、安全かつ最大効率 of 栄養ケア計画を共同で策定・実施する",
                        "多職種カンファレンスは形骸的であると考え、情報共有を行わずに独断で業務を行う",
                        "患者の摂食嚥下情報を、本人の承諾を得ずにSNSや公開ネット上に投稿して意見を求める"
                    ],
                    correct: 1,
                    explain: "正解：摂食嚥下や栄養改善には、多角的な臨床的アプローチが必要です。NSTなどの多職種チームで専門知見を統合し、合意のもとでアプローチすることが、誤嚥性肺炎予防とQOL向上を両立させる唯一の方法です。"
                }
            },
            "admin": {
                "burnout": {
                    title: "【組織運営・自己管理】施設運営上の経営課題やトラブル対応が重なり、管理者自身が精神的な限界や燃え尽きを感じた時、適切な自己管理行動はどれですか？",
                    choices: [
                        "誰にも相談せず、イライラを部下にぶつけて厳しく叱責することで組織を引き締める",
                        "自己の疲労や感情 of 揺らぎを自覚し、法人の役員や産業医に相談して経営サポートを得るとともに、適切な休息を確保して冷静な判断力を維持する",
                        "経営課題から逃避するために、突然の無断長期欠勤を行い業務を停滞させる",
                        "施設の運営赤字や人事上の不都合な数値を意図的に隠蔽して偽る"
                    ],
                    correct: 1,
                    explain: "正解：管理者は組織の羅針盤であり、その冷静な判断力と健全な精神が事業所全体の安定に直結します。自己のメンタルヘルスを適切に管理し、法人のバックアップ体制を活用することが重要です。"
                },
                "claim": {
                    title: "【クレーム対応・初動対応】利用者の家族から「職員の介助中に骨折したのではないか」と強い怒りと法的責任を追及するクレームがありました。管理責任者としての適切な対応はどれですか？",
                    choices: [
                        "「当方に過失はありません」と即座に突っぱね、出入り禁止にする",
                        "家族の深い動揺や不満を真摯に傾聴し、怪我に対する真摯な見舞いと謝意（過失の有無とは区別）を示した上で、速やかに詳細な事実調査を行い、客観的な調査結果と今後の対応方針を誠実に報告する",
                        "担当した現場職員を家族の前で厳しく叱責し、その職員一人に全責任を押し付ける",
                        "訴訟を恐れ、非公開の示談金などを独断で提示してその場を取り繕う"
                    ],
                    correct: 1,
                    explain: "正解：事故や重篤なクレームの初動対応では、誠実な傾聴と共感、迅速な事実調査、客観的結果の説明が不可欠です。感情的な対立を防ぎ、信頼関係を再構築するための説明責任が管理者に求められます。"
                },
                "papers": {
                    title: "【運営管理と書類】労働基準法や介護保険法等に基づき、職員の勤務体制・業務日誌・インシデント報告書を記録・管理する際の適切な方法はどれですか？",
                    choices: [
                        "監査を無難に通すため、勤務時間を改ざんし、インシデント報告書は破棄して作成しない",
                        "法令に準拠し、勤務時間の実態や業務実施状況、事故等のインシデント経過をありのまま正確に記録し、法令で定められた保存期間に沿って厳重に保管・分析する",
                        "業務を効率化するため、重要記録や個人情報の入った書類を鍵のかからないキャビネットに山積みにして放置する",
                        "事故調査報告書を適当な虚偽事実でっち上げでスピード提出する"
                    ],
                    correct: 1,
                    explain: "正解：管理書類は、施設の法令遵守および業務適正化、職員の労働環境保護を担保する最重要証拠です。事実に基づき正確に作成し、厳格な情報管理を行うことが管理者の法定義務です。"
                },
                "harass": {
                    title: "【ハラスメント・コンプライアンス】職場内で、主任が部下に対してパワーハラスメントを行い、数名の職員が退職を申し出る事態が発生しました。管理者として取るべき適切なコンプライアンス対応はどれですか？",
                    choices: [
                        "「業務上の厳しい指導である」と主任を擁護し、退職する職員の能力不足として処理する",
                        "直ちに個人のバイアスを排除して当事者および周囲への客観的なヒアリングを行い、事実関係を調査・整理した上で、就業規則に則った厳正な処分を下し、再発防止策（研修実施等）を策定・公表する",
                        "噂が広がるのを防ぐため、退職希望の職員を強迫して退職届の提出を阻害する",
                        "自身の感情に基づき、その主任を全職員の前で大声で怒鳴りつけ、自主退職に追い込む"
                    ],
                    correct: 1,
                    explain: "正解：ハラスメントは職場の崩壊を招く最大のコンプライアンス違反です。管理者は客観的な事実関係を調査し、法人の就業規則・法令に則って厳正に対処するとともに、組織全体の環境改善を図る法的責任があります。"
                },
                "ghost": {
                    title: "【多機関連携・地域ネットワーク】地域の福祉課題解決に向けて、行政、地域の他法人、医療機関、町内会と『地域ケア会議』や『災害時協定』を策定することになりました。適切な連携姿勢はどれですか？",
                    choices: [
                        "自施設だけの利益と保身を優先し、地域連携の取り組みには一切の協力を拒否する",
                        "地域社会における法人の社会的責任（CSR）を自覚し、各専門機関・団体と情報を共有し、役割分担（災害時の避難スペース確保等）を明確にして協働体制を確立する",
                        "連携の調整は経営効率を下げるため、すべて部下に丸投げして自身は関与しない",
                        "会議で得た他施設の内部機密や経営情報、個人情報を、一般公開のSNSやネット上で拡散する"
                    ],
                    correct: 1,
                    explain: "正解：管理者は、施設が地域社会の一員であることを理解し、地域共生社会の実現や災害対策に向けて多機関と連携する責任があります。信頼に基づくパートナーシップの構築が法人の価値を高めます。"
                }
            }
        };

        const getJobSpecificMonsterQuestions = (monsterId, job) => {
            const group = getJobGroup(job);
            const list = [];
            if (jobSpecificQuestions[group] && jobSpecificQuestions[group][monsterId]) {
                list.push(jobSpecificQuestions[group][monsterId]);
            }
            return list;
        };

        this.monsters = [
            {
                id: "burnout",
                name: "バーンアウト怪人",
                img: "キャラクターjpg/バーンアウト魔王.png",
                hp: 100,
                statBoost: "ストレス管理",
                questions: [
                    ...getJobSpecificMonsterQuestions("burnout", d.job),
                    {
                        title: "【自己管理・燃え尽き防止】日々の支援業務において多忙を極め、強い疲労感や焦燥感を感じるようになりました。専門職のストレス管理として、最も適切なセルフケア行動はどれですか？",
                        choices: [
                            "「気の持ちようだ」と我慢し、限界がきて倒れるまで働く",
                            "自分のストレス反応（不眠、イライラ、食欲低下など）を早期に自覚し、適切な休息を取るとともに信頼できる上司や相談窓口に相談する",
                            "ストレスを発散するために、業務を無断で放棄して帰宅する",
                            "職場の愚痴や不満を匿名SNSに詳細に書き込み、うさを晴らす"
                        ],
                        correct: 1,
                        explain: "正解：自己管理の基本は、自身の心身の疲労（バーンアウト）のサインを早期に察知し、早期に対応することです。無理を続けず、信頼できる同僚や上司に相談し、勤務調整やカウンセリングを利用することが専門職の正しい姿勢です。"
                    }
                ]
            },
            {
                id: "claim",
                name: "理不尽クレーマー",
                img: "キャラクターjpg/クレーム鬼.png",
                hp: 85,
                statBoost: "コミュニケーション",
                questions: [
                    ...getJobSpecificMonsterQuestions("claim", d.job),
                    {
                        title: "【苦情対応】利用者やご家族から「職員の対応が不誠実だ！」と激しい口調で苦情を受けました。初期対応として、最も適切な共感的コミュニケーションはどれですか？",
                        choices: [
                            "「こちらの言い分も聞いてください」と感情的に反論し、対立する",
                            "相手の怒りの背景にある困惑や不安を真摯に受け止めて傾聴し、不快な思いをさせたことに対して謝意（限定的な謝罪）を示し、事実関係を正確に確認する",
                            "面倒なので無条件で全て相手の要求を丸呑みし、その場で示談する",
                            "クレーマーとして扱い、相手の発言を一切無視してその場から立ち去る"
                        ],
                        correct: 1,
                        explain: "正解：苦情対応の鉄則は「真摯な傾聴と共感」です。感情的にならずに相手の主張に耳を傾け、不快な感情を抱かせた点について限定的に謝罪し、客観的に事実関係を調査する姿勢を示すことで、信頼関係の回復に繋がります。"
                    }
                ]
            },
            {
                id: "papers",
                name: "書類の罠",
                img: "キャラクターjpg/書類の山.png",
                hp: 90,
                statBoost: "業務遂行力",
                questions: [
                    ...getJobSpecificMonsterQuestions("papers", d.job),
                    {
                        title: "【業務計画・記録】業務日誌や支援記録、アセスメントシートなどの重要書類を作成・提出するにあたり、専門職として適切な行動はどれですか？",
                        choices: [
                            "面倒なので、過去の他の利用者の計画書を名前だけ書き換えてコピー＆ペーストする",
                            "業務の優先順位を判断し、客観的事実に基づいて書類・記録を正確かつタイムリーに作成し、期日内に提出する",
                            "提出期限が過ぎても謝罪や報告をせず、自身の都合の良い時に提出する",
                            "虚偽の事実や適当な成果数値をでっち上げ、スピード重視で提出する"
                        ],
                        correct: 1,
                        explain: "正解：支援記録や業務書類は、利用者の人権擁護を証明し、トラブル時の法的証拠となる重要書類です。事実に基づき、正確かつ期日厳守でタイムリーに作成・提出することが、専門職としての高い信頼と自立性を示します。"
                    }
                ]
            },
            {
                id: "harass",
                name: "ハラスメント怪人",
                img: "キャラクターjpg/ハラスメント怪人.png",
                hp: 90,
                statBoost: "倫理観",
                questions: [
                    ...getJobSpecificMonsterQuestions("harass", d.job),
                    {
                        title: "【倫理・コンプライアンス】職場で先輩職員が後輩職員に対して「無能だ」「この仕事に向いていない」といった威圧的な暴言（ハラスメント）を繰り返している場面を目撃しました。取るべき適切な行動はどれですか？",
                        choices: [
                            "「厳しい指導の一環だから仕方がない」と考え、見て見ぬふりをする",
                            "ハラスメント防止の意識を強く持ち、客観的な事実（日時、発言、関係者）を詳細に記録し、職場のハラスメント相談窓口や上位管理者に速やかに相談・報告する",
                            "自身も攻撃に巻き込まれないために、先輩職員に同調して後輩職員を笑い者にする",
                            "怒りのあまり先輩職員に対して感情的に大声で罵り合い、直接的な暴力的対立を引き起こす"
                        ],
                        correct: 1,
                        explain: "正解：ハラスメントの放置は職場全体のメンタルヘルスとモラルを崩壊させ、最終的に利用者のケアの質低下に繋がります。感情的な衝突を避け、客観的な事実データを抑えた上で、組織の正式なルートを通じて解決を図るべきです。"
                    }
                ]
            },
            {
                id: "ghost",
                name: "れんけいゴースト",
                img: "キャラクターjpg/れんけいゴースト.png",
                hp: 75,
                statBoost: "信頼関係",
                questions: [
                    ...getJobSpecificMonsterQuestions("ghost", d.job),
                    {
                        title: "【連携・チームワーク】利用者の支援方針を巡って、他職種や他のチームメンバーと意見が衝突し、協力体制が崩れそうになっています。協力的な姿勢として最も適切な行動はどれですか？",
                        choices: [
                            "「自分のやり方以外は間違っている」と主張し続け、連携を断絶して個人で勝手に支援する",
                            "各専門職の役割や視点を尊重し、カンファレンス等の公式な場で冷静に意思疎通を図り、利用者本位のチームアプローチを目指して合意形成に努める",
                            "対立を避けるため、意見表明やカンファレンスへの参加を一切取りやめ、ボイコットする",
                            "相手メンバーの陰口を利用者やその家族の前で発言し、個人の信用を落とそうとする"
                        ],
                        correct: 1,
                        explain: "正解：福祉・医療支援は多様な専門職が連携する『チームアプローチ』で成り立ちます。個人のこだわりを感情的に押し付けるのではなく、利用者本位の視点（QOLの向上）に立ち返り、他職種の専門性を尊重しながら対話と合意形成を図ることが不可欠です。"
                    }
                ]
            }
        ];

        this.initBattle();
    }    initBattle() {
        const d = window.gameState.data;
        const playerHpText = this.element.querySelector('#player-hp-text');
        const playerMpText = this.element.querySelector('#player-mp-text');
        const playerHpBar = this.element.querySelector('#player-hp-bar');
        const playerMpBar = this.element.querySelector('#player-mp-bar');

        // Draw Player Initial Status
        playerHpText.textContent = `${this.playerHp}/100`;
        playerMpText.textContent = `${this.playerMp}/100`;
        playerHpBar.style.width = `${this.playerHp}%`;
        playerMpBar.style.width = `${this.playerMp}%`;

        // Randomly pick an active monster
        const mIdx = Math.floor(Math.random() * this.monsters.length);
        this.activeMonster = this.monsters[mIdx];
        
        // Setup Monster UI
        this.enemyHp = this.activeMonster.hp;
        this.enemyMaxHp = this.activeMonster.hp;
        
        this.element.querySelector('#enemy-name').textContent = this.activeMonster.name;
        const spriteName = this.element.querySelector('#enemy-sprite-name');
        if (spriteName) spriteName.textContent = this.activeMonster.name;
        this.element.querySelector('#enemy-img').src = this.activeMonster.img;
        
        this.updateEnemyHpUI();

        // Welcome combat log
        const pName = d.partner.split('/').pop().replace('.png', '');
        this.element.querySelector('#battle-log').textContent = `${pName}と協力して、目の前に立ちはだかる${this.activeMonster.name}に立ち向かおう！`;

        // Pick initial question
        this.qIdx = Math.floor(Math.random() * this.activeMonster.questions.length);
        this.currentQuestion = this.activeMonster.questions[this.qIdx];
        this.renderQuestion();

        // Bind Skill buttons
        this.element.querySelector('#skill-assess').addEventListener('click', () => this.useSkill('assess'));
        this.element.querySelector('#skill-listen').addEventListener('click', () => this.useSkill('listen'));
        this.element.querySelector('#skill-team').addEventListener('click', () => this.useSkill('team'));
        this.element.querySelector('#skill-record').addEventListener('click', () => this.useSkill('record'));
        this.element.querySelector('#skill-selfcare').addEventListener('click', () => this.useSkill('selfcare'));

        this.updateSkillButtonsState();

        // Bind choices
        for(let i=0; i<4; i++) {
            const btn = this.element.querySelector(`#choice-${i}`);
            btn.addEventListener('click', () => this.handleChoice(i));
        }
    }

    updateEnemyHpUI() {
        const bar = this.element.querySelector('#enemy-hp-bar');
        const text = this.element.querySelector('#enemy-hp-text');
        const pct = Math.max(0, Math.floor((this.enemyHp / this.enemyMaxHp) * 100));
        
        bar.style.width = `${pct}%`;
        text.textContent = `${this.enemyHp}/${this.enemyMaxHp}`;

        // Shift color dynamically
        if (pct > 50) {
            bar.style.background = '#22c55e';
        } else if (pct > 20) {
            bar.style.background = '#eab308';
        } else {
            bar.style.background = '#ef4444';
        }
    }

    updatePlayerStatsUI() {
        this.playerHp = Math.max(0, Math.min(100, this.playerHp));
        this.playerMp = Math.max(0, Math.min(100, this.playerMp));

        this.element.querySelector('#player-hp-text').textContent = `${this.playerHp}/100`;
        this.element.querySelector('#player-mp-text').textContent = `${this.playerMp}/100`;
        
        this.element.querySelector('#player-hp-bar').style.width = `${this.playerHp}%`;
        this.element.querySelector('#player-mp-bar').style.width = `${this.playerMp}%`;

        this.updateSkillButtonsState();
    }

    updateSkillButtonsState() {
        // Disable skills if insufficient MP
        this.element.querySelector('#skill-assess').disabled = (this.playerMp < 10);
        this.element.querySelector('#skill-listen').disabled = (this.playerMp < 15);
        this.element.querySelector('#skill-team').disabled = (this.playerMp < 20);
        this.element.querySelector('#skill-record').disabled = (this.playerMp < 15);
        this.element.querySelector('#skill-selfcare').disabled = (this.playerMp < 10);
    }

    renderQuestion() {
        this.element.querySelector('#battle-quiz-title').textContent = this.currentQuestion.title;
        for(let i=0; i<4; i++) {
            const btn = this.element.querySelector(`#choice-${i}`);
            btn.textContent = this.currentQuestion.choices[i];
            btn.disabled = false;
            btn.classList.remove('correct', 'incorrect');
        }
    }

    useSkill(key) {
        const d = window.gameState.data;
        const pName = d.partner.split('/').pop().replace('.png', '');
        const log = this.element.querySelector('#battle-log');
        const flash = this.element.querySelector('#combat-flash');

        if (key === 'assess') {
            if (this.playerMp < 10) return;
            this.playerMp -= 10;
            this.updatePlayerStatsUI();

            // Give player +15 Attack Boost
            this.enemyHp = Math.max(0, this.enemyHp - 15);
            this.updateEnemyHpUI();
            
            // Play physical attack animation
            const img = this.element.querySelector('#enemy-img');
            img.classList.add('hit-shake');
            setTimeout(() => img.classList.remove('hit-shake'), 400);

            log.textContent = `${pName}は状況をアセスメントした！敵の行動パターンを見抜き、対処法（ダメージ15）を与えた！`;
        } 
        else if (key === 'listen') {
            if (this.playerMp < 15) return;
            this.playerMp -= 15;
            this.listenBoost = true;
            this.updatePlayerStatsUI();
            this.element.querySelector('#listen-badge').style.display = 'inline-block';

            log.textContent = `${pName}はアクティブリスニング（傾聴）を行った！相手の感情を受け止め、次の正解ダメージが倍増する！`;
        } 
        else if (key === 'team') {
            if (this.playerMp < 20) return;
            this.playerMp = Math.min(100, this.playerMp + 30);
            this.playerMp -= 20; // net recovery of 10 plus logic
            this.playerMp = Math.min(100, this.playerMp + 20); // total recovery +30 - 20 = +10 net adjustment
            this.updatePlayerStatsUI();
            
            // Play green flash
            flash.style.background = 'rgba(16, 185, 129, 0.2)';
            setTimeout(() => flash.style.background = 'transparent', 400);

            log.textContent = `${pName}はメンバーに連携を要請した！チーム全員の協力と信頼回復により、自身のMPが30回復した！`;
        } 
        else if (key === 'record') {
            if (this.playerMp < 15) return;
            this.playerMp -= 15;
            this.shieldActive = true;
            this.updatePlayerStatsUI();
            this.element.querySelector('#shield-badge').style.display = 'inline-block';
            this.element.querySelector('#player-battle-box').classList.add('shield-active');
            log.textContent = `${pName}は迅速に支援経過を記録した！正確な事実記録が盾（シールド）となり、敵の次の攻撃を完全に無効化する！`;
        } 
        else if (key === 'selfcare') {
            if (this.playerMp < 10) return;
            this.playerMp -= 10;
            this.playerHp = Math.min(100, this.playerHp + 25);
            this.updatePlayerStatsUI();

            // Play green glow
            const box = this.element.querySelector('#player-battle-box');
            box.classList.add('heal-glow-active');
            setTimeout(() => box.classList.remove('heal-glow-active'), 800);

            log.textContent = `${pName}はセルフケア（自己管理）を実践した！美味しい食事と十分な睡眠を思い出し、自身のHPが25回復した！`;
        }
    }

    handleChoice(idx) {
        const d = window.gameState.data;
        const pName = d.partner.split('/').pop().replace('.png', '');
        const log = this.element.querySelector('#battle-log');
        const flash = this.element.querySelector('#combat-flash');

        // Disable all choices
        for(let i=0; i<4; i++) {
            this.element.querySelector(`#choice-${i}`).disabled = true;
        }

        const isCorrect = idx === this.currentQuestion.correct;

        if (isCorrect) {
            // Hit Enemy!
            let damage = 35;
            if (this.listenBoost) {
                damage = 70;
                this.listenBoost = false;
                this.element.querySelector('#listen-badge').style.display = 'none';
            }
            this.enemyHp = Math.max(0, this.enemyHp - damage);
            this.updateEnemyHpUI();

            // Attack Animation (Flash red on battlefield)
            const bf = this.element.querySelector('.pokemon-battlefield');
            if (bf) {
                const oldBg = bf.style.background;
                bf.style.background = '#fca5a5';
                setTimeout(() => bf.style.background = oldBg, 150);
            }

            log.innerHTML = `✨ <strong>正解です！素晴らしい対応力！</strong><br>${this.currentQuestion.explain}<br>💥 相手に <strong>${damage}</strong> ダメージを与えた！`;

            if (this.enemyHp <= 0) {
                setTimeout(() => this.endBattle(true), 2500);
                return;
            }
        } else {
            // Wrong Choice!
            log.innerHTML = `❌ <strong>不適切な対応です！</strong><br>怒りや負担が蓄積してしまった...！<br>${this.currentQuestion.explain}`;
        }

        // Enemy Turn (if still alive)
        setTimeout(() => {
            let dmg = 20;
            let logMsg = `👿 ${this.activeMonster.name}の攻撃！`;
            
            if (this.activeMonster.id === 'burnout') {
                logMsg += `業務過多と焦燥感によるバーンアウトの精神的プレッシャーで攻撃してきた！`;
            } else if (this.activeMonster.id === 'claim') {
                logMsg += `「すぐ対応しろ！」と理不尽な怒りと大声によるクレーム攻撃を仕掛けてきた！`;
            } else if (this.activeMonster.id === 'papers') {
                logMsg += `山積みの書類と記録漏れによる業務遅延の山で押し潰そうとしてきた！`;
            } else if (this.activeMonster.id === 'harass') {
                logMsg += `「仕事に向いていない」という精神否定のハラスメント暴言攻撃を放ってきた！`;
            } else if (this.activeMonster.id === 'ghost') {
                logMsg += `他職種との連絡ミスによるチームワーク崩壊と孤立の闇で包み込んできた！`;
            }

            if (this.shieldActive) {
                this.shieldActive = false;
                this.element.querySelector('#shield-badge').style.display = 'none';
                this.element.querySelector('#player-battle-box').classList.remove('shield-active');
                logMsg += `<br>🛡️ <strong>しかし、正確な記録による盾（シールド）が攻撃を完全に無効化した！</strong>`;
            } else {
                this.playerHp = Math.max(0, this.playerHp - dmg);
                this.updatePlayerStatsUI();
                
                // Screen Damage Flash
                flash.classList.add('battle-flash');
                setTimeout(() => flash.classList.remove('battle-flash'), 400);

                logMsg += `<br>😢 <strong>${dmg}</strong> のダメージを受けた！`;
            }

            log.innerHTML = logMsg;

            if (this.playerHp <= 0) {
                setTimeout(() => this.endBattle(false), 2500);
            } else {
                // Next turn: enable buttons and show next question
                setTimeout(() => {
                    this.qIdx = (this.qIdx + 1) % this.activeMonster.questions.length;
                    this.currentQuestion = this.activeMonster.questions[this.qIdx];
                    this.renderQuestion();
                    log.textContent = `次の問題が始まります。準備をして答えを選んでください！`;
                }, 2000);
            }

        }, 2500);
    }

    endBattle(isVictory) {
        const d = window.gameState.data;
        const modal = this.element.querySelector('#battle-modal');
        const modalTitle = this.element.querySelector('#modal-battle-title');
        const modalBody = this.element.querySelector('#modal-battle-body');
        const modalClose = this.element.querySelector('#btn-battle-modal-close');

        // Stop Combat Music and restore
        if (window.audioManager) {
            window.audioManager.fadeOut();
        }

        if (isVictory) {
            if (window.audioManager) {
                window.audioManager.playSE('LevelUp.m4a');
            }

            modalTitle.textContent = "🎉 クエストクリア！ 🎉";
            modalTitle.style.color = "#10b981";

            // Reward sequence
            const expReward = 150;
            const careReward = 35;
            const boostedStat = this.activeMonster.statBoost;
            
            d.exp += expReward;
            d.care += careReward;
            d.stats[boostedStat] = Math.min(100, (d.stats[boostedStat] || 30) + 4);
            d.battleDone = true; // Complete quest!

            let lvlMsg = "";
            const expNext = window.gameState.expNext;
            if (d.exp >= expNext) {
                d.exp -= expNext;
                d.level += 1;
                lvlMsg = `<br><span style="color:#d97706; font-size:14px; font-weight:900;">✨ レベルアップ！ Lv.${d.level} に到達！ HPとMPが全回復しました！ ✨</span>`;
                this.playerHp = 100;
                this.playerMp = 100;
            }

            d.hp = this.playerHp;
            d.mp = this.playerMp;
            window.gameState.saveData();

            modalBody.innerHTML = `
                おめでとうございます！適切な専門的対応により、見事に <strong>${this.activeMonster.name}</strong> を解決しました！
                <br><br>
                <strong>獲得したリワード:</strong><br>
                🌟 経験値: <strong>+${expReward} EXP</strong><br>
                💖 ケアポイント: <strong>+${careReward} Care</strong><br>
                💪 成長ステータス: <strong>${boostedStat} が 4 ポイントアップ！</strong>
                ${lvlMsg}
            `;
        } else {
            modalTitle.textContent = "😢 敗北... 😢";
            modalTitle.style.color = "#ef4444";

            d.hp = 20; // restore to a minimal safe value
            d.mp = 15;
            window.gameState.saveData();

            modalBody.innerHTML = `
                業務負担と燃え尽きにより、これ以上戦うことができなくなってしまいました...。
                一度メインハブに戻り、パートナーに相談したりショップでケアアイテムを整えましょう。
                <br><br>
                💡 <strong>「一人で抱え込まず、信頼できる仲間に頼ることも専門職の強さです」</strong>
            `;
        }

        modal.classList.add('active');

        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
            if (window.audioManager) {
                window.audioManager.playBGM(d.currentBgmTrack || 'メインハブ.mp3');
            }
            this.sm.changeScene('mainHub');
        });
    }
}
