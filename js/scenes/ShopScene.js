class ShopScene extends BaseScene {
    getHtml() {
        return `
        <div style="display:flex;flex-direction:column;height:100%;background:linear-gradient(135deg,#1e1b4b,#312e81,#4c1d95);position:relative;overflow:hidden;">
            <!-- Header -->
            <div style="background:linear-gradient(to right,#78350f,#92400e);border-bottom:3px solid #d97706;padding:10px 14px;display:flex;align-items:center;gap:10px;z-index:5;flex-shrink:0;">
                <button id="shop-back" style="background:#fef3c7;border-color:#d97706;box-shadow:none;padding:4px 12px;font-size:12px;font-weight:bold;color:#78350f;">← 戻る</button>
                <span style="font-size:17px;font-weight:800;color:#fde68a;text-shadow:2px 2px 4px #000;">🛒 アドベンチャーショップ</span>
                <span style="margin-left:auto;font-size:13px;font-weight:800;color:#fcd34d;text-shadow:1px 1px 2px #000;" id="shop-care-display">💰 0ケア</span>
            </div>

            <!-- Tabs -->
            <div style="display:flex;background:rgba(0,0,0,0.3);border-bottom:2px solid #7c3aed;z-index:5;flex-shrink:0;">
                <button class="shop-tab active-tab" data-tab="weapons" style="flex:1;padding:8px 2px;font-size:11px;font-weight:bold;background:rgba(124,58,237,0.4);border:none;color:#e9d5ff;border-bottom:3px solid #a78bfa;cursor:pointer;">⚔️ 武器</button>
                <button class="shop-tab" data-tab="armor" style="flex:1;padding:8px 2px;font-size:11px;font-weight:bold;background:transparent;border:none;color:#c4b5fd;border-bottom:3px solid transparent;cursor:pointer;">🛡️ 防具</button>
                <button class="shop-tab" data-tab="items" style="flex:1;padding:8px 2px;font-size:11px;font-weight:bold;background:transparent;border:none;color:#c4b5fd;border-bottom:3px solid transparent;cursor:pointer;">🎒 アイテム</button>
                <button class="shop-tab" data-tab="titles" style="flex:1;padding:8px 2px;font-size:11px;font-weight:bold;background:transparent;border:none;color:#c4b5fd;border-bottom:3px solid transparent;cursor:pointer;">🏆 称号</button>
            </div>

            <!-- Content -->
            <div id="shop-content" style="flex:1;overflow-y:auto;padding:10px;"></div>

            <!-- Bottom Nav -->
            <div class="bottom-nav" style="z-index:5;background:rgba(0,0,0,0.5);border-top:2px solid #7c3aed;">
                <button id="snav-home" class="nav-btn" style="color:#c4b5fd;"><span>🏠</span>ホーム</button>
                <button id="snav-report" class="nav-btn" style="color:#c4b5fd;"><span>📝</span>日報</button>
                <button id="snav-battle" class="nav-btn" style="color:#c4b5fd;"><span>⚔️</span>バトル</button>
                <button id="snav-partner" class="nav-btn" style="color:#c4b5fd;"><span>💬</span>ﾊﾟｰﾄﾅｰ</button>
                <button class="nav-btn active" style="color:#a78bfa;"><span>🛒</span>ｼｮｯﾌﾟ</button>
                <button id="snav-quest" class="nav-btn" style="color:#c4b5fd;"><span>📜</span>クエスト</button>
            </div>
        </div>`;
    }

    init() {
        if (window.audioManager) {
            window.audioManager.playBGM('ショップ.mp3');
        }
        const d = window.gameState.data;
        if (!d.inventory) d.inventory = { weapons: [], armor: [], items: [] };
        if (!d.titles) d.titles = [];
        if (!d.equippedTitle) d.equippedTitle = null;
        if (typeof d.care !== 'number') d.care = 0;

        this.element.querySelector('#shop-care-display').textContent = `💰 ${d.care}ケア`;

        // Nav bindings
        this.element.querySelector('#shop-back').addEventListener('click', () => this.sm.changeScene('mainHub'));
        this.element.querySelector('#snav-home').addEventListener('click', () => this.sm.changeScene('mainHub'));
        this.element.querySelector('#snav-report').addEventListener('click', () => this.sm.changeScene('report'));
        this.element.querySelector('#snav-battle').addEventListener('click', () => this.sm.changeScene('battle'));
        this.element.querySelector('#snav-partner').addEventListener('click', () => this.sm.changeScene('partner'));
        this.element.querySelector('#snav-quest').addEventListener('click', () => this.sm.changeScene('quest'));

        // Tab switching
        let currentTab = 'weapons';
        const tabs = this.element.querySelectorAll('.shop-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => {
                    t.style.background = 'transparent';
                    t.style.borderBottom = '3px solid transparent';
                    t.style.color = '#c4b5fd';
                });
                tab.style.background = 'rgba(124,58,237,0.4)';
                tab.style.borderBottom = '3px solid #a78bfa';
                tab.style.color = '#e9d5ff';
                currentTab = tab.dataset.tab;
                this.renderTab(currentTab);
            });
        });

        this.renderTab('weapons');
    }

    rarityStars(r) {
        const map = { 1:'★', 2:'★★', 3:'★★★', 4:'★★★★', 5:'★★★★★' };
        const col = { 1:'#9ca3af', 2:'#34d399', 3:'#60a5fa', 4:'#c084fc', 5:'#fbbf24' };
        return `<span style="color:${col[r]||'#fff'};font-size:11px;">${map[r]||'★'}</span>`;
    }

    renderTab(tab) {
        const content = this.element.querySelector('#shop-content');
        const d = window.gameState.data;

        if (tab === 'weapons') content.innerHTML = this.renderItems(this.getWeapons(), 'weapon', d);
        else if (tab === 'armor') content.innerHTML = this.renderItems(this.getArmor(), 'armor', d);
        else if (tab === 'items') content.innerHTML = this.renderItems(this.getConsumables(), 'item', d);
        else if (tab === 'titles') content.innerHTML = this.renderTitles(d);

        // Bind buy buttons
        content.querySelectorAll('.shop-buy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const price = parseInt(btn.dataset.price);
                const type = btn.dataset.type;
                const name = btn.dataset.name;
                this.handleBuy(id, price, type, name);
            });
        });
        // Bind equip title buttons
        content.querySelectorAll('.equip-title-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                d.equippedTitle = btn.dataset.id;
                window.gameState.saveData();
                this.renderTab('titles');
            });
        });
    }

    handleBuy(id, price, type, name) {
        const d = window.gameState.data;
        if (d.care < price) { alert('ケアが足りません！'); return; }
        const inv = type === 'weapon' ? d.inventory.weapons : type === 'armor' ? d.inventory.armor : d.inventory.items;
        if (inv.includes(id)) { alert('すでに持っています！'); return; }
        d.care -= price;
        inv.push(id);
        window.gameState.saveData();
        this.element.querySelector('#shop-care-display').textContent = `💰 ${d.care}ケア`;
        alert(`✅「${name}」を購入しました！`);
        this.renderTab(type === 'weapon' ? 'weapons' : type === 'armor' ? 'armor' : 'items');
    }

    renderItems(items, type, d) {
        const inv = type === 'weapon' ? d.inventory.weapons : type === 'armor' ? d.inventory.armor : d.inventory.items;
        return items.map(item => {
            const owned = inv.includes(item.id);
            const borderCol = item.rarity >= 5 ? '#fbbf24' : item.rarity >= 4 ? '#c084fc' : item.rarity >= 3 ? '#60a5fa' : '#4ade80';
            return `
            <div style="background:rgba(255,255,255,0.07);border:2px solid ${borderCol};border-radius:12px;padding:10px 12px;margin-bottom:8px;display:flex;align-items:center;gap:10px;">
                <div style="font-size:26px;flex-shrink:0;">${item.icon}</div>
                <div style="flex:1;min-width:0;">
                    <div style="font-weight:800;color:#fde68a;font-size:13px;">${item.name} ${this.rarityStars(item.rarity)}</div>
                    <div style="font-size:10px;color:#d1d5db;margin-top:2px;">${item.desc}</div>
                    <div style="font-size:11px;color:#fcd34d;margin-top:4px;font-weight:bold;">💰 ${item.price}ケア</div>
                </div>
                <button class="shop-buy-btn" data-id="${item.id}" data-price="${item.price}" data-type="${type}" data-name="${item.name}"
                    style="background:${owned?'#374151':'#7c3aed'};border-color:${owned?'#6b7280':'#a78bfa'};color:#fff;box-shadow:none;padding:6px 10px;font-size:11px;font-weight:bold;border-radius:8px;cursor:${owned?'default':'pointer'};white-space:nowrap;"
                    ${owned ? 'disabled' : ''}>
                    ${owned ? '✅ 所持済' : '購入'}
                </button>
            </div>`;
        }).join('');
    }

    renderTitles(d) {
        return this.getTitles().map(t => {
            const unlocked = d.titles.includes(t.id);
            const equipped = d.equippedTitle === t.id;
            return `
            <div style="background:rgba(255,255,255,0.07);border:2px solid ${unlocked?'#fbbf24':'#4b5563'};border-radius:12px;padding:10px 12px;margin-bottom:8px;display:flex;align-items:center;gap:10px;opacity:${unlocked?1:0.5};">
                <div style="font-size:22px;">${unlocked?'🏆':'🔒'}</div>
                <div style="flex:1;">
                    <div style="font-weight:800;color:${unlocked?'#fde68a':'#9ca3af'};font-size:13px;">${t.name} ${this.rarityStars(t.rarity)}</div>
                    <div style="font-size:10px;color:#d1d5db;margin-top:2px;">条件: ${t.cond}</div>
                </div>
                ${unlocked ? `<button class="equip-title-btn" data-id="${t.id}" style="background:${equipped?'#065f46':'#1d4ed8'};border-color:${equipped?'#34d399':'#60a5fa'};color:#fff;box-shadow:none;padding:6px 10px;font-size:11px;font-weight:bold;border-radius:8px;cursor:pointer;">
                    ${equipped?'✅ 装備中':'装備する'}
                </button>` : ''}
            </div>`;
        }).join('');
    }

    getWeapons() {
        return [
            {id:'w01',name:'傾聴の杖',icon:'🪄',rarity:1,price:50,desc:'初級・傾聴スキルが上がる'},
            {id:'w02',name:'記録の羽ペン',icon:'🪶',rarity:1,price:50,desc:'初級・記録力アップ'},
            {id:'w03',name:'共感のハンドベル',icon:'🔔',rarity:1,price:60,desc:'初級・相談力アップ'},
            {id:'w04',name:'挨拶の盾剣',icon:'🤝',rarity:1,price:60,desc:'初級・信頼力アップ'},
            {id:'w05',name:'報告・連絡の旗',icon:'🚩',rarity:1,price:70,desc:'初級・チームワーク強化'},
            {id:'w06',name:'個別支援計画の書',icon:'📋',rarity:1,price:80,desc:'初級・専門力アップ'},
            {id:'w07',name:'自己紹介の名刺剣',icon:'💼',rarity:1,price:60,desc:'初級・信頼力＋意欲アップ'},
            {id:'w08',name:'社会福祉士の剣',icon:'⚔️',rarity:2,price:200,desc:'中級・専門力大アップ'},
            {id:'w09',name:'アセスメントの弓',icon:'🏹',rarity:2,price:220,desc:'中級・相談力大アップ'},
            {id:'w10',name:'エンパワーメントの槍',icon:'🔱',rarity:2,price:250,desc:'中級・意欲大アップ'},
            {id:'w11',name:'ストレングスの大剣',icon:'🗡️',rarity:2,price:280,desc:'中級・全属性強化'},
            {id:'w12',name:'危機介入の短剣',icon:'🔪',rarity:2,price:240,desc:'中級・速攻型スキル'},
            {id:'w13',name:'情報共有の水晶球',icon:'🔮',rarity:2,price:260,desc:'中級・連携強化'},
            {id:'w14',name:'保育士のリボンウィップ',icon:'🎀',rarity:2,price:230,desc:'中級・児童支援特化'},
            {id:'w15',name:'言語聴覚士の音叉剣',icon:'🎵',rarity:2,price:240,desc:'中級・コミュ力強化'},
            {id:'w16',name:'OTの魔法杖',icon:'✨',rarity:2,price:250,desc:'中級・作業療法特化'},
            {id:'w17',name:'PTのバランスの杖',icon:'⚖️',rarity:2,price:250,desc:'中級・体力耐性アップ'},
            {id:'w18',name:'看護師の注射剣',icon:'💉',rarity:2,price:260,desc:'中級・HP回復効果'},
            {id:'w19',name:'管理栄養士の包丁',icon:'🍳',rarity:2,price:230,desc:'中級・体力耐性強化'},
            {id:'w20',name:'精神保健福祉士の鎖鎌',icon:'⛓️',rarity:3,price:800,desc:'上級レア・精神科特化'},
            {id:'w21',name:'ICFの大剣',icon:'🗡️',rarity:3,price:900,desc:'上級レア・全能力大幅強化'},
            {id:'w22',name:'障害者権利条約の剣',icon:'🌟',rarity:3,price:1000,desc:'上級レア・権利擁護強化'},
            {id:'w23',name:'ノーマライゼーションの旗',icon:'🏳️',rarity:3,price:950,desc:'上級レア・社会参加強化'},
            {id:'w24',name:'理事長の印鑑剣',icon:'🖋️',rarity:4,price:0,desc:'最高レア・クエスト報酬のみ'},
            {id:'w25',name:'伝説の支援計画書',icon:'📜',rarity:5,price:0,desc:'最高レア・報酬専用'},
        ];
    }

    getArmor() {
        return [
            {id:'a01',name:'自己ケアの盾',icon:'🛡️',rarity:1,price:50,desc:'初級・HP回復量アップ'},
            {id:'a02',name:'職員証のお守り',icon:'🪪',rarity:1,price:40,desc:'初級・帰属感アップ'},
            {id:'a03',name:'ユニフォームの誇り',icon:'👔',rarity:1,price:50,desc:'初級・倫理観アップ'},
            {id:'a04',name:'休憩室のスリッパ',icon:'🩴',rarity:1,price:40,desc:'初級・MP回復速度アップ'},
            {id:'a05',name:'笑顔のマスク',icon:'😊',rarity:1,price:45,desc:'初級・ストレス軽減'},
            {id:'a06',name:'SVの鎧',icon:'🏋️',rarity:2,price:220,desc:'中級・全防御力アップ'},
            {id:'a07',name:'倫理綱領のローブ',icon:'📿',rarity:2,price:200,desc:'中級・倫理観大アップ'},
            {id:'a08',name:'バウンダリーの壁',icon:'🧱',rarity:2,price:250,desc:'中級・精神ダメージ軽減'},
            {id:'a09',name:'レジリエンスの靴',icon:'👟',rarity:2,price:230,desc:'中級・回復力強化'},
            {id:'a10',name:'仲間の絆マント',icon:'🧣',rarity:2,price:240,desc:'中級・チームバフ'},
            {id:'a11',name:'ハラスメント防止の鎧',icon:'⚔️',rarity:2,price:260,desc:'中級・精神防御特化'},
            {id:'a12',name:'メンタルヘルスの指輪',icon:'💍',rarity:2,price:200,desc:'中級・MP最大値アップ'},
            {id:'a13',name:'アドボカシーの盾',icon:'🪬',rarity:2,price:240,desc:'中級・権利擁護強化'},
            {id:'a14',name:'研修修了のガウン',icon:'🎓',rarity:2,price:220,desc:'中級・専門力アップ'},
            {id:'a15',name:'施設長の承認の首飾り',icon:'📿',rarity:3,price:800,desc:'上級・全ステータス強化'},
            {id:'a16',name:'有休消化の鎧',icon:'🏖️',rarity:3,price:850,desc:'上級・HP最大値大幅アップ'},
            {id:'a17',name:'ベテランの風格マント',icon:'👘',rarity:3,price:900,desc:'上級・全防御力大幅強化'},
            {id:'a18',name:'チームの絆のブレスレット',icon:'📿',rarity:3,price:780,desc:'上級・チーム能力強化'},
            {id:'a19',name:'理事長の紋章',icon:'🏅',rarity:5,price:0,desc:'最高レア・報酬専用'},
        ];
    }

    getConsumables() {
        return [
            {id:'i01',name:'有休の薬草',icon:'🌿',rarity:1,price:30,desc:'HP+30回復'},
            {id:'i02',name:'ハーブティーの茶葉',icon:'🍵',rarity:1,price:25,desc:'MP+20回復'},
            {id:'i03',name:'同僚の差し入れ',icon:'🍩',rarity:1,price:20,desc:'HP+15 MP+15回復'},
            {id:'i04',name:'コーヒーの香り',icon:'☕',rarity:1,price:20,desc:'集中力アップ'},
            {id:'i05',name:'昼休みのお弁当',icon:'🍱',rarity:1,price:35,desc:'HP+40回復'},
            {id:'i06',name:"仲間の「お疲れ様」カード",icon:'💌',rarity:2,price:80,desc:'精神ダメージ回復'},
            {id:'i07',name:'アロマの香り',icon:'🕯️',rarity:2,price:70,desc:'MP+40回復'},
            {id:'i08',name:'傾聴のポーション',icon:'🧪',rarity:2,price:100,desc:'相談力一時強化'},
            {id:'i09',name:'褒め言葉の秘薬',icon:'✨',rarity:2,price:120,desc:'全ステ一時強化'},
            {id:'i10',name:'特別休暇のエリクサー',icon:'💎',rarity:3,price:300,desc:'HP・MPフル回復'},
            {id:'i11',name:'研修テキスト',icon:'📚',rarity:2,price:100,desc:'EXP獲得量アップ'},
            {id:'i12',name:'スーパービジョンの書',icon:'📖',rarity:2,price:150,desc:'コンピテンシー強化'},
            {id:'i13',name:'外部研修受講証',icon:'🎫',rarity:2,price:120,desc:'専門力アップ'},
            {id:'i14',name:'利用者からの感謝の手紙',icon:'💝',rarity:3,price:200,desc:'意欲・信頼力大アップ'},
            {id:'i15',name:'表彰状',icon:'🏅',rarity:3,price:250,desc:'全属性ボーナス'},
            {id:'i16',name:'職員旅行の土産',icon:'🧧',rarity:2,price:80,desc:'チーム絆アップ'},
            {id:'i17',name:'成功体験カード',icon:'🌟',rarity:2,price:100,desc:'意欲大アップ'},
            {id:'i18',name:'朝のラジオ体操スタンプ',icon:'🏃',rarity:1,price:30,desc:'体力耐性アップ'},
            {id:'i19',name:'救急救命講習修了証',icon:'🚑',rarity:2,price:130,desc:'緊急対応力アップ'},
            {id:'i20',name:'避難訓練マニュアル',icon:'📋',rarity:2,price:100,desc:'安全管理アップ'},
            {id:'i21',name:'法人設立記念グッズ',icon:'🎁',rarity:2,price:90,desc:'帰属感アップ'},
            {id:'i22',name:'福祉機器カタログ',icon:'📱',rarity:2,price:110,desc:'専門知識アップ'},
            {id:'i23',name:'障害者手帳モデル',icon:'🪪',rarity:2,price:120,desc:'理解力アップ'},
            {id:'i24',name:'支援ツールセット',icon:'🧰',rarity:3,price:200,desc:'全支援スキル強化'},
            {id:'i25',name:'伝説のコンピテンシー手帳',icon:'📓',rarity:4,price:500,desc:'全コンピテンシー強化'},
            {id:'i26',name:'理事長のことば',icon:'📜',rarity:5,price:0,desc:'報酬専用・魂に刻まれる'},
        ];
    }

    getTitles() {
        return [
            {id:'t01',name:'傾聴の達人',rarity:3,cond:'傾聴スキルLv.MAX'},
            {id:'t02',name:'バーンアウトを知る者',rarity:3,cond:'バーンアウト関連クエスト全クリア'},
            {id:'t03',name:'ハラスメントゼロの守護者',rarity:4,cond:'特定シナリオ全問正解'},
            {id:'t04',name:'チームの柱',rarity:3,cond:'仲間相談回答100回'},
            {id:'t05',name:'百戦錬磨',rarity:4,cond:'クエスト500回クリア'},
            {id:'t06',name:'万能福祉人',rarity:5,cond:'全職種体験クリア'},
            {id:'t07',name:'理事長に認められし者',rarity:5,cond:'理事長クエストクリア'},
            {id:'t08',name:'あおぞらの誇り',rarity:5,cond:'施設長Lv.100達成'},
        ];
    }
}
