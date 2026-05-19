class AdminScene extends BaseScene {
    getHtml() {
        return `
            <div id="admin-scene" style="display:flex; flex-direction:column; height:100%; width:100%; background: linear-gradient(135deg, #18181b, #451a03); position:relative; overflow:hidden;">
                <!-- Sparkle background -->
                <div class="sparkle-bg"></div>

                <!-- Header -->
                <div class="rpg-wood-panel" style="margin: 10px; padding: 12px; display:flex; justify-content:space-between; align-items:center; z-index:5;">
                    <button id="btn-back-admin" style="padding:6px 12px; font-size:12px; font-weight:bold; background:#475569; border:2px solid #94a3b8; color:#fff; border-radius:6px; cursor:pointer;">⬅️ 戻る</button>
                    <h2 style="font-size:16px; color:#fde68a; font-weight:800; margin:0; text-shadow:1px 1px 2px #000;">🏢 職員管理システム</h2>
                    <div style="width:60px;"></div> <!-- Spacer -->
                </div>

                <!-- Main Content -->
                <div style="flex:1; overflow-y:auto; padding:0 10px 10px 10px; display:flex; flex-direction:column; gap:12px; z-index:5;">
                    
                    <!-- Burnout Detection Section -->
                    <div class="rpg-parchment" style="padding:12px; border-radius:12px; background:#fff1f2;">
                        <h3 style="font-size:14px; font-weight:bold; color:#9f1239; border-bottom:2px dashed #fda4af; padding-bottom:6px; margin-bottom:10px;">⚠️ バーンアウト危険度アラート</h3>
                        
                        <div style="display:flex; flex-direction:column; gap:8px; font-size:12px; font-weight:bold;">
                            <!-- Alert Item 1 (Danger) -->
                            <div style="background:#fff; border:2px solid #ef4444; padding:8px; border-radius:8px;">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                                    <div>
                                        <div style="color:#7f1d1d; font-size:13px;">生活支援員・山田</div>
                                        <div style="font-size:9px; color:#ef4444;">ケアラーズギルド / 連続勤務: 5日</div>
                                    </div>
                                    <span style="background:#ef4444; color:#fff; padding:2px 6px; border-radius:4px; font-size:10px;">危険度: 高</span>
                                </div>
                                <div style="display:flex; align-items:center; gap:6px; font-size:10px;">
                                    <span style="color:#ef4444;">体力</span>
                                    <div style="flex:1; background:#fecaca; height:8px; border-radius:4px; overflow:hidden;">
                                        <div style="width:15%; background:#ef4444; height:100%;"></div>
                                    </div>
                                    <span>15/100</span>
                                </div>
                                <div style="display:flex; align-items:center; gap:6px; font-size:10px; margin-top:4px;">
                                    <span style="color:#3b82f6;">気力</span>
                                    <div style="flex:1; background:#bfdbfe; height:8px; border-radius:4px; overflow:hidden;">
                                        <div style="width:20%; background:#3b82f6; height:100%;"></div>
                                    </div>
                                    <span>20/100</span>
                                </div>
                                <button class="btn-admin-action" style="width:100%; margin-top:8px; padding:6px; background:#f43f5e; border:none; color:#fff; font-weight:bold; border-radius:4px; font-size:11px; cursor:pointer;">面談・セルフケアを指示する</button>
                            </div>

                            <!-- Alert Item 2 (Warning) -->
                            <div style="background:#fff; border:2px solid #eab308; padding:8px; border-radius:8px;">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                                    <div>
                                        <div style="color:#713f12; font-size:13px;">相談員・高橋</div>
                                        <div style="font-size:9px; color:#ca8a04;">ソーシャルギルド / クレーム対応過多</div>
                                    </div>
                                    <span style="background:#eab308; color:#fff; padding:2px 6px; border-radius:4px; font-size:10px;">危険度: 中</span>
                                </div>
                                <div style="display:flex; align-items:center; gap:6px; font-size:10px;">
                                    <span style="color:#ef4444;">体力</span>
                                    <div style="flex:1; background:#fecaca; height:8px; border-radius:4px; overflow:hidden;">
                                        <div style="width:60%; background:#ef4444; height:100%;"></div>
                                    </div>
                                    <span>60/100</span>
                                </div>
                                <div style="display:flex; align-items:center; gap:6px; font-size:10px; margin-top:4px;">
                                    <span style="color:#3b82f6;">気力</span>
                                    <div style="flex:1; background:#bfdbfe; height:8px; border-radius:4px; overflow:hidden;">
                                        <div style="width:30%; background:#3b82f6; height:100%;"></div>
                                    </div>
                                    <span>30/100</span>
                                </div>
                                <button class="btn-admin-action" style="width:100%; margin-top:8px; padding:6px; background:#eab308; border:none; color:#fff; font-weight:bold; border-radius:4px; font-size:11px; cursor:pointer;">声かけ・チームサポートを指示</button>
                            </div>
                        </div>
                    </div>

                    <!-- Promotion Approval Section -->
                    <div class="rpg-parchment" style="padding:12px; border-radius:12px; background:#eff6ff;">
                        <h3 style="font-size:14px; font-weight:bold; color:#1e40af; border-bottom:2px dashed #93c5fd; padding-bottom:6px; margin-bottom:10px;">📜 昇格・承認待ちリスト</h3>
                        
                        <div style="display:flex; flex-direction:column; gap:8px; font-size:12px; font-weight:bold;">
                            <!-- Promotion Item 1 -->
                            <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; padding:8px; border:2px solid #bfdbfe; border-radius:8px;">
                                <div>
                                    <div style="color:#1e3a8a;">保育士・中村</div>
                                    <div style="font-size:9px; color:#64748b; font-weight:normal;">サブリーダーへの昇格申請</div>
                                    <div style="font-size:10px; color:#10b981; margin-top:2px;">条件達成: 経験値10,000 / 面談済</div>
                                </div>
                                <button class="btn-admin-approve" style="padding:8px 12px; background:#3b82f6; border:2px solid #2563eb; color:#fff; font-weight:bold; border-radius:6px; cursor:pointer;">承認</button>
                            </div>

                            <!-- Promotion Item 2 -->
                            <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; padding:8px; border:2px solid #bfdbfe; border-radius:8px;">
                                <div>
                                    <div style="color:#1e3a8a;">PT・伊藤</div>
                                    <div style="font-size:9px; color:#64748b; font-weight:normal;">専門研修マスター認定申請</div>
                                    <div style="font-size:10px; color:#10b981; margin-top:2px;">条件達成: 研修クエスト全クリア</div>
                                </div>
                                <button class="btn-admin-approve" style="padding:8px 12px; background:#3b82f6; border:2px solid #2563eb; color:#fff; font-weight:bold; border-radius:6px; cursor:pointer;">承認</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        `;
    }

    init() {
        this.element.querySelector('#btn-back-admin').addEventListener('click', () => {
            this.sm.changeScene('mainHub');
        });

        this.element.querySelectorAll('.btn-admin-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                alert('対象職員へサポート指示（通知）を送信しました。早期介入でバーンアウトを未然に防ぎます。');
                e.target.disabled = true;
                e.target.style.background = '#94a3b8';
                e.target.textContent = '指示済み';
            });
        });

        this.element.querySelectorAll('.btn-admin-approve').forEach(btn => {
            btn.addEventListener('click', (e) => {
                alert('昇格を承認しました！対象職員のゲーム内に「お祝いメッセージ」が届きます。');
                e.target.disabled = true;
                e.target.style.background = '#94a3b8';
                e.target.style.borderColor = '#64748b';
                e.target.textContent = '承認済';
            });
        });
    }
}
