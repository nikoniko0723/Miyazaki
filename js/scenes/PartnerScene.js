class PartnerScene extends BaseScene {
    getHtml() {
        const d = window.gameState.data;
        const currentGrade = d.grade || 1;

        return `
            <div id="partner-scene" style="display:flex; flex-direction:column; height:100%; width:100%; position:relative; overflow:hidden;">
                
                <!-- Background Sparkle Effect -->
                <div class="sparkle-bg"></div>
                <div id="partner-particles"></div>
                
                <!-- Header -->
                <div class="header" style="z-index: 5;">
                    <button id="btn-back-hub" style="padding:8px 16px; font-size:12px;">← 戻る</button>
                    <h2 style="font-size:18px; color:var(--blue); font-weight:800; margin:0; margin-left:10px;">パートナー交流</h2>
                </div>

                <div class="content" style="padding-top: 10px; display:flex; gap:16px; z-index:5; flex:1; overflow-y:auto; flex-direction:column; justify-content:space-between;">
                    
                    <!-- Top: Character & Chat bubble -->
                    <div style="display:flex; align-items:center; justify-content:center; gap:20px; flex: 1; min-height: 180px;">
                        <!-- Live Animated Partner -->
                        <div style="display:flex; flex-direction:column; align-items:center; position:relative;">
                            <img id="scene-partner-img" src="${d.partner}" class="partner-img partner-live-anim" style="width:130px; height:130px; filter:drop-shadow(0 8px 16px rgba(0,0,0,0.4));">
                            <span class="rpg-ribbon" style="margin-top:-10px; z-index:3; padding: 2px 12px; font-size:10px; background: linear-gradient(to bottom, #10b981, #047857); border-color:#34d399;">${d.partner.split('/').pop().replace('.png', '')}</span>
                        </div>
                        
                        <!-- Chat Bubble -->
                        <div class="rpg-wood-panel" style="flex:1; max-width:320px; padding:12px; position:relative; min-height: 100px; display:flex; flex-direction:column; justify-content:center;">
                            <div style="font-size:11px; color:#fde68a; font-weight:bold; margin-bottom:4px; border-bottom:1px solid rgba(255,255,255,0.2);">パートナー</div>
                            <div id="partner-response" style="font-size:13px; font-weight:bold; line-height:1.5; color:#fff; text-shadow:1px 1px 2px #000;">
                                なにかお手伝いできることはある？それともお話しする？
                            </div>
                        </div>
                    </div>

                    <!-- Bottom: Choices / Submenu -->
                    <div class="rpg-parchment" style="padding:16px; border-radius:16px; border:3px solid #d97706; background:#fff; margin-bottom:8px; z-index:10; min-height: 220px; display:flex; flex-direction:column; justify-content:center;">
                        
                        <!-- Main Partner Options -->
                        <div id="partner-menu-main" style="display:flex; flex-direction:column; gap:8px; width:100%;">
                            <button class="primary" id="btn-partner-help" style="padding:10px; font-size:14px;">🛠️ 何かお手伝いする？</button>
                            <button class="primary" id="btn-partner-supervision" style="padding:10px; font-size:14px;">🎓 スーパービジョンを受ける</button>
                            <button class="primary" id="btn-partner-chat" style="padding:10px; font-size:14px;">💬 AIパートナーと会話する</button>
                        </div>

                        <!-- Sub-menu: Help -->
                        <div id="partner-menu-help" style="display:none; flex-direction:column; gap:6px; width:100%;">
                            <div style="font-size:12px; font-weight:bold; color:#b45309; text-align:center; margin-bottom:6px;">🛠️ アシストツール</div>
                            <button class="sub-btn-tool" style="font-size:12px; padding:8px; background:#fef3c7; border-color:#d97706;">📷 手書きメモをスキャンして文章化</button>
                            <button class="sub-btn-tool" style="font-size:12px; padding:8px; background:#fef3c7; border-color:#d97706;">🎙️ 音声入力で日報アシスト</button>
                            <button class="sub-btn-tool" style="font-size:12px; padding:8px; background:#fef3c7; border-color:#d97706;">⏺️ ボイスレコーダー（文字起こし準備）</button>
                            <button class="sub-btn-tool" style="font-size:12px; padding:8px; background:#fef3c7; border-color:#d97706;">🔍 文章チェック・校正</button>
                            <button class="sub-btn-tool" style="font-size:12px; padding:8px; background:#fef3c7; border-color:#d97706;">✉️ メールの返信文章を考える</button>
                            <button class="btn-partner-cancel" style="margin-top:6px; padding:6px; font-size:12px; background:#e5e7eb; border-color:#9ca3af;">戻る</button>
                        </div>

                        <!-- Sub-menu: Supervision -->
                        <div id="partner-menu-supervision" style="display:none; flex-direction:column; gap:6px; width:100%;">
                            <div style="font-size:12px; font-weight:bold; color:#b45309; text-align:center; margin-bottom:4px;">🎓 スーパービジョン相談室</div>
                            
                            <!-- Grade Selector -->
                            <div style="display:flex; flex-direction:column; gap:4px; margin-bottom:8px; border-bottom:1px dashed #ca8a04; padding-bottom:8px;">
                                <label style="font-size:10px; font-weight:bold; color:#78350f;">現在の等級を選択してください：</label>
                                <select id="select-sv-grade" style="width:100%; padding:6px; font-size:11px; border:2px solid #ca8a04; border-radius:6px; font-weight:bold; font-family:inherit; color:#78350f; background:#fff8e1;">
                                    <option value="1" ${currentGrade === 1 ? 'selected' : ''}>1等級 (入職1〜2年目：基本ルール・姿勢習得)</option>
                                    <option value="2" ${currentGrade === 2 ? 'selected' : ''}>2等級 (入職2〜4年目：基本業務の自立・自律支援)</option>
                                    <option value="3" ${currentGrade === 3 ? 'selected' : ''}>3等級 (入職4〜7年目：複雑業務の主体的遂行・OJT指導)</option>
                                    <option value="4" ${currentGrade === 4 ? 'selected' : ''}>4等級 (主任レベル：チーム管理・後輩育成・調整)</option>
                                </select>
                            </div>

                            <button class="sub-btn-sv" data-topic="client" style="font-size:12px; padding:8px; background:#ecfdf5; border-color:#10b981;">💼 利用者支援での悩みについて相談</button>
                            <button class="sub-btn-sv" data-topic="safety" style="font-size:12px; padding:8px; background:#ecfdf5; border-color:#10b981;">⚠️ ヒヤリハット・安全対策について相談</button>
                            <button class="sub-btn-sv" data-topic="career" style="font-size:12px; padding:8px; background:#ecfdf5; border-color:#10b981;">📈 キャリア支援・セルフストレス管理の相談</button>
                            <button class="btn-partner-cancel" style="margin-top:4px; padding:6px; font-size:12px; background:#e5e7eb; border-color:#9ca3af;">戻る</button>
                        </div>

                        <!-- Sub-menu: Interactive Chat -->
                        <div id="partner-menu-chat" style="display:none; flex-direction:column; height:100%; width:100%;">
                            <div style="font-size:12px; font-weight:bold; color:#b45309; text-align:center; margin-bottom:4px;">💬 パートナーチャット</div>
                            <div id="chat-box" style="flex:1; max-height:120px; overflow-y:auto; border:2px solid #e5e7eb; border-radius:8px; padding:6px; margin-bottom:6px; background:#f9fafb; font-size:11px; display:flex; flex-direction:column; gap:4px;">
                                <!-- Chat history -->
                            </div>
                            <div style="display:flex; gap:6px;">
                                <input type="text" id="chat-input" placeholder="メッセージを入力..." style="flex:1; font-family:inherit; font-size:12px; padding:6px; border:2px solid #d97706; border-radius:8px; outline:none;">
                                <button id="btn-chat-send" style="padding:6px 12px; font-size:12px; background:#fde047; border-color:#ca8a04;">送信</button>
                            </div>
                            <button class="btn-partner-cancel" style="margin-top:6px; padding:4px; font-size:11px; background:#e5e7eb; border-color:#9ca3af;">戻る</button>
                        </div>

                    </div>
                </div>

                <!-- Bottom Nav -->
                <div class="bottom-nav" style="z-index:5;">
                    <button id="nav-home" class="nav-btn"><span>🏠</span>ホーム</button>
                    <button id="nav-report" class="nav-btn"><span>📝</span>日報</button>
                    <button id="nav-battle" class="nav-btn"><span>⚔️</span>バトル</button>
                    <button id="nav-shop" class="nav-btn"><span>🛒</span>ｼｮｯﾌﾟ</button>
                    <button id="nav-quest" class="nav-btn"><span>📜</span>クエスト</button>
                    <button class="nav-btn active"><span>💬</span>ﾊﾟｰﾄﾅｰ</button>
                    <button id="nav-map" class="nav-btn"><span>🗺️</span>ﾏｯﾌﾟ</button>
                </div>
            </div>
        `;
    }

    init() {
        if (window.audioManager) {
            window.audioManager.playBGM('選択画面.mp3');
        }

        // Generate Particles for partner screen
        const pContainer = this.element.querySelector('#partner-particles');
        for(let i=0; i<15; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = Math.random() * 100 + '%';
            p.style.width = Math.random() * 3 + 2 + 'px';
            p.style.height = p.style.width;
            p.style.animationDelay = Math.random() * 4 + 's';
            p.style.animationDuration = Math.random() * 2 + 3 + 's';
            pContainer.appendChild(p);
        }

        const d = window.gameState.data;
        const pName = d.partner.split('/').pop().replace('.png', '');
        const sm = this.sm;
        
        // Navigation Setup
        const goHome = () => this.sm.changeScene('mainHub');
        const goReport = () => {
            if (window.audioManager) window.audioManager.playBGM('日報.mp3');
            this.sm.changeScene('report');
        };
        const goMap = () => {
            if (window.audioManager) window.audioManager.playBGM('ワールドマップ.mp3');
            this.sm.changeScene('worldMap');
        };
        const goBattle = () => {
            this.sm.changeScene('battle');
        };

        this.element.querySelector('#btn-back-hub').addEventListener('click', goHome);
        this.element.querySelector('#nav-home').addEventListener('click', goHome);
        this.element.querySelector('#nav-report').addEventListener('click', goReport);
        this.element.querySelector('#nav-battle').addEventListener('click', goBattle);
        this.element.querySelector('#nav-shop').addEventListener('click', () => this.sm.changeScene('shop'));
        this.element.querySelector('#nav-quest').addEventListener('click', () => this.sm.changeScene('quest'));
        this.element.querySelector('#nav-map').addEventListener('click', goMap);

        // Menu Toggle Elements
        const menuMain = this.element.querySelector('#partner-menu-main');
        const menuHelp = this.element.querySelector('#partner-menu-help');
        const menuSV = this.element.querySelector('#partner-menu-supervision');
        const menuChat = this.element.querySelector('#partner-menu-chat');
        const responseText = this.element.querySelector('#partner-response');

        // Initial Greeting responses based on personality
        const greetings = {
            "ホタル": "……私のこと、呼んでくれた？今日はなにかお手伝いできるかな？それとも、少しお話しする……？",
            "モフリン": "もふもふ〜！今日もよろしくもふ！なにかお手伝いもふ？それとももふもふお話しするもふ？",
            "フクロ博士": "お疲れ様です。本日はどのような対話を行いましょうか。各種サポートツール、スーパービジョン、あるいは日常対話、どれでも対応可能ですぞ。",
            "コダマ": "お疲れ様！今日も君がいてくれて嬉しいよ！なにかお手伝いしようか？それとも楽しくおしゃべりしちゃう？",
            "ニャンガイド": "お疲れニャン。用事があるならさっさと選びなさいニャ。私は忙しい（お昼寝で）んだからニャ！",
            "ポポン": "バイタルチェック完了。なにかお手伝いですか？スーパービジョンですか？リラックスしたおしゃべりも推奨されますよ。",
            "ルーン": "オウ！来たな！オレになにか手伝えることはあるか！？熱いおしゃべりでも、悩み相談でも、全力で受け止めるぜッ！",
            "ぷにょ": "……ぷにょ……（じーっ）……（なにかする？……お話し、する？）",
            "ミルフィー": "お疲れ様ですっ！なにかお手伝いしちゃいますか？それともちょっと雑談してテンション上げちゃいましょう！",
            "クマたろう": "おお、お疲れさん。今日も本当によく頑張ったな。手伝えることがあれば何でも言いなさい。ゆっくり話そう。",
            "コン": "お疲れ様です。業務を効率化するためのサポートツールをお使いですか？それとも本日の支援についての振り返りですか？",
            "わたぼう": "おつかれさまぁ……。なにかお手伝いすることぉ、あるかなぁ……？それとも一緒にのんびりお話しするぅ……？",
            "えっちゃん": "あら、なによ。私になにか手伝ってほしいことでもあるわけ？……フン、暇だし、話くらいは聞いてあげるわよ。"
        };

        responseText.textContent = greetings[pName] || "なにかお手伝いできることはある？それともお話しする？";

        // Grade selector binding
        const gradeSelector = this.element.querySelector('#select-sv-grade');
        gradeSelector.addEventListener('change', (e) => {
            d.grade = parseInt(e.target.value);
            window.gameState.saveData();
        });

        // Main Menu Button Handlers
        this.element.querySelector('#btn-partner-help').addEventListener('click', () => {
            menuMain.style.display = 'none';
            menuHelp.style.display = 'flex';
            responseText.textContent = pName + "「アシストツールですね！どれを使ってお仕事を効率化しますか？」";
        });

        this.element.querySelector('#btn-partner-supervision').addEventListener('click', () => {
            menuMain.style.display = 'none';
            menuSV.style.display = 'flex';
            responseText.textContent = pName + "「スーパービジョンですね。あなたの等級に合わせたあおぞら福祉会のコンピテンシー評価基準に則って、具体的なフィードバックを行いましょう！」";
        });

        this.element.querySelector('#btn-partner-chat').addEventListener('click', () => {
            menuMain.style.display = 'none';
            menuChat.style.display = 'flex';
            responseText.textContent = pName + "「おしゃべりだね！私に何か話しかけてみて！」";
            this.initChatSystem();
        });

        // Cancel/Back buttons
        this.element.querySelectorAll('.btn-partner-cancel').forEach(btn => {
            btn.addEventListener('click', () => {
                menuHelp.style.display = 'none';
                menuSV.style.display = 'none';
                menuChat.style.display = 'none';
                menuMain.style.display = 'flex';
                responseText.textContent = greetings[pName] || "なにかお手伝いできることはある？それともお話しする？";
            });
        });

        // Tool Buttons Handler
        this.element.querySelectorAll('.sub-btn-tool').forEach(btn => {
            btn.addEventListener('click', () => {
                const toolName = btn.textContent.trim();
                responseText.textContent = pName + "「よし！『" + toolName + "』の準備をするね！……あ、この機能はまだ魔法の書（開発中）に書かれている最中みたい。実装を楽しみにしててね！」";
                alert(`「${toolName}」機能は現在開発中です！今後のアップデートをお待ちください。`);
            });
        });

        // Dynamic grounded Supervision generation engine
        const generateSvAdviceText = (grade, topic) => {
            const toneConfig = {
                "ホタル": {
                    prefix: "……あおぞら福祉会コンピテンシー基準の",
                    suffix: "……。ゆっくり、一緒に噛み締めようね……。"
                },
                "モフリン": {
                    prefix: "もふ！コンピテンシー基準の",
                    suffix: "もふ！モフリンが応援してるもふよ！"
                },
                "フクロ博士": {
                    prefix: "学術的アプローチに基づき、コンピテンシー基準の",
                    suffix: "に適合しますぞ。論理的なアプローチが解決の鍵です。"
                },
                "コダマ": {
                    prefix: "大丈夫だよ！あおぞら福祉会の",
                    suffix: "に基づいているよ！元気を出して一歩進もう！"
                },
                "ニャンガイド": {
                    prefix: "フン、真面目にアドバイスしてあげるニャ。コンピテンシー基準の",
                    suffix: "ニャ！しっかり胸に刻み込んで、明日から実行するニャ！"
                },
                "ポポン": {
                    prefix: "コンピテンシーデータシステムを起動。等級基準",
                    suffix: "を確認。このパラメーターに基づいて行動を調整してください。"
                },
                "ルーン": {
                    prefix: "オシャッ！燃えるアドバイスだぜッ！コンピテンシー基準の",
                    suffix: "だッ！情熱を持って突き進めば、どんな壁もぶち壊せるぜッ！"
                },
                "ぷにょ": {
                    prefix: "……ぷにょ……コンピテンシーの……",
                    suffix: "……ぷにょ……いっしょなら……できるよ……。"
                },
                "ミルフィー": {
                    prefix: "ハイハーイ！元気にアドバイスですっ！コンピテンシー基準の",
                    suffix: "ですね！これさえマスターすれば、ギルドで大活躍間違いなしですっ！"
                },
                "クマたろう": {
                    prefix: "よしよし、あおぞら福祉会のコンピテンシー基準である",
                    suffix: "を意識してみなさい。焦らず少しずつでええんやで。"
                },
                "コン": {
                    prefix: "データに基づき解説します。コンピテンシー基準",
                    suffix: "に準拠しています。手順を整理し、客観的に取り組みましょう。"
                },
                "わたぼう": {
                    prefix: "のんびりいこうねぇ……。コンピテンシー基準のぉ……",
                    suffix: "だよぉ……。あわてずゆっくりぃ、慣れていこうねぇ……。"
                },
                "えっちゃん": {
                    prefix: "フン、あんたに特別に教えてあげるわよ。コンピテンシーの",
                    suffix: "よ。プロなんだからこれくらい当たり前にできなきゃダメよ。"
                }
            };

            const getJobGroup = (j) => {
                if (["看護師", "OT", "PT", "ST"].includes(j)) return "nursing";
                if (["生活支援員", "サービス管理責任者", "サービス提供責任者"].includes(j)) return "care";
                if (["保育士", "児童指導員", "児童発達管理責任者"].includes(j)) return "childcare";
                if (["相談員", "相談支援専門員", "就労相談員"].includes(j)) return "social";
                if (j === "公認心理師") return "psychology";
                if (j === "就労支援員") return "workers";
                if (["管理栄養士", "調理員"].includes(j)) return "nutrition";
                if (["事務員", "経営管理"].includes(j)) return "admin";
                return "care";
            };

            const jobGroup = getJobGroup(d.job);

            const jobSpecificSvDB = {
                "nursing": {
                    "1": {
                        "client": "『1等級：日本看護協会「看護職の倫理綱領」第1条（尊厳と権利の尊重）』に基づきます。患者・利用者の個別の人格を尊重し、笑顔を引き出す温かい言葉がけを意識することが基本です。自らの感情に左右されず、健康状態の観察と親切な対応を両立させましょう。",
                        "safety": "『1等級：医療法第6条の12（医療安全）/ 厚生労働省「医療安全推進」』に準拠します。バイタルの異常や異変を一人で抱え込まず、発生直後にありのままの事実を先輩・医師へタイムリーに報告・相談（ホウレンソウ）することが最大の事故予防です。",
                        "career": "『1等級：看護職の倫理綱領 第14条（自己研鑽と健康管理）』に基づきます。不規則な夜勤や交代制勤務の中でも、自分自身の疲労や燃え尽き（バーンアウト）のサインを自覚し、心身の健康維持に向けて適切な休息と相談を行いましょう。"
                    },
                    "2": {
                        "client": "『2等級：看護職の倫理綱領 第4条（守秘義務・プライバシー）』に基づきます。個人のプライバシーを守り、アセスメントを通じて身体・精神両面での臨床的ニーズを正確に記録・整理し、信頼関係の維持に努めましょう。",
                        "safety": "『2等級：CDC（米国疾病予防管理センター）手指衛生ガイドライン / 医療事故対策』に適合します。緊急時こそ冷静に手指衛生・PPE（個人防護具）を徹底し、主観を除いた正確なインシデントレポートを当日中に作成・共有しましょう。",
                        "career": "『2等級：看護職の倫理綱領 第15条（専門的職能の研鑽）』に基づきます。自らの行う看護行為を自己評価し、他職種カンファレンスに積極的に参加しながら、臨床実践能力を高めるキャリアを育てましょう。"
                    },
                    "3": {
                        "client": "『3等級：厚生労働省「看護師の臨床実践能力の指標」』のフェーズです。複雑な褥瘡や感染リスクを抱える利用者に対し、多職種と連携したアセスメントを実施し、一貫したケアプランや予防プログラムをチームに提案・牽引してください。",
                        "safety": "『3等級：医療事故調査制度に基づく再発防止策』に準拠します。エラーを個人の責任にせず、点滴や配薬ミスを防ぐダブルチェック手順の標準化など、システム的な再発防止策を立案しチームに展開しましょう。",
                        "career": "『3等級：日本看護協会「継続教育基準」』に基づきます。プリセプターとして後輩の指導・OJTを行い、専門職としての職業倫理とアセスメント技術を伝承するとともに、自らも認定看護師などの上級資格取得を視野に入れましょう。"
                    },
                    "4": {
                        "client": "『4等級：医療法第6条の12（管理者の義務）』に基づく主任看護師基準です。困難ケースにおけるアセスメントと看護計画作成をチームでリードし、臨床的エビデンス（エビデンスに基づく看護：EBN）を分かりやすく言語化して共有しましょう。",
                        "safety": "『4等級：厚生労働省「医療安全管理者の業務指針」』に適合します。想定外の事故・トラブルの発生時に、迅速な指示系統を確立し、上位管理者への緊急連絡から事後対応、再発防止の法定義務を統括してください。",
                        "career": "『4等級：厚生労働省「看護職員のメンタルヘルスガイドライン」』に基づきます。夜勤や緊急対応による現場メンバーの疲弊サインを見落とさず、定期的な面談（1on1）や業務負担調整などの能動的なメンタルヘルスケアを推進しましょう。"
                    }
                },
                "care": {
                    "1": {
                        "client": "『1等級：日本介護福祉士会「介護福祉士倫理綱領」第1条（利用者本位・自立支援）』に基づきます。尊厳を最優先にした丁寧な声かけと、本人の残存能力を活かした自立支援を心がけましょう。",
                        "safety": "『1等級：厚生労働省「高齢者・障害者施設における安全管理」』に準拠します。ヒヤリハットや軽微なケガ、皮膚トラブルを発見したら、直ちに上司へタイムリーに報告・連絡することが最大の重大事故防止です。",
                        "career": "『1等級：介護福祉士倫理綱領 第4条（専門的サービスの提供と自己管理）』に基づきます。介護の基本姿勢を身に付け、自身の心身の健康とストレスマネジメントに留意し、安定した勤務を継続しましょう。"
                    },
                    "2": {
                        "client": "『2等級：介護福祉士倫理綱領 第2条（プライバシーの保護）』に基づきます。アセスメントの基礎を学び、利用者の生活背景やニーズを正確に把握し、個別支援計画に基づいた適切なケア記録を作成しましょう。",
                        "safety": "『2等級：厚生労働省「身体拘束ゼロへの手引き」』に適合します。介護現場における身体的・精神的拘束の弊害を理解し、困難場面でも冷静にマニュアルに沿った緊急対応とヒヤリハット記録を徹底しましょう。",
                        "career": "『2等級：介護福祉士倫理綱領 第7条（専門性の向上）』に基づきます。日々の介護を自己評価し、他職種との情報交換や内部研修を通じて、自律的に介護スキルや介護理論を深めましょう。"
                    },
                    "3": {
                        "client": "『3等級：介護福祉士倫理綱領 第5条（連携と協力）』に基づきます。認知症ケアや困難事例に対し、自立支援を促すための環境調整やアプローチ方法をチーム全体に提案・リードしましょう。",
                        "safety": "『3等級：インシデント・ヒヤリハット分析とシステム改善』に準拠します。転倒や誤嚥などのインシデントに対し、個人の注意義務ではなく、ハード面の環境改修や介助手順の標準化といった再発防止策を立案しましょう。",
                        "career": "『3等級：介護福祉士倫理綱領 第8条（後継者の育成）』に基づきます。後輩職員や実習生の指導（OJT）を担い、ケアの質向上を促進するとともに、サービス管理責任者やケアマネージャーの資格取得に向け研鑽しましょう。"
                    },
                    "4": {
                        "client": "『4等級：厚生労働省「個別支援計画及びケアプランのガイドライン」』に基づく主任ケアマネ/サビ管基準です。多職種カンファレンスを主導し、根拠に基づく高品質な個別支援計画を作成・評価するプロセスをリードしましょう。",
                        "safety": "『4等級：厚生労働省「介護現場におけるハラスメント・トラブル対策」』に適合します。クレームや事故対応の初動指揮を行い、上位管理者への報告と現場職員へのフィードバック体制を統括してください。",
                        "career": "『4等級：厚生労働省「介護従事者のバーンアウト予防と職場環境改善」』に基づきます。チームメンバーのメンタルケアや業務過多に配慮し、定期的な1on1等を通じて離職防止と働きやすい環境づくりに尽力しましょう。"
                    }
                },
                "childcare": {
                    "1": {
                        "client": "『1等級：全国保育士会「保育士倫理綱領」第1条（子どもの最善の利益の尊重）』に基づきます。子どもの豊かな愛情のなかでの育ちを第一に考え、一人ひとりの子どもの意思や情緒を尊重した優しい保育を実践しましょう。",
                        "safety": "『1等級：厚生労働省「保育所における感染症対策ガイドライン / 児童福祉法」』に準拠します。感染症の流行兆候やケガ、アレルギー対応時の異変を発見したら、直ちに上司や看護師へタイムリーに報告・連絡しましょう。",
                        "career": "『1等級：保育士倫理綱領 第8条（専門職としての責務）』に基づきます。基本的な保育技術や子どもとの関わり方を学び、自身のストレス管理に努め、笑顔で安定した保育を届けましょう。"
                    },
                    "2": {
                        "client": "『2等級：保育士倫理綱領 第4条（プライバシーの保護）』に基づきます。児童発達やアセスメントの基礎を学び、家庭状況や子どもの特性を客観的に記録し、児童福祉制度に基づいた適切な成長観察に努めましょう。",
                        "safety": "『2等級：内閣府「教育・保育施設等における事故防止及び事故発生時の対応のためのガイドライン」』に適合します。アレルギー除去食のダブルチェックやSIDS（乳幼児突然死症候群）予防の呼吸チェックを厳格に行い、正確なヒヤリハット記録を徹底しましょう。",
                        "career": "『2等級：保育士倫理綱領 第5条（チームワークと自己評価）』に基づきます。自らの行う保育を子どもの視点から自己評価し、他職員との情報交換や研修を通じて専門性を向上させましょう。"
                    },
                    "3": {
                        "client": "『3等級：保育士倫理綱領 第3条（保護者との協力）』のフェーズです。保護者の抱える子育ての不安や意向を真摯に受け止め、信頼関係を築きながら、発達障害や困難ケースへの具体的支援方針をチームに提案しましょう。",
                        "safety": "『3等級：児童虐待防止法に基づく早期発見・通告義務』に準拠します。児童の身体や言動から虐待のサインを早期に察知し、関係機関（児相や支援センター）とタイムリーに連携して、適切な初動と虐待予防プログラムをチームに共有しましょう。",
                        "career": "『3等級：保育士倫理綱領 第8条（後継者の育成）』に基づきます。後輩保育士の指導・育成（OJT）を担い、職能成長を支えるとともに、保育実践 of 根拠を分かりやすく言語化して共有しましょう。"
                    },
                    "4": {
                        "client": "『4等級：厚生労働省「保育所保育指針」に基づく指導計画作成』の主任・児発管基準です。園や事業所の保育・発達支援プログラムを総括し、多職種連携を主導して質の高い指導計画をチームでリードしましょう。",
                        "safety": "『4等級：教育・保育施設における重大事故予防の統括』に適合します。アレルギー事故や怪我の防止策、災害避難訓練の指揮系統を確立し、上位管理者への報告と現場指導を完璧に統括してください。",
                        "career": "『4等級：保育士の職場環境改善とキャリアパス構築』に基づきます。多忙な現場メンバーのバーンアウトやモチベーション低下を防ぐため、定期的な面談（1on1）やシフト効率化、心理的安全性の高い職場づくりをリードしましょう。"
                    }
                },
                "social": {
                    "1": {
                        "client": "『1等級：日本社会福祉士会「社会福祉士倫理綱領」Ⅰ.価値（人間の尊厳と社会正義）』に基づきます。クライエントの権利擁護と尊厳尊重を第一とし、偏見を排除した丁寧で共感的なインテーク（初期受付）を心がけましょう。",
                        "safety": "『1等級：社会福祉士倫理綱領 Ⅱ.行動規範（プライバシーの尊重・秘密保持）』に準拠します。面談で知り得た利用者の個人情報や秘密を厳格に管理し、漏洩の防止と正確な記録の作成に努めましょう。",
                        "career": "『1等級：社会福祉士倫理綱領 Ⅱ.行動規範（自己研鑽）』に基づきます。社会福祉制度の基本や相談援助技術を謙虚に学び、自身の感情コントロール（自己覚知）に努めて、健全な職業的姿勢を維持しましょう。"
                    },
                    "2": {
                        "client": "『2等級：社会福祉士倫理綱領（利用者の自己決定の尊重）』に基づきます。アセスメントの基礎に基づき、利用者の潜在的な意思やニーズを引き出し、本人の自己決定を促す適切なアドボカシー（権利擁護）を展開しましょう。",
                        "safety": "『2等級：社会福祉士倫理綱領（説明責任）』に適合します。支援内容や社会資源について利用者へわかりやすく説明し、合意を得るプロセス（インフォームドコンセント）を徹底し、面談記録をタイムリーに整理しましょう。",
                        "career": "『2等級：社会福祉士倫理綱領（専門職としての関係構築）』に基づきます。二重関係（個人的な関係）を避け、専門職としての適切な距離感を保つ客観的な倫理観を身に付けましょう。"
                    },
                    "3": {
                        "client": "『3等級：社会福祉士倫理綱領（多職種・他機関との連携）』のフェーズです。複雑な複合課題（多重債務、8050問題等）を抱える困難事例に対し、医療、行政、法律専門職等の多職種ネットワークを構築し、チームアプローチを提案・牽引しましょう。",
                        "safety": "『3等級：成年後見制度や高齢者・障害者虐待防止法に基づく擁護活動』に準拠します。虐待の早期発見や意思能力の低下に対し、成年後見制度の活用や法的介入の初動方針を立案し、迅速に関係機関と連携しましょう。",
                        "career": "『3等級：社会福祉士倫理綱領（後進の育成とスーパービジョン）』に基づきます。後輩ソーシャルワーカーのケース指導・OJTを行い、支援記録の書き方や制度適用のコツを伝承しながら、認定社会福祉士などの上級職を目指しましょう。"
                    },
                    "4": {
                        "client": "『4等級：厚生労働省「相談支援体制・地域福祉推進ガイドライン」』に基づく主任相談員基準です。相談支援センターや相談チームの運営方針を策定し、困難事例に対する地域ケア会議の開催や社会資源の開発を主導しましょう。",
                        "safety": "『4等級：ハラスメント・倫理紛争・クレーム対応の統括』に適合します。多職種連携上の倫理的コンフリクトや、利用者家族からの重大なクレームに対し、組織を代表して冷静・厳正に対処し、事後対応と関係構築を統括してください。",
                        "career": "『4等級：ソーシャルワーカーのメンタルヘルス管理とスーパービジョン体制の確立』に基づきます。相談員の抱える「二次的トラウマ」やバーンアウトを予防するため、ピアサポートや外部スーパービジョンの機会を提供し、健全な組織を維持しましょう。"
                    }
                },
                "psychology": {
                    "1": {
                        "client": "『1等級：公認心理師法第42条（主治医の指示・多職種連携）』に基づきます。要支援者の心の尊厳と自己決定を重んじ、心理アセスメントやカウンセリングにおいて、本人のペースに寄り添った非審判的態度を心がけましょう。",
                        "safety": "『1等級：公認心理師倫理綱領（秘密保持と限界）』に準拠します。クライエントのプライバシーを最優先に守りつつ、自傷他害の恐れがある緊急事態には、適切な「警告義務の例外」を理解し、直ちに上司や医療職に迅速に連携・報告しましょう。",
                        "career": "『1等級：公認心理師倫理綱領（自己管理と自己研鑽）』に基づきます。心理臨床における自身の二次的受傷や逆転移に留意し、スーパービジョンを受けながら、感情のセルフコントロールを身に付けましょう。"
                    },
                    "2": {
                        "client": "『2等級：心理検査（WISC/WAIS/新版K式等）の適切なアセスメントとフィードバック』の段階です。検査結果を機械的に伝えるのではなく、利用者の日常生活のしづらさに配慮した丁寧な説明と、強みを活かすための情報整理を徹底しましょう。",
                        "safety": "『2等級：心理臨床におけるインフォームドコンセントと倫理基準』に適合します。アセスメントの目的や結果の開示範囲について十分な説明を行い、本人の納得を得るとともに、客観的で正確なケースカルテを作成・共有しましょう。",
                        "career": "『2等級：日本公認心理師協会等の倫理規定・ケーススタディ』に基づきます。学会や研究会に積極的に参加し、自己の専門知識を客観的に評価しながら、自律的に臨床スキルを高めましょう。"
                    },
                    "3": {
                        "client": "『3等級：公認心理師法第42条（多職種カンファレンスのリード）』です。医療・教育・福祉の領域を跨ぐ困難ケースに対し、心理的アセスメントに基づく対応方針を言語化し、一貫したアプローチをチームに提案・牽引しましょう。",
                        "safety": "『3等級：心理的緊急介入（危機介入）と再発防止策』に準拠します。パニックや自傷他害のインシデントにおいて、チーム全体で取り組むべき冷静な初期対応と心理的安全の確保手順を標準化し、指導しましょう。",
                        "career": "『3等級：ケース指導とOJT教育』に基づきます。若手心理職のケースカウンセリングの指導やアセスメント助言を担い、チーム全体の心理援助の質を高めるとともに、自身も専門職としてのキャリアを深化させましょう。"
                    },
                    "4": {
                        "client": "『4等級：厚生労働省「精神保健福祉・心理臨床ガイドライン」』に基づく主任心理師基準です。心理カウンセリング・アセスメント部門の運営をリードし、エビデンスに基づく心理的援助（認知行動療法等）の適用を主導しましょう。",
                        "safety": "『4等級：心理倫理の危機管理とクライシス・マネジメント』に適合します。クライエントとの重大なハラスメントや境界線の問題、精神的緊急事態において、速やかに医療機関や行政と連携して組織的に収拾を図ってください。",
                        "career": "『4等級：心理専門職のメンタルヘルス維持・ストレスチェックと燃え尽き防止』に基づきます。心理臨床の負担によるスタッフのバーンアウトや精神的疲弊を防ぐため、定期的なスーパービジョンとシフト調整を徹底しましょう。"
                    }
                },
                "workers": {
                    "1": {
                        "client": "『1等級：障害者雇用促進法第3条（障害者の雇用の義務等）/ 自立支援』に基づきます。利用者が仕事に対して自信を持てるよう、長所を活かす「強み（ストレングス）アプローチ」を意識し、丁寧な言葉かけと就労トレーニングを支援しましょう。",
                        "safety": "『1等級：労働安全衛生法に基づく作業現場の安全管理』に準拠します。作業場における事故・ケガ・体調異変を発見したら、直ちに上司へタイムリーに報告・連絡（ホウレンソウ）し、初期消火や救護の体制を遵守しましょう。",
                        "career": "『1等級：就労支援員としての倫理と自己管理』に基づきます。基本的なビジネススキルや支援制度を理解し、自身の健康管理を徹底し、利用者の手本となる安定した勤務を心がけましょう。"
                    },
                    "2": {
                        "client": "『2等級：アセスメントシートに基づく就労移行・A型・B型支援計画』の段階です。作業適性やコミュニケーションの課題を客観的に評価し、個別支援計画に基づいた的確な作業訓練と正確な日誌作成に努めましょう。",
                        "safety": "『2等級：合理的配慮の提供と作業事故防止』に適合します。企業実習や施設内作業におけるヒヤリハット（機械操作ミス、転倒等）を正確に記録・整理し、タイムリーな現場改善と安全対策を徹底しましょう。",
                        "career": "『2等級：就労支援員の職能能力評価と研修参加』に基づきます。企業連携やハローワークとの意見交換を通じ、最新の障害者雇用動向を学び、自律的に職業指導能力を高めましょう。"
                    },
                    "3": {
                        "client": "『3等級：障害者雇用促進法に基づくジョブコーチ（職場適応支援）と企業連携』です。利用者の実習先や定着先企業と密な連絡調整を行い、職場での「合理的配慮」の具体案を企業に提案・交渉し、早期離職を防ぎましょう。",
                        "safety": "『3等級：就労定着時におけるメンタルヘルス・労働トラブルの未然防止』に準拠します。就労後の利用者のストレスやハラスメントサインを早期に把握し、企業の人事担当者や家族とタイムリーに再発防止策を講じましょう。",
                        "career": "『3等級：後輩就労支援員のOJT指導とキャリアパス』に基づきます。後輩職員のジョブコーチ同行指導やアセスメントアプローチのOJTを担い、就労定着率の向上に貢献するとともに、サビ管やジョブコーチ資格を目指しましょう。"
                    },
                    "4": {
                        "client": "『4等級：厚生労働省「就労移行支援・就労定着支援ガイドライン」』に基づく主任就労支援員・サビ管基準です。地域の就労支援ネットワーク（ハローワーク、障害者職業センター等）を主導し、地域一体となった雇用創出をリードしましょう。",
                        "safety": "『4等級：企業・利用者のトラブル・労務クレーム対応 of 初動と収拾』に適合します。実習中や就職後に発生した雇用契約や労働条件に関する重大なトラブルに対し、法人の代表として冷静かつ厳正に対処し、法的遵守を統括してください。",
                        "career": "『4等級：就労支援チームの目標管理・バーンアウト予防とメンタルケア』に基づきます。プレッシャーがかかりやすい就労定着目標と、現場職員のケアをバランスよく行い、定期面談で心身の負担を能動的に予防しましょう。"
                    }
                },
                "nutrition": {
                    "1": {
                        "client": "『1等級：日本栄養士会「管理栄養士・栄養士倫理綱領」第1条（科学的根拠に基づいた指導と公衆衛生の向上）』に基づきます。すべての人々の健康を願う愛情を持ち、アレルギーや食事制限などの個別ニーズに親切・正確に対応しましょう。",
                        "safety": "『1等級：食品衛生法に基づく大量調理施設衛生管理マニュアル』に準拠します。厨房機器の故障や食材の賞味期限切れ、異物の混入等の異変を発見したら、直ちに栄養士長や施設長へタイムリーに報告・連絡（ホウレンソウ）しましょう。",
                        "career": "『1等級：栄養士倫理綱領 第3条（自己研鑽と健康管理）』に基づきます。自身が食中毒等の感染源とならないよう徹底した検便と毎日の体調管理を行い、栄養・調理の基本手順を厳密に遵守しましょう。"
                    },
                    "2": {
                        "client": "『2等級：厚生労働省「日本人の食事摂取基準」に基づく適切な献立作成・栄養評価』の段階です。利用者の健康診断データや嗜好をアセスメントし、摂食嚥下能力に応じた食形態 of 調理調整と正確な食事記録の管理に努めましょう。",
                        "safety": "『2等級：食品衛生法第50条（HACCPに沿った衛生管理）』に適合します。食材の検収温度測定や加熱温度の確認記録を厳格に実行し、食中毒予防のためのHACCP記録の正確な当日作成を徹底しましょう。",
                        "career": "『2等級：栄養士倫理綱領（他職種との協働と研修）』に基づきます。ケアスタッフや看護師と積極的に情報交換し、栄養管理の観点から臨床的知識を深め、自律的な資格取得に努めましょう。"
                    },
                    "3": {
                        "client": "『3等級：日本栄養士会「臨床栄養・栄養ケアマネジメントの評価」』のフェーズです。糖尿病や高血圧などの疾患を抱える困難事例に対し、個別の「栄養ケア計画書」を作成し、多職種連携カンファレンスで支援方針を提案・牽引しましょう。",
                        "safety": "『3等級：食物アレルギー誤食インシデントのシステム的な防止対策』に準拠します。厨房・配膳現場での取り違えエラーを防ぐため、食器の色分けやダブルチェックシートの標準化など、システム的な再発防止策を立案しましょう。",
                        "career": "『3等級：後輩栄養士・調理員のOJT指導と給食マネジメント』に基づきます。若手への衛生管理手順の指導や献立作成のOJTを行い、安心安全な給食の提供品質を担保するとともに、専門管理栄養士を目指しましょう。"
                    },
                    "4": {
                        "client": "『4等級：厚生労働省「特別養護老人ホーム・施設における栄養管理基準」』に基づく管理栄養士長・給食責任者基準です。施設全体の給食計画・予算・衛生基準を策定し、多職種連携による栄養スクリーニング体制をリードしましょう。",
                        "safety": "『4等級：食中毒・異物混入・アレルギー等の重大トラブル発生時の初動と収拾』に適合します。緊急時における保健所への報告、原因究明、マスコミや家族への説明、厨房停止措置などの指揮系統を完璧に統括してください。",
                        "career": "『4等級：調理現場の労働環境改善とバーンアウト予防』に基づきます。熱中症リスクや体力負担の高い厨房メンバーのメンタルケア・安全衛生管理を徹底し、シフトの最適化と定期面談で離職を能動的に防ぎましょう。"
                    }
                },
                "admin": {
                    "1": {
                        "client": "『1等級：個人情報保護法第18条（取得時の公表等）/ 尊厳の保護』に基づきます。施設を訪れる見学者や電話口の相手に対し、丁寧かつ品格のある窓口対応を徹底し、個人情報の漏洩を絶対に防ぐ姿勢を維持しましょう。",
                        "safety": "『1等級：労働基準法 / 法人財務・情報セキュリティ管理』に準拠します。提出書類の誤記、金銭の過不足、ITシステムの不具合などのエラーを発見したら、直ちに上司へタイムリーに報告・相談（ホウレンソウ）しましょう。",
                        "career": "『1等級：事務員としてのコンプライアンス遵守と自己管理』に基づきます。正確なPC入力、社会保険手続きなどの基本実務手順を学び、自身のタスク管理と健康管理を徹底し、安定した勤務を行いましょう。"
                    },
                    "2": {
                        "client": "『2等級：個人情報保護法に基づくデータセキュリティとアセスメント』の段階です。利用者の請求データや職員の雇用契約書を客観的に管理・整理し、福祉給付費請求（レセプト請求）の正確なタイムリー作成に努めましょう。",
                        "safety": "『2等級：情報漏洩対策・データバックアップとコンプライアンス管理』に適合します。給与計算や支払業務における多重チェックを厳格に行い、正確なヒヤリハット記録とITセキュリティポリシーの順守を徹底しましょう。",
                        "career": "『2等級：福祉経営事務・法改正等に関する知識の自律的獲得』に基づきます。診療報酬・介護報酬等の法改正情報を学び、効率的な事務処理フローを自己提案できるよう専門職能を磨きましょう。"
                    },
                    "3": {
                        "client": "『3等級：法人財務分析・社会福祉法人会計基準に基づく予算管理』です。チームや施設の予算実績管理を行い、業務プロセスのペーパーレス化やITによる業務効率化システムを自立して立案・提案しましょう。",
                        "safety": "『3等級：労働基準法第36条（サブロク協定）遵守と過重労働のシステム的防止』に準拠します。現場職員の過度な時間外労働や打刻漏れを客観的データとして抽出し、チームリーダーと連携してシステム的な改善策を提案しましょう。",
                        "career": "『3等級：後輩事務員のOJT指導と総務・財務マネジメント』に基づきます。若手への請求システム入力方法や労務管理の指導（OJT）を担い、管理部門のガバナンス能力を高めるとともに、経営幹部候補として自己研鑽しましょう。"
                    },
                    "4": {
                        "client": "『4等級：社会福祉法に基づく法人ガバナンスと経営・財務計画策定』の事務長・経営企画基準です。中長期の経営財務計画や人事評価制度の設計を行い、多職種がやりがいを持って働ける組織基盤をチームでリードしましょう。",
                        "safety": "『4等級：情報セキュリティ事故・労務トラブル・コンプライアンス違反の初動と収拾』に適合します。現場で発生した想定外のハラスメント訴訟、情報漏洩、財務不整合などのクライシスに対し、理事会や外部弁護士と連携して組織的収拾を統括してください。",
                        "career": "『4等級：管理部門の心理的安全性の向上とメンタルヘルスチェックの実施』に基づきます。組織改革や予算目標のプレッシャーに曝されやすいスタッフの心身の疲弊を見落とさず、定期的な1on1や能動的なケアを行いましょう。"
                    }
                }
            };

            const tone = toneConfig[pName] || { prefix: "コンピテンシー基準の", suffix: "を意識しましょう。" };
            const content = jobSpecificSvDB[jobGroup][String(grade)][topic];
            return `${tone.prefix}${content}${tone.suffix}`;
        };

        // Supervision Item Click Handler
        this.element.querySelectorAll('.sub-btn-sv').forEach(btn => {
            btn.addEventListener('click', () => {
                const topic = btn.dataset.topic;
                const grade = d.grade || 1;
                const svText = generateSvAdviceText(grade, topic);
                responseText.innerHTML = `<strong>🎓 SV指導 (${pName}・${grade}等級向け):</strong><br>${svText}`;
                
                // Add a small bounce animation to partner image when giving SV
                const img = this.element.querySelector('#scene-partner-img');
                img.style.transform = "scale(1.15) translateY(-5px)";
                setTimeout(() => img.style.transform = "", 500);
            });
        });
    }

    // Chat Logic
    initChatSystem() {
        const d = window.gameState.data;
        const pName = d.partner.split('/').pop().replace('.png', '');
        
        const chatBox = this.element.querySelector('#chat-box');
        const chatInput = this.element.querySelector('#chat-input');
        const btnSend = this.element.querySelector('#btn-chat-send');

        chatBox.innerHTML = `<div style="color:#6b7280; font-style:italic; text-align:center;">おしゃべりを始めましょう！</div>`;

        // Personality Chat Responses
        const chatReplies = {
            "ホタル": [
                "うん……何をお話ししようか……？",
                "あなたの声を聞いていると、とても心が落ち着くよ……。",
                "今日も大変だったね。私で良ければ、いつでも隣にいるよ……。",
                "福祉のお仕事って、誰かの心に小さな灯をともすようなものだね……。"
            ],
            "モフリン": [
                "もふ！なぁに〜？",
                "モフリンは今日も元気いっぱいもふ！おやつ食べるもふ？",
                "今日もお仕事頑張っててすごすぎるもふ！なでなでもふ〜！",
                "もふもふ〜！ハッピーもふもふパワーを送るもふ！"
            ],
            "フクロ博士": [
                "ほう、私との日常対話をご希望ですな。",
                "対話は脳のニューロンを活性化させます。福祉の最新トレンドについて話しますか？",
                "素晴らしい。支援技術の向上には、絶え間ない対話とメタ認知が重要ですぞ。",
                "ふむ、心身の健康状態は良好ですか？休息と栄養補給をお忘れなく。"
            ],
            "コダマ": [
                "やっほー！何話す？何話す？",
                "君とおしゃべりしてる時間が、一日の中で一番大好きなんだ！",
                "今日あった面白いこと、何でも教えて！",
                "君のその頑張り、世界一輝いてるよ！応援してるからね！"
            ],
            "ニャンガイド": [
                "ふにゃ？なにか用ニャ？",
                "話しかけるなら、美味しいかつおぶしを用意してからにするニャ！",
                "今日の仕事も適当に乗り切ったニャ？それで良いのニャ, 長生きの秘訣ニャ！",
                "フン、まあお前の話し相手くらいなら, してやってもいいニャ。"
            ],
            "ポポン": [
                "音声認識入力確認。会話スレッドを生成しました。",
                "あなたの音声周波数からリラックス度を検出しています。良いコンディションですね。",
                "福祉支援におけるコミュニケーション技法について学習しますか？",
                "本日の作業進捗は良好のようですね。水分補給を推奨します。"
            ],
            "ルーン": [
                "おうッ！何でも話してくれ！オレのパッションは燃え上がってるぜ！",
                "お前の声を聞くと元気が湧いてくるな！熱い友情の証だぜッ！",
                "福祉の仕事は、命のぶつかり合いだ！プライド持って突っ走ろうぜ！",
                "ハハハ！悩んだら筋トレして寝る！これが一番だぜ！"
            ],
            "ぷにょ": [
                "……ぷにょ……？",
                "……（嬉しそうに体を揺らしている）……",
                "……（じーっ）……いっしょに……いようね……",
                "……ぷに！……"
            ],
            "ミルフィー": [
                "わーい！おしゃべりタイムですね！何から話しますか！？",
                "今日のおやつは何にしました！？甘いものは福祉職のガソリンですよっ！",
                "あなたの笑顔、本当に素敵です！明日も元気ハツラツで行きましょー！",
                "悩みなんか、ミルフィーパンチで吹き飛ばしちゃいますっ！"
            ],
            "クマたろう": [
                "うん、うん。何でも話しなさい。",
                "少し疲れた顔をしとるな。温かいココアでも淹れてやろうか？",
                "お前さんが福祉の道を選んでくれて、本当に嬉しいと思うよ。",
                "ハハハ、慌てず焦らず、自分のペースで行こうな。"
            ],
            "コン": [
                "はい、お話ししましょう。テーマは何でしょうか？",
                "日常会話も、脳の整理とストレスマネジメントに有効です。",
                "今日の業務プロセスで、何か気になる点などはございましたか？",
                "整理整頓と計画性。これが良いお仕事をするための第一歩ですよ。"
            ],
            "わたぼう": [
                "なぁに〜？のんびり話そうぉ……。",
                "わたぼうのふわふわの毛に包まれてぇ、お話ししよぉ……。",
                "がんばりやさんのあなたにぃ、特大の癒やしをプレゼントぉ……。",
                "明日もぉ、良い日になるといいねぇ……ふわぁ……。"
            ],
            "えっちゃん": [
                "何よ、私と話したいなんて物好きね。",
                "あんた、ちゃんとお昼休み取ったの？無理して倒れられたら迷惑なんだからね！",
                "まあ、あんたのお仕事の話くらいなら、耳を傾けてあげなくもないわよ。",
                "フン、今日も無事でよかったわね。明日もせいぜい頑張りなさいよ。"
            ]
        };

        const appendMessage = (sender, text) => {
            const isPlayer = sender === "Player";
            const color = isPlayer ? "#1e3a8a" : "#047857";
            const bg = isPlayer ? "#eff6ff" : "#ecfdf5";
            const align = isPlayer ? "flex-end" : "flex-start";
            
            const msgHtml = `
                <div style="align-self: ${align}; background: ${bg}; color: ${color}; padding: 6px 10px; border-radius: 8px; max-width: 80%; line-height:1.4; border: 1px solid rgba(0,0,0,0.05);">
                    <strong>${sender}:</strong> ${text}
                </div>
            `;
            chatBox.insertAdjacentHTML('beforeend', msgHtml);
            chatBox.scrollTop = chatBox.scrollHeight;
        };

        const handleSend = () => {
            const val = chatInput.value.trim();
            if(!val) return;

            appendMessage("Player", val);
            chatInput.value = "";

            // Simulate partner response typing...
            setTimeout(() => {
                const partnerList = chatReplies[pName] || ["うん、そうだね！", "お仕事応援してるよ！"];
                const reply = partnerList[Math.floor(Math.random() * partnerList.length)];
                appendMessage(pName, reply);
                
                // Update header response bubble too
                this.element.querySelector('#partner-response').textContent = pName + "「" + reply + "」";
            }, 800);
        };

        // Bind Send click
        btnSend.replaceWith(btnSend.cloneNode(true)); // remove old listeners
        chatInput.replaceWith(chatInput.cloneNode(true));

        const newBtnSend = this.element.querySelector('#btn-chat-send');
        const newChatInput = this.element.querySelector('#chat-input');

        newBtnSend.addEventListener('click', handleSend);
        newChatInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') handleSend();
        });
    }
}
