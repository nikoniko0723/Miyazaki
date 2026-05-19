class WorldMapScene extends BaseScene {
    getHtml() {
        return `
            <div id="world-map-scene" style="display:flex; flex-direction:column; height:100%; width:100%;">
                
                <div class="header">
                    <button id="btn-back" style="padding:8px 16px; font-size:12px;">← 戻る</button>
                    <h2 style="font-size:18px; color:var(--blue); font-weight:800; margin:0; margin-left:10px;">🗺️ ワールドマップ</h2>
                </div>
                
                <div id="map-area-container" style="flex:1; position:relative; overflow:hidden;">
                    <!-- Particle Container for Ambient Sparkles -->
                    <div id="map-sparkles-container" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:1;"></div>

                    <!-- Facility Map Buildings (9 main areas) -->
                    <div class="map-building" data-area="hometown" style="top: 25%; left: 30%;"><div class="map-building-label">ホームタウン</div>🏘️</div>
                    <div class="map-building" data-area="silver" style="top: 85%; left: 20%; animation-delay: 0.2s;"><div class="map-building-label">シルバーコテージ</div>🏡</div>
                    <div class="map-building" data-area="work" style="top: 45%; left: 75%; animation-delay: 0.4s;"><div class="map-building-label">ワークシティ</div>🏙️</div>
                    <div class="map-building" data-area="kids" style="top: 25%; left: 70%; animation-delay: 0.6s;"><div class="map-building-label">キッズビレッジ</div>🏫</div>
                    <div class="map-building" data-area="tower" style="top: 60%; left: 60%; animation-delay: 0.8s;"><div class="map-building-label">相談の塔</div>🗼</div>
                    <div class="map-building" data-area="mountain" style="top: 15%; left: 85%; animation-delay: 1.0s;"><div class="map-building-label">専門職の山</div>⛰️</div>
                    <div class="map-building" data-area="kitchen" style="top: 35%; left: 15%; animation-delay: 1.2s;"><div class="map-building-label">まかない厨</div>🍳</div>
                    <div class="map-building" data-area="castle" style="top: 50%; left: 45%; animation-delay: 1.4s; border-color:#d97706;"><div class="map-building-label" style="color:#fcd34d;">本部城</div>🏰</div>
                    <div class="map-building" data-area="hall" style="top: 80%; left: 80%; animation-delay: 1.6s; border-color:#8b5cf6;"><div class="map-building-label" style="color:#c084fc;">殿堂</div>🏛️</div>

                    <!-- Absolute Player Avatar element wrapper -->
                    <div id="map-player-avatar" style="top: 25%; left: 30%;">
                        <img id="map-avatar-img" src="キャラクターjpg/男性.png" style="width:44px; height:44px; filter: hue-rotate(0deg); object-fit:contain;">
                    </div>
                </div>

                <!-- Action / Commands Popover Overlay -->
                <div id="map-modal" class="modal-overlay">
                    <div class="modal-content rpg-parchment" style="max-width:350px;">
                        <h3 id="modal-title" style="margin-bottom:12px; color:#d97706; border-bottom:3px double #d97706; padding-bottom:8px; font-weight:800; font-size:16px;"></h3>
                        <div style="font-size:11px; font-weight:bold; color:#78350f; margin-bottom:12px;" id="modal-desc"></div>
                        <div id="modal-buttons" style="display:flex; flex-direction:column; gap:8px; max-height:220px; overflow-y:auto; margin-bottom:12px;">
                            <!-- Command buttons will be dynamically injected here -->
                        </div>
                        <button id="modal-close" style="width:100%; padding:8px; font-size:13px; background:#ef4444; border-color:#b91c1c; color:#fff; box-shadow:none;">戻る</button>
                    </div>
                </div>

                <!-- Bottom Nav -->
                <div class="bottom-nav">
                    <button id="nav-home" class="nav-btn"><span>🏠</span>ホーム</button>
                    <button id="nav-report" class="nav-btn"><span>📝</span>日報</button>
                    <button id="nav-battle" class="nav-btn"><span>⚔️</span>バトル</button>
                    <button id="nav-shop" class="nav-btn"><span>🛒</span>ｼｮｯﾌﾟ</button>
                    <button id="nav-quest" class="nav-btn"><span>📜</span>クエスト</button>
                    <button id="nav-partner" class="nav-btn"><span>💬</span>ﾊﾟｰﾄﾅｰ</button>
                    <button class="nav-btn active"><span>🗺️</span>ﾏｯﾌﾟ</button>
                </div>
            </div>
        `;
    }

    init() {
        if (window.audioManager) {
            window.audioManager.playBGM('ワールドマップ.mp3');
        }

        const d = window.gameState.data;
        const currentArea = d.currentArea || 'hometown';

        // Coordinates mapping for travel
        const pinCoords = {
            "hometown": { top: 25, left: 30 },
            "silver": { top: 85, left: 20 },
            "work": { top: 45, left: 75 },
            "kids": { top: 25, left: 70 },
            "tower": { top: 60, left: 60 },
            "mountain": { top: 15, left: 85 },
            "kitchen": { top: 35, left: 15 },
            "castle": { top: 50, left: 45 },
            "hall": { top: 80, left: 80 }
        };

        const avatarWrapper = this.element.querySelector('#map-player-avatar');
        const avatarImg = this.element.querySelector('#map-avatar-img');
        
        avatarImg.src = `キャラクターjpg/${d.avatarBase || '男性.png'}`;
        avatarImg.style.filter = `hue-rotate(${d.avatarHue || 0}deg)`;

        const startCoords = pinCoords[currentArea] || pinCoords['hometown'];
        avatarWrapper.style.top = `${startCoords.top}%`;
        avatarWrapper.style.left = `${startCoords.left}%`;

        // Generate glowing sparkles
        const sparklesContainer = this.element.querySelector('#map-sparkles-container');
        sparklesContainer.innerHTML = '';
        for (let i = 0; i < 18; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'map-sparkle';
            sparkle.style.top = `${Math.random() * 100}%`;
            sparkle.style.left = `${Math.random() * 100}%`;
            const size = Math.random() * 12 + 6;
            sparkle.style.width = `${size}px`;
            sparkle.style.height = `${size}px`;
            sparkle.style.animationDelay = `${Math.random() * 4}s`;
            sparkle.style.animationDuration = `${Math.random() * 3 + 2}s`;
            sparklesContainer.appendChild(sparkle);
        }

        // Nav Setup
        const goHome = () => this.sm.changeScene('mainHub');
        this.element.querySelector('#btn-back').addEventListener('click', goHome);
        this.element.querySelector('#nav-home').addEventListener('click', goHome);
        this.element.querySelector('#nav-report').addEventListener('click', () => this.sm.changeScene('report'));
        this.element.querySelector('#nav-partner').addEventListener('click', () => this.sm.changeScene('partner'));
        this.element.querySelector('#nav-battle').addEventListener('click', () => this.sm.changeScene('battle'));
        this.element.querySelector('#nav-shop').addEventListener('click', () => this.sm.changeScene('shop'));
        this.element.querySelector('#nav-quest').addEventListener('click', () => this.sm.changeScene('quest'));

        // Facility details and context-specific building actions
        const areas = {
            "hometown": { title: "🏘️ ホームタウン", desc: "平和な福祉の村。あおぞらホーム・あおぞらグループホームがあります。", sub: "あおぞらホーム / あおぞらグループホーム" },
            "silver": { title: "🏡 シルバーコテージ", desc: "落ち着いたシルバーコテージ。認知症グループホームがあります。", sub: "あおぞら認知症グループホーム" },
            "work": { title: "🏙️ ワークシティ", desc: "活気溢れる就労支援の都市。ワークA・ワークB・就労センターがあります。", sub: "あおぞらワークA / あおぞらワークB / あおぞら就労センター" },
            "kids": { title: "🏫 キッズビレッジ", desc: "笑顔が弾けるこどもの森。あおぞらキッズがあります。", sub: "あおぞらキッズ" },
            "tower": { title: "🗼 相談の塔", desc: "英知が集まる相談支援の塔。発達支援や就業センターも併設。", sub: "あおぞら相談支援センター / あおぞら発達センター / あおぞら就業センター" },
            "mountain": { title: "⛰️ 専門職の山", desc: "スキルアップを目指す専門職チームが待機しています。", sub: "各施設の専門職チーム" },
            "kitchen": { title: "🍳 まかない厨", desc: "健康の源！温かい給食を調理・配給する給食センターです。", sub: "給食センター" },
            "castle": { title: "🏰 本部城", desc: "組織の司令塔、あおぞら福祉法人の本部が聳える城です。", sub: "法人本部" },
            "hall": { title: "🏛️ 殿堂", desc: "施設長Lv.100を達成した伝説のメンバーを称える記念館。", sub: "殿堂入り記念館" }
        };

        const modal = this.element.querySelector('#map-modal');
        const modalTitle = this.element.querySelector('#modal-title');
        const modalDesc = this.element.querySelector('#modal-desc');
        const modalButtons = this.element.querySelector('#modal-buttons');
        const modalClose = this.element.querySelector('#modal-close');

        // Click handler for map buildings
        const buildings = this.element.querySelectorAll('.map-building');
        buildings.forEach(b => {
            b.addEventListener('click', () => {
                const areaKey = b.getAttribute('data-area');
                const areaData = areas[areaKey];
                const targetCoords = pinCoords[areaKey];

                if (window.audioManager) {
                    window.audioManager.playSE('決定音.mp3');
                }

                // If player is not currently at this building, walk there first!
                if (d.currentArea !== areaKey) {
                    avatarWrapper.classList.add('avatar-walking');
                    avatarWrapper.style.top = `${targetCoords.top}%`;
                    avatarWrapper.style.left = `${targetCoords.left}%`;

                    setTimeout(() => {
                        avatarWrapper.classList.remove('avatar-walking');
                        d.currentArea = areaKey;
                        window.gameState.saveData();
                        if (window.audioManager) window.audioManager.playSE('レベルアップ.mp3');
                        this.openCommandMenu(areaKey, areaData);
                    }, 1500);
                } else {
                    this.openCommandMenu(areaKey, areaData);
                }
            });
        });

        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    openCommandMenu(areaKey, areaData) {
        const modal = this.element.querySelector('#map-modal');
        const modalTitle = this.element.querySelector('#modal-title');
        const modalDesc = this.element.querySelector('#modal-desc');
        const modalButtons = this.element.querySelector('#modal-buttons');

        modalTitle.textContent = areaData.title;
        modalDesc.textContent = `${areaData.desc} (所在地: ${areaData.sub})`;
        modalButtons.innerHTML = '';

        // Standard Dragon Quest RPG-like Building Command options
        const commands = [
            { text: "⚔️ 周辺を探索する (モンスター討伐)", action: () => this.sm.changeScene('battle') },
            { text: "🎓 施設長から指導を受ける (SV面談)", action: () => this.sm.changeScene('partner') },
            { text: "🛒 施設売店でお買い物 (ショップ)", action: () => this.sm.changeScene('shop') },
            { text: "📝 業務報告書を提出する (日報)", action: () => this.sm.changeScene('report') }
        ];

        commands.forEach(cmd => {
            const btn = document.createElement('button');
            btn.className = 'sub-facility-btn';
            btn.style.margin = '0';
            btn.style.padding = '10px';
            btn.style.fontSize = '12px';
            btn.innerHTML = `<span style="font-size:12px; color:#d97706; margin-right:4px;">▶</span> ${cmd.text}`;
            btn.addEventListener('click', () => {
                modal.classList.remove('active');
                if (window.audioManager) window.audioManager.playSE('決定音.mp3');
                cmd.action();
            });
            modalButtons.appendChild(btn);
        });

        modal.classList.add('active');
    }
}

