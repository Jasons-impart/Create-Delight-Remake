let info = [["createdelightcore:fragment_of_border", "使用边界碎块右击边界碎块召唤瞻远者", "TEST"]];

info.forEach(([key, zh_cn, en_us]) => {
  // 添加 key
  JEIEvents.information((event) => {
    event.addItem(key, Text.translate(key));
  });

  // 添加简体中文本地化
  ClientEvents.lang("zh_cn", (event) => {
    event.add(key, zh_cn);
  });

  // 添加英文本地化
  ClientEvents.lang("en_us", (event) => {
    event.add(key, en_us);
  });
});
