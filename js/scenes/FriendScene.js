class FriendScene extends BaseScene {
    getHtml() {
        const d = window.gameState.data;
        const myPasskey = d.passkey || this.generatePasskey();
        
        return `
            <div id="friend-scene" style="display:flex; flex-direction:column; height:100%; width:100%; background: linear-gradient(135deg, #1e3a8a, #312e81); position:relative; overflow:hidden;">
                <!-- Sparkle background -->
                <div class="sparkle-bg"></div>

                <!-- Header -->
                <div class="rpg-wood-panel" style="margin: 10px; padding: 12px; display:flex; justify-content:space-between; align-items:center; z-index:5;">
                    <button id="btn-back-friend" style="padding:6px 12px; font-size:12px; font-weight:bold; background:#475569; border:2px solid #94a3b8; color:#fff; border-radius:6px; cursor:pointer;">⬅️ 戻る</button>
                    <h2 style="font-size:16px; color:#fde68a; font-weight:800; margin:0; text-shadow:1px 1px 2px #000;">🤝 フレンド</h2>
                    <div style="width:60px;"></div> <!-- Spacer for alignment -->
                </div>

                <!-- Main Content -->
                <div style="flex:1; overflow-y:auto; padding:0 10px 10px 10px; display:flex; flex-direction:column; gap:12px; z-index:5;">
                    
                    <!-- My Info Section -->
                    <div class="rpg-parchment" style="padding:12px; border-radius:12px;">
                        <h3 style="font-size:14px; font-weight:bold; color:#1e3a8a; border-bottom:2px dashed #93c5fd; padding-bottom:6px; margin-bottom:10px;">👤 自分のフレンド情報</h3>
                        <div style="display:flex; gap:12px; align-items:center;">
                            <!-- QR Code Mock -->
                            <div style="width:80px; height:80px; background:#fff; border:4px solid #1e3a8a; display:flex; justify-content:center; align-items:center; border-radius:8px;">
                                <div style="width:64px; height:64px; background:repeating-linear-gradient(45deg, #000 0, #000 4px, #fff 4px, #fff 8px); opacity:0.8; position:relative;">
                                    <div style="position:absolute; top:4px; left:4px; width:16px; height:16px; border:4px solid #000;"></div>
                                    <div style="position:absolute; top:4px; right:4px; width:16px; height:16px; border:4px solid #000;"></div>
                                    <div style="position:absolute; bottom:4px; left:4px; width:16px; height:16px; border:4px solid #000;"></div>
                                </div>
                            </div>
                            <div style="flex:1;">
                                <div style="font-size:11px; font-weight:bold; color:#475569; margin-bottom:4px;">あなたのパスキー:</div>
                                <div style="background:#e2e8f0; border:2px solid #cbd5e1; padding:6px; text-align:center; font-family:monospace; font-size:16px; font-weight:bold; letter-spacing:2px; border-radius:6px; color:#1e293b;">
                                    ${myPasskey}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Add Friend Section -->
                    <div class="rpg-parchment" style="padding:12px; border-radius:12px; background:#f0fdf4;">
                        <h3 style="font-size:14px; font-weight:bold; color:#166534; border-bottom:2px dashed #86efac; padding-bottom:6px; margin-bottom:10px;">➕ フレンドを追加</h3>
                        <div style="display:flex; gap:8px;">
                            <button id="btn-camera-scan" style="flex:1; padding:10px; background:#22c55e; border:2px solid #16a34a; color:#fff; font-weight:bold; border-radius:8px; cursor:pointer; box-shadow:0 4px 6px rgba(0,0,0,0.1);">📷 カメラでスキャン</button>
                        </div>
                        <div style="display:flex; gap:6px; margin-top:8px;">
                            <input type="text" id="input-passkey" placeholder="パスキーを入力..." style="flex:1; padding:8px; border:2px solid #cbd5e1; border-radius:6px; font-family:monospace; font-weight:bold; font-size:14px; outline:none;">
                            <button id="btn-add-passkey" style="padding:8px 12px; background:#3b82f6; border:2px solid #2563eb; color:#fff; font-weight:bold; border-radius:6px; cursor:pointer;">申請</button>
                        </div>
                        
                        <!-- Camera Mock UI -->
                        <div id="camera-mock" style="display:none; margin-top:10px; background:#000; height:120px; border-radius:8px; position:relative; overflow:hidden; border:2px solid #16a34a;">
                            <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); color:#22c55e; font-weight:bold; font-size:12px; z-index:2; text-shadow:1px 1px 2px #000;">[ カメラスキャン起動中... ]</div>
                            <div style="position:absolute; top:10px; bottom:10px; left:10px; right:10px; border:2px dashed rgba(34,197,94,0.5); z-index:1;"></div>
                            <div class="scan-line" style="position:absolute; top:0; left:0; right:0; height:4px; background:rgba(34,197,94,0.8); box-shadow:0 0 8px #22c55e;"></div>
                        </div>
                    </div>

                    <!-- Friend List -->
                    <div class="rpg-parchment" style="padding:12px; border-radius:12px; background:#fefce8; flex:1;">
                        <h3 style="font-size:14px; font-weight:bold; color:#a16207; border-bottom:2px dashed #fde047; padding-bottom:6px; margin-bottom:10px;">📋 フレンドリスト (3/50)</h3>
                        <div style="display:flex; flex-direction:column; gap:8px; font-size:12px; font-weight:bold;">
                            
                            <!-- Friend 1 -->
                            <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; padding:8px; border:2px solid #fef08a; border-radius:8px;">
                                <div style="display:flex; align-items:center; gap:8px;">
                                    <div style="width:10px; height:10px; background:#22c55e; border-radius:50%;"></div>
                                    <div>
                                        <div style="color:#1e293b;">看護師・佐藤</div>
                                        <div style="font-size:9px; color:#64748b; font-weight:normal;">ヒーラーズギルド / Lv.12</div>
                                    </div>
                                </div>
                                <button style="padding:4px 8px; background:#f59e0b; border:none; color:#fff; font-weight:bold; border-radius:4px; font-size:10px; cursor:pointer;">協力プレイ</button>
                            </div>

                            <!-- Friend 2 -->
                            <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; padding:8px; border:2px solid #e2e8f0; border-radius:8px;">
                                <div style="display:flex; align-items:center; gap:8px;">
                                    <div style="width:10px; height:10px; background:#94a3b8; border-radius:50%;"></div>
                                    <div>
                                        <div style="color:#64748b;">相談員・田中</div>
                                        <div style="font-size:9px; color:#94a3b8; font-weight:normal;">ソーシャルギルド / Lv.8</div>
                                    </div>
                                </div>
                                <div style="font-size:10px; color:#94a3b8;">オフライン</div>
                            </div>

                            <!-- Friend 3 -->
                            <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; padding:8px; border:2px solid #fef08a; border-radius:8px;">
                                <div style="display:flex; align-items:center; gap:8px;">
                                    <div style="width:10px; height:10px; background:#22c55e; border-radius:50%;"></div>
                                    <div>
                                        <div style="color:#1e293b;">施設長・鈴木</div>
                                        <div style="font-size:9px; color:#64748b; font-weight:normal;">アドミンギルド / Lv.99</div>
                                    </div>
                                </div>
                                <button style="padding:4px 8px; background:#3b82f6; border:none; color:#fff; font-weight:bold; border-radius:4px; font-size:10px; cursor:pointer;">チャット</button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
            
            <style>
                @keyframes scanAnim {
                    0% { top: 0; }
                    50% { top: 100%; }
                    100% { top: 0; }
                }
                .scan-line {
                    animation: scanAnim 3s linear infinite;
                }
            </style>
        `;
    }

    generatePasskey() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Readable characters
        let key = '';
        for(let i=0; i<6; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        window.gameState.data.passkey = key;
        window.gameState.saveData();
        return key;
    }

    init() {
        if (window.audioManager) {
            window.audioManager.playBGM('フレンド.mp3');
        }

        this.element.querySelector('#btn-back-friend').addEventListener('click', () => {
            this.sm.changeScene('mainHub');
        });

        const camMock = this.element.querySelector('#camera-mock');
        this.element.querySelector('#btn-camera-scan').addEventListener('click', () => {
            camMock.style.display = camMock.style.display === 'none' ? 'block' : 'none';
            if(camMock.style.display === 'block') {
                setTimeout(() => {
                    alert('QRコードを読み取りました！\nフレンド申請を送信しました。');
                    camMock.style.display = 'none';
                }, 3000);
            }
        });

        this.element.querySelector('#btn-add-passkey').addEventListener('click', () => {
            const input = this.element.querySelector('#input-passkey').value.trim();
            if(!input) {
                alert('パスキーを入力してください。');
                return;
            }
            alert(`パスキー「${input}」へフレンド申請を送信しました！`);
            this.element.querySelector('#input-passkey').value = '';
        });
    }
}
