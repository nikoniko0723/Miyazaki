class QuestScene extends BaseScene {
    getHtml() {
        return `
        <div style="display:flex; flex-direction:column; height:100%; background:linear-gradient(135deg, #2e1065, #3b0764, #1e1b4b); position:relative; overflow:hidden;">
            <!-- Header -->
            <div style="background:linear-gradient(to right, #78350f, #92400e); border-bottom:3px solid #d97706; padding:10px 14px; display:flex; align-items:center; gap:10px; z-index:5; flex-shrink:0;">
                <button id="quest-back" style="background:#fef3c7; border-color:#d97706; box-shadow:none; padding:4px 12px; font-size:12px; font-weight:bold; color:#78350f;">← 戻る</button>
                <span style="font-size:17px; font-weight:800; color:#fde68a; text-shadow:2px 2px 4px #000;">📜 クエストギルド掲示板</span>
                <span style="margin-left:auto; font-size:13px; font-weight:800; color:#fcd34d; text-shadow:1px 1px 2px #000;" id="quest-care-display">💰 0ケア</span>
            </div>

            <!-- Wood Parchment Tabs (5 categories) -->
            <div style="display:flex; background:rgba(0,0,0,0.4); border-bottom:2px solid #a855f7; z-index:5; flex-shrink:0; overflow-x:auto; white-space:nowrap;">
                <button class="quest-tab active-tab" data-tab="daily" style="flex:1; padding:10px 4px; font-size:10px; font-weight:bold; background:rgba(168,85,247,0.3); border:none; color:#f3e8ff; border-bottom:3px solid #d8b4fe; cursor:pointer;">📅 デイリー</button>
                <button class="quest-tab" data-tab="weekly" style="flex:1; padding:10px 4px; font-size:10px; font-weight:bold; background:transparent; border:none; color:#d8b4fe; border-bottom:3px solid transparent; cursor:pointer;">🗓️ ウィークリー</button>
                <button class="quest-tab" data-tab="event" style="flex:1; padding:10px 4px; font-size:10px; font-weight:bold; background:transparent; border:none; color:#d8b4fe; border-bottom:3px solid transparent; cursor:pointer;">🎉 イベント</button>
                <button class="quest-tab" data-tab="raid" style="flex:1; padding:10px 4px; font-size:10px; font-weight:bold; background:transparent; border:none; color:#d8b4fe; border-bottom:3px solid transparent; cursor:pointer;">👹 レイド</button>
                <button class="quest-tab" data-tab="trial" style="flex:1; padding:10px 4px; font-size:10px; font-weight:bold; background:transparent; border:none; color:#d8b4fe; border-bottom:3px solid transparent; cursor:pointer;">🛡️ 他職種体験</button>
            </div>

            <!-- Content -->
            <div id="quest-content" style="flex:1; overflow-y:auto; padding:12px 10px;"></div>

            <!-- Bottom Nav -->
            <div class="bottom-nav" style="z-index:5; background:rgba(0,0,0,0.5); border-top:2px solid #a855f7;">
                <button id="qnav-home" class="nav-btn" style="color:#d8b4fe;"><span>🏠</span>ホーム</button>
                <button id="qnav-report" class="nav-btn" style="color:#d8b4fe;"><span>📝</span>日報</button>
                <button id="qnav-battle" class="nav-btn" style="color:#d8b4fe;"><span>⚔️</span>バトル</button>
                <button id="qnav-partner" class="nav-btn" style="color:#d8b4fe;"><span>💬</span>ﾊﾟｰﾄﾅｰ</button>
                <button id="qnav-map" class="nav-btn" style="color:#d8b4fe;"><span>🗺️</span>ﾏｯﾌﾟ</button>
                <button id="qnav-shop" class="nav-btn" style="color:#d8b4fe;"><span>🛒</span>ｼｮｯﾌﾟ</button>
                <button class="nav-btn active" style="color:#e9d5ff;"><span>📜</span>クエスト</button>
            </div>
        </div>`;
    }

    init() {
        if (window.audioManager) {
            window.audioManager.playBGM('クエスト2.mp3');
        }
        const d = window.gameState.data;
        
        // Initialize quest structure safely if absent
        if (!d.quests) {
            d.quests = { accepted: [], completed: [], progress: {} };
        }
        if (typeof d.care !== 'number') d.care = 0;

        this.element.querySelector('#quest-care-display').textContent = `💰 ${d.care}ケア`;

        // Nav bindings
        this.element.querySelector('#quest-back').addEventListener('click', () => this.sm.changeScene('mainHub'));
        this.element.querySelector('#qnav-home').addEventListener('click', () => this.sm.changeScene('mainHub'));
        this.element.querySelector('#qnav-report').addEventListener('click', () => this.sm.changeScene('report'));
        this.element.querySelector('#qnav-battle').addEventListener('click', () => this.sm.changeScene('battle'));
        this.element.querySelector('#qnav-partner').addEventListener('click', () => this.sm.changeScene('partner'));
        this.element.querySelector('#qnav-map').addEventListener('click', () => this.sm.changeScene('worldMap'));
        this.element.querySelector('#qnav-shop').addEventListener('click', () => this.sm.changeScene('shop'));

        // Tab Switching
        let currentTab = 'daily';
        const tabs = this.element.querySelectorAll('.quest-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => {
                    t.style.background = 'transparent';
                    t.style.borderBottom = '3px solid transparent';
                    t.style.color = '#d8b4fe';
                });
                tab.style.background = 'rgba(168,85,247,0.3)';
                tab.style.borderBottom = '3px solid #d8b4fe';
                tab.style.color = '#f3e8ff';
                currentTab = tab.dataset.tab;
                this.renderTab(currentTab);
            });
        });

        this.renderTab('daily');
    }

    renderTab(tab) {
        const content = this.element.querySelector('#quest-content');
        const d = window.gameState.data;
        const list = this.getQuestList(tab);

        content.innerHTML = list.map(q => {
            const accepted = d.quests.accepted.includes(q.id);
            const completed = d.quests.completed.includes(q.id);
            
            // Border changes based on quest type
            const borderCol = tab === 'raid' ? '#ef4444' : tab === 'trial' ? '#3b82f6' : tab === 'event' ? '#f59e0b' : '#10b981';
            
            let actionBtn = '';
            if (completed) {
                actionBtn = `<button style="background:#4b5563; border-color:#6b7280; color:#9ca3af; box-shadow:none; padding:6px 12px; font-size:11px; font-weight:bold; border-radius:8px; cursor:default;" disabled>✅ 完了済</button>`;
            } else if (accepted) {
                actionBtn = `<button class="quest-report-btn" data-id="${q.id}" data-exp="${q.exp}" data-care="${q.care}" data-title="${q.name}"
                    style="background:#f59e0b; border-color:#d97706; color:#fff; box-shadow:none; padding:6px 12px; font-size:11px; font-weight:bold; border-radius:8px; cursor:pointer;">報告する</button>`;
            } else {
                actionBtn = `<button class="quest-accept-btn" data-id="${q.id}"
                    style="background:#8b5cf6; border-color:#a78bfa; color:#fff; box-shadow:none; padding:6px 12px; font-size:11px; font-weight:bold; border-radius:8px; cursor:pointer;">受注する</button>`;
            }

            return `
            <div style="background:rgba(255,255,255,0.07); border:2px solid ${borderCol}; border-radius:12px; padding:12px; margin-bottom:10px; display:flex; flex-direction:column; gap:6px;">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:20px;">${q.icon}</span>
                    <div style="flex:1;">
                        <span style="font-weight:800; color:#fde68a; font-size:13px;">${q.name}</span>
                        <span style="font-size:9px; background:rgba(0,0,0,0.4); border:1px solid ${borderCol}; border-radius:4px; padding:1px 4px; color:#fff; margin-left:6px;">${q.tag}</span>
                    </div>
                    ${actionBtn}
                </div>
                <div style="font-size:10px; color:#d1d5db; line-height:1.4;">${q.desc}</div>
                <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.3); border-radius:6px; padding:4px 8px; font-size:10px; font-weight:bold; margin-top:2px;">
                    <span style="color:#fbbf24;">💰 報酬: ${q.care}ケア</span>
                    <span style="color:#38bdf8;">✨ 報酬: +${q.exp} EXP</span>
                </div>
            </div>`;
        }).join('');

        // Bind Accept Buttons
        content.querySelectorAll('.quest-accept-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                d.quests.accepted.push(id);
                window.gameState.saveData();
                if (window.audioManager) window.audioManager.playSE('決定音.mp3');
                alert('📜 クエストを受注しました！条件を達成して「報告」しましょう！');
                this.renderTab(tab);
            });
        });

        // Bind Report/Complete Buttons
        content.querySelectorAll('.quest-report-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const exp = parseInt(btn.dataset.exp);
                const care = parseInt(btn.dataset.care);
                const name = btn.dataset.title;

                // Remove from accepted, add to completed
                d.quests.accepted = d.quests.accepted.filter(x => x !== id);
                d.quests.completed.push(id);

                // Add rewards
                d.care += care;
                d.exp += exp;

                if (window.audioManager) window.audioManager.playSE('レベルアップ.mp3');

                // Check Level Up
                let nextExp = d.lv * 1000;
                let levelUpMessage = '';
                if (d.exp >= nextExp) {
                    d.exp -= nextExp;
                    d.lv += 1;
                    d.maxHp += 10;
                    d.maxMp += 5;
                    d.hp = d.maxHp;
                    d.mp = d.maxMp;
                    levelUpMessage = `\n\n🎉✨ LEVEL UP! 施設長レベルが ${d.lv} に上がりました！ HPとMPが全回復し上限が増加しました！`;
                }

                window.gameState.saveData();
                this.element.querySelector('#quest-care-display').textContent = `💰 ${d.care}ケア`;
                
                alert(`🎉 クエスト「${name}」を報告し、完了しました！\n💰 +${care}ケア を獲得！\n✨ +${exp} EXP を獲得！${levelUpMessage}`);
                this.renderTab(tab);
            });
        });
    }

    getQuestList(tab) {
        if (tab === 'daily') {
            return [
                { id: 'qd01', name: '今日のログイン', icon: '🔑', desc: 'あおぞら福祉法人に出勤(ログイン)して業務を開始する。', care: 20, exp: 10, tag: 'デイリー' },
                { id: 'qd02', name: 'ひとこと日報の提出', icon: '📝', desc: '今日起きた出来事や所感をまとめた日報を1回提出する。', care: 100, exp: 100, tag: 'デイリー' },
                { id: 'qd03', name: 'AIパートナーと会話する', icon: '💬', desc: 'ステータス画面でAIパートナーと話し、日頃のケアについて相談する。', care: 30, exp: 30, tag: 'デイリー' },
                { id: 'qd04', name: '同僚にいいねを送る', icon: '👍', desc: '共に闘う介護・相談援助職の同僚メンバーに感謝の「いいね」を送信する。', care: 20, exp: 20, tag: 'デイリー' }
            ];
        } else if (tab === 'weekly') {
            return [
                { id: 'qw01', name: 'シナリオ体験を3回完了', icon: '📖', desc: 'コンピテンシー事例や権利擁護などの育成シナリオを3回最後まで読み進める。', care: 250, exp: 200, tag: 'ウィークリー' },
                { id: 'qw02', name: '他職種体験を完了する', icon: '🪪', desc: '今週の他職種シミュレーション(適性診断や体験パート)を1回完了する。', care: 300, exp: 250, tag: 'ウィークリー' },
                { id: 'qw03', name: 'モンスターを5体討伐する', icon: '👹', desc: '業務を妨害するメンタル魔獣(バーンアウトやストレス等)を5体討伐する。', care: 400, exp: 350, tag: 'ウィークリー' }
            ];
        } else if (tab === 'event') {
            return [
                { id: 'qe01', name: 'ハラスメント防止月間の学習', icon: '🛡️', desc: '【イベント限定】あおぞら研修：ハラスメント防止月間に基づくコンピテンシー知識クイズを完了する。', care: 500, exp: 400, tag: 'イベント' },
                { id: 'qe02', name: '介護の日記念特別対話', icon: '💐', desc: '【11月11日限定】福祉のやりがいやノーマライゼーションについてAIパートナーと深める特別相談を受ける。', care: 600, exp: 500, tag: 'イベント' }
            ];
        } else if (tab === 'raid') {
            return [
                { id: 'qr01', name: '大型バーンアウト魔獣の共同討伐', icon: '🐲', desc: '【レイドバトル】他施設の相談員や介護職と連携し、巨大なバーンアウト魔獣のコンピテンシー弱点を突き討伐する。', care: 1000, exp: 800, tag: 'レイド' }
            ];
        } else if (tab === 'trial') {
            return [
                { id: 'qt01', name: '月1回適性職種シミュレーション', icon: '⚖️', desc: '【他職種体験】社会福祉士・保育士・OT/PT・看護師・管理栄養士の業務適性診断を受け、コンピテンシー幅を広げる。', care: 800, exp: 600, tag: '適性診断' }
            ];
        }
        return [];
    }
}
