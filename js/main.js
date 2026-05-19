document.addEventListener('DOMContentLoaded', () => {
    // Initialize Scene Manager
    const sm = new SceneManager('app');
    window.sm = sm;

    // Register Scenes
    sm.registerScene('title', TitleScene);
    sm.registerScene('create', CreateScene);
    sm.registerScene('mainHub', MainHubScene);
    sm.registerScene('worldMap', WorldMapScene);
    sm.registerScene('report', ReportScene);
    sm.registerScene('partner', PartnerScene);
    sm.registerScene('battle', BattleScene);
    sm.registerScene('shop', ShopScene);
    sm.registerScene('quest', QuestScene);
    sm.registerScene('friend', FriendScene);
    sm.registerScene('admin', AdminScene);

    // Start with Title Scene
    sm.changeScene('title');
});
