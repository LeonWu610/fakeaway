const common = {
  archetype: 'instant-retail', status: 'active', rating: 4.8, deliveryFee: 0, minPrice: 0,
  promotionText: '满29减5', promotionRules: ['满29减5', '满49减10'], couponAmount: 5,
  coupons: [{ id: 'retail-c1', type: '即时券', amount: 5, threshold: 29, detail: '模拟商品可用' }],
  businessHours: { open: '00:00', close: '24:00' },
  waitingProfile: { tone: 'efficient', stages: ['库存确认完成，正在拣货', '商品正在逐件核对', '想象骑手已经取货', '很快送到想象中的门口'] },
}

export default [
  {
    ...common, id: 'r7', name: '转角补给站', retailCategory: 'market', description: '深夜也亮着灯的原创便利店，零食饮料和日用品都能模拟送到。', slogan: '缺什么，慢慢挑。',
    image: 'https://pub-e72b8e0a3d2b466392dbb9007970e4b7.r2.dev/images/products/r7-item1-sea-salt-potato-chips.jpg', rating: 4.8, monthlySales: '7000+', distance: '0.4km', deliveryTime: 16, avgPrice: 24, categories: ['超市便利', '即时零售'], tags: ['24小时', '极速拣货'],
    listProfile: { identity: '24H便利', imageBadge: '16分钟达', scoreBadge: '附近常用', serviceTags: ['即时配送', '库存充足'], benefitLabel: '补给券' },
    operationCard: { eyebrow: '深夜补给', title: '今晚缺的都在这里', description: '饮料、零食和日用品已经分类摆好', action: '去挑选' },
    menus: [
      { categoryId: 'snack', categoryName: '零食饮料', items: [
        { id: 'r7_item1', name: '海盐脆薯片', description: '咔嚓一声，今天就先到这里', price: 8, image: 'https://pub-e72b8e0a3d2b466392dbb9007970e4b7.r2.dev/images/products/r7-item1-sea-salt-potato-chips.jpg', monthlySales: '月售1200+', isHot: true, rating: 98 },
        { id: 'r7_item2', name: '冰柠气泡水', description: '清爽柠檬味，不必真的打开', price: 6, image: 'https://pub-e72b8e0a3d2b466392dbb9007970e4b7.r2.dev/images/products/r7-item2-iced-lemon-sparkling-water.jpg', monthlySales: '月售900+', isRecommended: true, rating: 97 },
        { id: 'r7_item3', name: '深夜巧克力曲奇', description: '留给还不想睡的你', price: 12, image: 'https://pub-e72b8e0a3d2b466392dbb9007970e4b7.r2.dev/images/products/r7-item3-midnight-chocolate-cookies.jpg', monthlySales: '月售600+', rating: 96 },
      ]},
      { categoryId: 'daily', categoryName: '日常补给', items: [
        { id: 'r7_item4', name: '柔软抽纸三包装', description: '普通但让人安心的生活用品', price: 15, image: 'https://pub-e72b8e0a3d2b466392dbb9007970e4b7.r2.dev/images/products/r7-item4-soft-facial-tissues-three-pack.jpg', monthlySales: '月售500+', rating: 97 },
        { id: 'r7_item5', name: '旅行洗漱补给包', description: '牙刷、湿巾与小毛巾组合', price: 19, image: 'https://pub-e72b8e0a3d2b466392dbb9007970e4b7.r2.dev/images/products/r7-item5-travel-toiletry-kit.jpg', monthlySales: '月售300+', rating: 96 },
      ]},
    ],
  },
  {
    ...common, id: 'r8', name: '果然会到', retailCategory: 'fruits', description: '原创鲜果小铺，按成熟度分区，想象中的水果也认真挑。', slogan: '今天的甜，已经挑好了。',
    image: 'https://pub-e72b8e0a3d2b466392dbb9007970e4b7.r2.dev/images/products/r8-item1-sweet-strawberry-box.jpg', rating: 4.9, monthlySales: '4500+', distance: '0.9km', deliveryTime: 24, avgPrice: 36, categories: ['蔬菜水果', '鲜果'], tags: ['当日鲜果', '成熟度可选'],
    listProfile: { identity: '当日鲜果', imageBadge: '现切现装', scoreBadge: '果香很足', serviceTags: ['鲜果专送', '坏果包换'], benefitLabel: '鲜果券' },
    operationCard: { eyebrow: '今日果篮', title: '刚刚好的成熟度', description: '每一份都按软硬和甜度认真挑选', action: '看果篮' },
    menus: [
      { categoryId: 'fruit', categoryName: '今日鲜果', items: [
        { id: 'r8_item1', name: '晴甜草莓盒', description: '红得认真，甜得不过分', price: 29, image: 'https://pub-e72b8e0a3d2b466392dbb9007970e4b7.r2.dev/images/products/r8-item1-sweet-strawberry-box.jpg', monthlySales: '月售1000+', isHot: true, rating: 98 },
        { id: 'r8_item2', name: '青提小果篮', description: '清甜脆口的一小篮绿色心情', price: 35, image: 'https://pub-e72b8e0a3d2b466392dbb9007970e4b7.r2.dev/images/products/r8-item2-green-grape-basket.jpg', monthlySales: '月售800+', isRecommended: true, rating: 98 },
        { id: 'r8_item3', name: '橙意满满四枚装', description: '适合慢慢剥开的明亮橙子', price: 22, image: 'https://pub-e72b8e0a3d2b466392dbb9007970e4b7.r2.dev/images/products/r8-item3-four-fresh-oranges.jpg', monthlySales: '月售600+', rating: 97 },
      ]},
      { categoryId: 'cut', categoryName: '现切果盒', items: [
        { id: 'r8_item4', name: '七彩鲜果杯', description: '七种水果分格装好，不串味', price: 26, image: 'https://pub-e72b8e0a3d2b466392dbb9007970e4b7.r2.dev/images/products/r8-item4-seven-fruit-cup.jpg', monthlySales: '月售700+', isHot: true, rating: 97 },
        { id: 'r8_item5', name: '清爽西瓜方盒', description: '去籽切方，夏夜限定想象', price: 18, image: 'https://pub-e72b8e0a3d2b466392dbb9007970e4b7.r2.dev/images/products/r8-item5-seedless-watermelon-cubes.jpg', monthlySales: '月售500+', rating: 96 },
      ]},
    ],
  },
  {
    ...common, id: 'r9', name: '晚安小药箱', retailCategory: 'medicine', description: '原创健康补给站，只提供日常非处方模拟用品与温和提醒。', slogan: '照顾自己，不必着急。',
    image: 'https://pub-e72b8e0a3d2b466392dbb9007970e4b7.r2.dev/images/products/r9-item1-steam-warming-eye-mask.jpg', rating: 4.9, monthlySales: '3000+', distance: '1.1km', deliveryTime: 28, avgPrice: 30, categories: ['看病买药', '健康用品'], tags: ['药师值守', '隐私包装'],
    listProfile: { identity: '健康补给', imageBadge: '隐私包装', scoreBadge: '安心常备', serviceTags: ['药师值守', '快速送达'], benefitLabel: '关怀券' },
    operationCard: { eyebrow: '温和提醒', title: '不舒服时先照顾好自己', description: '严重或持续不适请及时线下就医', action: '看常备品' },
    menus: [
      { categoryId: 'care', categoryName: '日常护理', items: [
        { id: 'r9_item1', name: '蒸汽热敷眼罩', description: '给盯屏幕太久的眼睛一会儿休息', price: 16, image: 'https://pub-e72b8e0a3d2b466392dbb9007970e4b7.r2.dev/images/products/r9-item1-steam-warming-eye-mask.jpg', monthlySales: '月售800+', isHot: true, rating: 98 },
        { id: 'r9_item2', name: '柔软医用口罩十片', description: '独立包装，日常出门备用', price: 12, image: 'https://pub-e72b8e0a3d2b466392dbb9007970e4b7.r2.dev/images/products/r9-item2-medical-masks-ten-pack.jpg', monthlySales: '月售600+', rating: 97 },
        { id: 'r9_item3', name: '创口护理组合', description: '创可贴与清洁棉片的日常组合', price: 18, image: 'https://pub-e72b8e0a3d2b466392dbb9007970e4b7.r2.dev/images/products/r9-item3-wound-care-kit.jpg', monthlySales: '月售400+', isRecommended: true, rating: 98 },
      ]},
      { categoryId: 'comfort', categoryName: '舒缓补给', items: [
        { id: 'r9_item4', name: '温热贴四片装', description: '轻轻暖一会儿，避免直接接触皮肤', price: 20, image: 'https://pub-e72b8e0a3d2b466392dbb9007970e4b7.r2.dev/images/products/r9-item4-warming-patches-four-pack.jpg', monthlySales: '月售500+', rating: 97 },
        { id: 'r9_item5', name: '便携冷敷袋', description: '可重复使用的日常冷敷用品', price: 24, image: 'https://pub-e72b8e0a3d2b466392dbb9007970e4b7.r2.dev/images/products/r9-item5-reusable-cold-compress-bag.jpg', monthlySales: '月售260+', rating: 96 },
      ]},
    ],
  },
  {
    ...common, id: 'r10', name: '顺路帮帮忙', retailCategory: 'errand', description: '原创同城跑腿服务站，模拟代取、代送与排队，不发生真实委托。', slogan: '不方便出门的事，交给想象中的顺路人。',
    image: 'https://pub-e72b8e0a3d2b466392dbb9007970e4b7.r2.dev/images/products/r10-item1-nearby-pickup-service.jpg', rating: 4.9, monthlySales: '5200+', distance: '0.6km', deliveryTime: 22, avgPrice: 16, categories: ['跑腿', '同城配送'], tags: ['专人直送', '进度可查'],
    promotionText: '首单模拟减3', promotionRules: ['首单模拟减3', '满25减5'], couponAmount: 3,
    coupons: [{ id: 'errand-c1', type: '跑腿券', amount: 3, threshold: 0, detail: '模拟跑腿服务可用' }],
    businessHours: { open: '07:00', close: '23:30' },
    listProfile: { identity: '同城跑腿', imageBadge: '22分钟响应', scoreBadge: '响应很快', serviceTags: ['专人直送', '全程可查'], benefitLabel: '跑腿券' },
    operationCard: { eyebrow: '附近帮手', title: '取送排队都能搭把手', description: '选择服务范围和物品大小即可模拟下单', action: '发布委托' },
    waitingProfile: { tone: 'efficient', stages: ['跑腿员已接下模拟委托', '正在前往约定取件点', '物品信息已核对，开始送达', '顺路人很快抵达想象中的门口'] },
    menus: [
      { categoryId: 'pickup', categoryName: '代取代送', items: [
        { id: 'r10_item1', name: '附近帮取一趟', description: '模拟代取快递、文件或已付款物品，基础范围2公里', price: 10, image: 'https://pub-e72b8e0a3d2b466392dbb9007970e4b7.r2.dev/images/products/r10-item1-nearby-pickup-service.jpg', monthlySales: '月售1600+', isHot: true, rating: 98 },
        { id: 'r10_item2', name: '同城文件直送', description: '模拟文件袋点对点送达，取送信息由你想象', price: 16, image: 'https://pub-e72b8e0a3d2b466392dbb9007970e4b7.r2.dev/images/products/r10-item2-city-document-delivery.jpg', monthlySales: '月售980+', isRecommended: true, rating: 99 },
        { id: 'r10_item3', name: '小件物品代送', description: '适合钥匙、雨伞等轻便日用品，不含贵重物品', price: 14, image: 'https://pub-e72b8e0a3d2b466392dbb9007970e4b7.r2.dev/images/products/r10-item3-small-item-delivery.jpg', monthlySales: '月售760+', rating: 97 },
      ]},
      { categoryId: 'help', categoryName: '生活帮忙', items: [
        { id: 'r10_item4', name: '帮忙排队半小时', description: '模拟普通门店排队占位，不涉及医疗及政务事项', price: 18, image: 'https://pub-e72b8e0a3d2b466392dbb9007970e4b7.r2.dev/images/products/r10-item4-half-hour-queue-service.jpg', monthlySales: '月售620+', isHot: true, rating: 97 },
        { id: 'r10_item5', name: '忘带物品取回', description: '从熟悉地点模拟取回一件落下的小物品', price: 15, image: 'https://pub-e72b8e0a3d2b466392dbb9007970e4b7.r2.dev/images/products/r10-item5-forgotten-item-retrieval.jpg', monthlySales: '月售530+', isRecommended: true, rating: 98 },
        { id: 'r10_item6', name: '鲜花蛋糕轻送', description: '模拟轻拿轻放专送，适合需要保持平稳的物品', price: 22, image: 'https://pub-e72b8e0a3d2b466392dbb9007970e4b7.r2.dev/images/products/r10-item6-flower-cake-careful-delivery.jpg', monthlySales: '月售410+', rating: 98 },
      ]},
    ],
  },
]
