const common = { status: 'active', deliveryFee: 0, minPrice: 15, couponAmount: 6,
  coupons: [{ id: 'food-new', type: '新客券', amount: 6, threshold: 0, detail: '首次模拟下单可用' }, { id: 'food-full', type: '满减券', amount: 10, threshold: 39, detail: '满39元可用' }] }

const fallbackImages = {
  rice: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&q=80',
  malatang: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&q=80',
  noodles: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&q=80',
  bbq: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=300&q=80',
  japanese: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&q=80',
  lightMeal: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80',
  breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=300&q=80',
  dumplings: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300&q=80',
  stirFry: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&q=80',
  bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80',
}

const productImages = {
  r11: ['/images/products/r11-item1-claypot-rice.png', '/images/products/r11-item2-black-bean-ribs.png', '/images/products/r11-item3-beef-egg-rice.png', '/images/products/r11-item4-mushroom-chicken-rice.png'],
  r12: ['/images/products/r12-item1-malatang.png', '/images/products/r12-item2-sour-beef-malatang.png', '/images/products/r12-item3-tomato-soup-bowl.png', '/images/products/r12-item4-mushroom-tofu-bowl.png'],
  r13: ['/images/products/r13-item1-noodles.png', '/images/products/r13-item2-pea-noodles.png', '/images/products/r13-item3-tonkotsu-ramen.png', '/images/products/r13-item4-sour-beef-rice-noodles.png'],
  r14: ['/images/products/r14-item1-bbq.png', '/images/products/r14-item2-beef-skewers.png', '/images/products/r14-item3-honey-chicken-wings.png', '/images/products/r14-item4-chicken-cartilage-skewers.png', '/images/products/r14-item5-garlic-eggplant.png'],
  r15: ['/images/products/r15-item1-seared-salmon-sushi.png', '/images/products/r15-item2-sashimi-chirashi.png', '/images/products/r15-item3-eel-tamago-rice.png', '/images/products/r15-item4-teriyaki-chicken-rice.png'],
  r16: ['/images/products/r16-item1-chicken-grain-bowl.png', '/images/products/r16-item2-beef-energy-bowl.png', '/images/products/r16-item3-avocado-shrimp-salad.png', '/images/products/r16-item4-teriyaki-tofu-bowl.png'],
  r17: ['/images/products/r17-item1-century-egg-congee.png', '/images/products/r17-item2-shrimp-scallop-congee.png', '/images/products/r17-item3-pumpkin-millet-congee.png', '/images/products/r17-item4-mushroom-chicken-congee.png', '/images/products/r17-item5-pork-xiaolongbao.png'],
  r18: ['/images/products/r18-item1-pork-cabbage-dumplings.png', '/images/products/r18-item2-shrimp-chive-dumplings.png', '/images/products/r18-item3-corn-pork-potstickers.png', '/images/products/r18-item4-sour-beef-dumplings.png', '/images/products/r18-item5-three-fresh-potstickers.png', '/images/products/r18-item6-kelp-salad.png', '/images/products/r18-item7-single-dumpling-combo.png', '/images/products/r18-item8-double-dumpling-feast.png'],
  r19: ['/images/products/r19-item1-green-pepper-pork.png', '/images/products/r19-item2-tomato-eggs.png', '/images/products/r19-item3-fish-fragrant-pork.png', '/images/products/r19-item4-kung-pao-chicken.png', '/images/products/r19-item5-mapo-tofu.png', '/images/products/r19-item6-garlic-greens.png', '/images/products/r19-item7-worker-combo.png', '/images/products/r19-item8-double-home-meal.png'],
  r20: ['/images/products/r20-item1-sea-salt-roll.png', '/images/products/r20-item2-classic-croissant.png', '/images/products/r20-item3-ham-cheese-ciabatta.png', '/images/products/r20-item4-cinnamon-apple-bagel.png', '/images/products/r20-item5-basque-cheesecake.png', '/images/products/r20-item6-chocolate-cookie.png', '/images/products/r20-item7-breakfast-bread-bag.png', '/images/products/r20-item8-double-afternoon-tea.png'],
}

function makeItems(restaurantId, type, names) {
  return names.map(([name, description, price, sales], index) => ({
    id: `${restaurantId}_item${index + 1}`, name, description, price,
    image: productImages[restaurantId]?.[index] || fallbackImages[type],
    monthlySales: `月售${sales}+`, rating: index < 3 ? 99 - index : 96,
    isHot: index === 0 || index === 4, isRecommended: index === 0 || index === 2,
    originalPrice: index === 0 ? price + 6 : undefined,
  }))
}

function menus(restaurantId, type, names) {
  const items = makeItems(restaurantId, type, names)
  return [{ categoryId: 'popular', categoryName: '热销必点', items: items.slice(0, 4) }, { categoryId: 'more', categoryName: '招牌与套餐', items: items.slice(4, 8) }]
}

export default [
  {
    ...common, id: 'r11', name: '叔仔煲仔饭', foodCategory: 'rice', archetype: 'neighborhood-kitchen',
    description: '巷口现煲的广式煲仔饭，米饭吸满酱汁，锅底留一圈焦香锅巴。', slogan: '一锅到底，锅巴留给懂的人。',
    image: '/images/merchants/r11-claypot-rice.png', coverImages: ['/images/merchants/r11-claypot-rice.png'], rating: 4.8, monthlySales: '6800+', distance: '0.7km', deliveryTime: 26, avgPrice: 28,
    categories: ['中式快餐', '煲仔饭'], tags: ['现点现煲', '锅巴焦香'], businessHours: { open: '10:30', close: '21:30' }, promotionText: '满30减6', promotionRules: ['满30减6', '满50减12'],
    listProfile: { identity: '街坊煲仔', imageBadge: '现煲出锅', scoreBadge: '锅巴很香', serviceTags: ['热饭专送', '支持自取'], benefitLabel: '煲仔券' },
    operationCard: { eyebrow: '午市热卖', title: '今日煲仔饭人气榜', description: '腊味、排骨、滑鸡都在砂锅里慢慢入味', action: '趁热开煲' },
    waitingProfile: { tone: 'warm', stages: ['砂锅上灶，米饭开始吸收高汤', '主料铺进锅里，酱汁慢慢收紧', '锅巴已经焦香，想象骑手正在取餐', '热腾腾的砂锅饭马上到门口'] },
    imagePrompt: { purpose: 'merchant-cover', prompt: '原创广式煲仔饭外卖商家封面，一锅腊味煲仔饭近景，焦香锅巴、腊肠和青菜清晰可见，暖棕色木桌，真实中式美食商业摄影，无文字无商标无人物，1:1' },
    menus: menus('r11', 'claypot-rice', [
      ['腊味三拼煲', '广式腊肠、腊肉与润肠铺满砂锅', 32, 1800], ['豆豉排骨煲', '软嫩排骨配阳江豆豉，咸香下饭', 30, 1200], ['窝蛋牛肉煲', '手打牛肉饼卧一颗流心蛋', 34, 980], ['香菇滑鸡煲', '嫩鸡腿肉与香菇焖出清甜汁水', 28, 860],
      ['滑蛋虾仁饭', '厚滑蛋盖住整碗米饭，虾仁弹嫩', 29, 1100], ['叉烧双蛋饭', '蜜汁叉烧配两颗煎蛋，经典港味', 27, 690], ['打工人碳水套餐', '招牌煲仔饭配例汤与凉菜', 39, 1300], ['叔仔双人饱饱餐', '两份煲仔饭、例汤和时蔬', 68, 520],
    ]),
  },
  {
    ...common, id: 'r12', name: '辣不辣你说了算', foodCategory: 'malatang', archetype: 'specialty-menu',
    description: '一人一锅的原创麻辣烫与冒菜店，汤底、辣度和食材都能认真选。', slogan: '能吃辣是本事，不能吃也算。',
    image: '/images/merchants/r12-malatang.png', coverImages: ['/images/merchants/r12-malatang.png'], rating: 4.9, monthlySales: '8200+', distance: '1.0km', deliveryTime: 29, avgPrice: 27,
    categories: ['麻辣烫', '冒菜'], tags: ['汤底可选', '一人一锅'], businessHours: { open: '10:00', close: '23:30' }, promotionText: '满35减8', promotionRules: ['满35减8', '满58减15'],
    listProfile: { identity: '自选麻辣烫', imageBadge: '一人一锅', scoreBadge: '汤底浓郁', serviceTags: ['独立封签', '辣度可选'], benefitLabel: '加菜券' },
    operationCard: { eyebrow: '自由搭配', title: '四种汤底十二种满足', description: '不会选就从配好的招牌碗开始', action: '开始配菜' },
    waitingProfile: { tone: 'excited', stages: ['汤底已经煮开，香气开始冒出来', '食材按熟成时间依次下锅', '宽粉吸满汤汁，想象骑手准备出发', '这一碗热辣快乐马上送到'] },
    imagePrompt: { purpose: 'merchant-cover', prompt: '原创麻辣烫外卖商家封面，一大碗红油麻辣烫，牛肉片、藕片、宽粉、豆皮和青菜层次丰富，红色陶碗，热气自然，真实商业美食摄影，无文字无商标无人物，1:1' },
    menus: menus('r12', 'malatang', [
      ['经典红油全家福', '牛肉、毛肚、午餐肉、宽粉和时蔬', 36, 2300], ['酸汤肥牛金汤碗', '金黄酸汤配肥牛和金针菇', 34, 1600], ['番茄牛骨浓汤碗', '酸甜番茄汤底，温和不辣也浓郁', 32, 1200], ['菌菇豆乳素食碗', '菌菇、豆腐和蔬菜的清爽组合', 27, 680],
      ['手打鲜牛肉', '每日现拌的滑嫩牛肉片', 12, 1900], ['毛肚午餐肉双拼', '脆毛肚和厚切午餐肉各半份', 15, 1400], ['响铃卷吸汁王', '炸腐皮卷入汤三秒吸满味道', 9, 1250], ['宽粉土豆片双拼', '软糯和弹滑两种口感', 8, 980],
    ]),
  },
  {
    ...common, id: 'r13', name: '面面俱到', foodCategory: 'noodles', archetype: 'chain-campaign',
    description: '从浓汤拉面到重庆小面，一家店承包今天想吃的所有面。', slogan: '每一面都好吃，除了生活那面。',
    image: '/images/merchants/r13-noodles.png', coverImages: ['/images/merchants/r13-noodles.png'], rating: 4.8, monthlySales: '7300+', distance: '1.2km', deliveryTime: 25, avgPrice: 31,
    categories: ['面馆', '米粉'], tags: ['汤面分装', '加面可选'], businessHours: { open: '09:00', close: '22:30' }, promotionText: '满32减7', promotionRules: ['满32减7', '满60减14'],
    listProfile: { identity: '面食集合店', imageBadge: '汤面分装', scoreBadge: '面条筋道', serviceTags: ['现煮出餐', '支持加面'], benefitLabel: '加面券' },
    operationCard: { eyebrow: '今天吃面', title: '南北面食同台热卖', description: '浓汤、拌面、米粉各有自己的拥护者', action: '挑一碗面' },
    waitingProfile: { tone: 'warm', stages: ['高汤正在滚开，面条准备下锅', '浇头现炒，香气已经出来了', '汤面分装完成，想象骑手取餐中', '筋道热面马上抵达'] },
    imagePrompt: { purpose: 'merchant-cover', prompt: '原创中式面馆外卖商家封面，一大碗红烧牛肉面近景，筋道面条、厚切牛肉、青菜和清亮红汤，热气自然，真实商业美食摄影，无文字无商标无人物，1:1' },
    menus: menus('r13', 'noodles', [
      ['招牌红烧牛肉面', '厚切牛腱、青菜与筋道手工面', 32, 2100], ['重庆豌杂小面', '豌豆软糯，肉臊酱香，麻辣鲜香', 26, 1700], ['浓厚豚骨叉烧面', '乳白汤底配炙烤叉烧和溏心蛋', 36, 1300], ['酸汤肥牛米线', '酸辣开胃，肥牛铺满一整层', 31, 980],
      ['宜宾燃面', '芽菜花生与红油拌匀，干香有劲', 24, 870], ['老麻红油抄手', '十只鲜肉抄手浸在香辣红油里', 25, 920], ['面面俱到双拼碗', '半份牛肉面加半份豌杂面', 38, 760], ['深夜治愈大碗', '加量面条、牛肉与溏心蛋', 42, 610],
    ]),
  },
  {
    ...common, id: 'r14', name: '炭知炭觉', foodCategory: 'bbq', archetype: 'late-night-story',
    description: '炭火慢烤的原创夜宵铺，一串一串把今天的烦恼都撒上孜然。', slogan: '烟火气里没有烦恼，只有孜然。',
    image: '/images/merchants/r14-bbq.png', coverImages: ['/images/merchants/r14-bbq.png'], rating: 4.9, monthlySales: '5900+', distance: '1.5km', deliveryTime: 33, avgPrice: 45,
    categories: ['烧烤', '夜宵'], tags: ['炭火现烤', '营业到2点'], businessHours: { open: '17:00', close: '02:00' }, promotionText: '满49减10', promotionRules: ['满49减10', '满88减20'],
    listProfile: { identity: '炭火烤串', imageBadge: '现点现烤', scoreBadge: '烟火气足', serviceTags: ['锡纸保温', '夜宵专送'], benefitLabel: '烤串券' },
    operationCard: { eyebrow: '深夜开烤', title: '炭火上的夜宵自由', description: '肉串、烤物和锡纸小菜一起上桌', action: '开始撸串' },
    waitingProfile: { tone: 'story', stages: ['炭火烧旺，第一把肉串已经上架', '油脂落在炭上，孜然香气升起来了', '烤串装进保温袋，想象骑手出发', '今晚的烟火气很快到达'] },
    imagePrompt: { purpose: 'merchant-cover', prompt: '原创炭火烧烤外卖商家封面，一盘刚烤好的羊肉串和牛肉串近景，肉汁油亮、孜然辣椒自然，暗色木桌和暖红炭火背景，真实夜宵商业摄影，无文字无商标无人物，1:1' },
    menus: menus('r14', 'bbq', [
      ['羊肉串五串', '肥瘦相间羊腿肉，炭火烤出焦边', 25, 1900], ['牛肉粒五串', '大粒牛肉配青椒，肉汁饱满', 28, 1500], ['蜜汁烤鸡翅', '四只鸡翅慢烤入味，表皮微焦', 24, 1300], ['掌中宝五串', '脆弹鸡软骨，越嚼越香', 22, 1100],
      ['蒜蓉烤茄子', '整根茄子铺满蒜蓉和葱花', 16, 1600], ['锡纸花甲粉丝', '花甲、粉丝与蒜蓉在锡纸中焖香', 22, 1200], ['二人微醺烤串局', '二十串荤素搭配加两份小菜', 78, 680], ['一个人的烧烤自由', '十串招牌肉串加烤馒头和饮品', 46, 890],
    ]),
  },
  {
    ...common, id: 'r15', name: '一尾入魂', foodCategory: 'japanese', archetype: 'specialty-menu',
    description: '认真做握寿司、刺身饭与热食的小日料店，冷食分装，米饭保持温热。', slogan: '这一尾很新鲜，这一口很认真。',
    image: '/images/merchants/r15-japanese.png', coverImages: ['/images/merchants/r15-japanese.png'], rating: 4.9, monthlySales: '4600+', distance: '1.3km', deliveryTime: 32, avgPrice: 48,
    categories: ['日料', '寿司'], tags: ['冷食分装', '现切现做'], businessHours: { open: '10:30', close: '22:30' }, promotionText: '满49减9', promotionRules: ['满49减9', '满88减18'],
    listProfile: { identity: '现做日料', imageBadge: '冷食分装', scoreBadge: '鱼料新鲜', serviceTags: ['芥末另装', '保冷配送'], benefitLabel: '寿司券' },
    operationCard: { eyebrow: '今日鱼获', title: '握寿司与刺身饭人气榜', description: '三文鱼、炙烤鳗鱼和甜虾按口味分区', action: '挑一份日料' },
    waitingProfile: { tone: 'professional', stages: ['寿司米已经拌好，正在慢慢降温', '鱼料现切，握寿司逐枚成形', '冷食与热食分装完毕，想象骑手取餐中', '这一份清爽鲜味马上抵达'] },
    imagePrompt: { purpose: 'merchant-cover', prompt: '原创日料外卖商家封面，一盘三文鱼握寿司、炙烤鳗鱼寿司和甜虾寿司，鱼料纹理自然，深蓝灰背景，克制高级的真实商业美食摄影，无文字无商标无人物，1:1' },
    menus: menus('r15', 'japanese', [
      ['炙烤三文鱼六贯', '厚切三文鱼轻炙出油脂香，搭配醋饭', 46, 1500], ['招牌刺身散寿司饭', '三文鱼、甜虾、玉子与海藻铺满醋饭', 52, 1200], ['鳗鱼玉子双拼饭', '蒲烧鳗鱼配厚玉子烧，咸甜温润', 45, 980], ['照烧鸡排温泉蛋饭', '焦香鸡腿排、温泉蛋与海苔米饭', 36, 880],
      ['甜虾牛油果手卷', '甜虾与牛油果现卷，口感柔润', 22, 760], ['唐扬炸鸡块', '日式酱油腌制，外酥里嫩', 20, 1100], ['一尾精选单人餐', '六贯寿司、唐扬鸡块和味噌汤', 59, 820], ['双人寿司分享盒', '十二贯握寿司与两份小食', 108, 430],
    ]),
  },
  {
    ...common, id: 'r16', name: '草木有饭', foodCategory: 'lightMeal', archetype: 'chain-campaign',
    description: '不是只吃草的轻食厨房，现烤蛋白、谷物和蔬菜都认真搭配。', slogan: '今天轻一点，满足一点也不少。',
    image: '/images/merchants/r16-light-meal.png', coverImages: ['/images/merchants/r16-light-meal.png'], rating: 4.8, monthlySales: '5100+', distance: '0.9km', deliveryTime: 24, avgPrice: 34,
    categories: ['轻食', '沙拉'], tags: ['热量标注', '酱汁另装'], businessHours: { open: '08:30', close: '21:00' }, promotionText: '满35减7', promotionRules: ['满35减7', '满60减13'],
    listProfile: { identity: '均衡轻食', imageBadge: '现烤蛋白', scoreBadge: '搭配丰富', serviceTags: ['酱汁另装', '主食可换'], benefitLabel: '轻盈券' },
    operationCard: { eyebrow: '均衡一餐', title: '有肉有菜也有碳水', description: '按饱腹、轻盈和高蛋白三种方向选', action: '搭一份碗' },
    waitingProfile: { tone: 'professional', stages: ['谷物和蔬菜正在称量分装', '主蛋白现烤，表面刚刚焦香', '酱汁独立封装，想象骑手准备出发', '清爽但很饱的一餐马上到达'] },
    imagePrompt: { purpose: 'merchant-cover', prompt: '原创轻食外卖商家封面，一碗香草烤鸡胸谷物沙拉，藜麦、南瓜、牛油果、小番茄和绿色蔬菜层次清晰，浅绿色背景，明亮自然的真实商业美食摄影，无文字无商标无人物，1:1' },
    menus: menus('r16', 'lightMeal', [
      ['香草鸡胸谷物碗', '现烤鸡胸、藜麦、南瓜与时蔬', 36, 1900], ['黑椒牛肉能量碗', '嫩牛肉、糙米、玉米与西兰花', 42, 1400], ['牛油果虾仁沙拉', '弹嫩虾仁配半颗牛油果和生菜', 39, 1200], ['照烧豆腐素食碗', '香煎豆腐、菌菇与杂粮饭', 31, 680],
      ['溏心蛋凯撒沙拉', '罗马生菜、溏心蛋与脆面包丁', 28, 960], ['南瓜鹰嘴豆浓汤', '绵密南瓜与鹰嘴豆打成暖汤', 16, 720], ['高蛋白训练套餐', '双份鸡胸、谷物碗与无糖饮品', 52, 860], ['草木双人均衡餐', '两份能量碗加沙拉与暖汤', 78, 510],
    ]),
  },
  {
    ...common, id: 'r17', name: '早粥到', foodCategory: 'breakfast', archetype: 'neighborhood-kitchen',
    description: '从清晨营业到午后的小粥铺，粥、包点和鸡蛋都现蒸现煮。', slogan: '早一点也好，晚一点也有热粥。',
    image: '/images/merchants/r17-breakfast.png', coverImages: ['/images/merchants/r17-breakfast.png'], rating: 4.8, monthlySales: '7600+', distance: '0.6km', deliveryTime: 21, avgPrice: 22,
    categories: ['粥品', '早餐'], tags: ['清晨营业', '现蒸包点'], businessHours: { open: '06:30', close: '14:30' }, promotionText: '满25减5', promotionRules: ['满25减5', '满40减9'],
    listProfile: { identity: '街坊早餐', imageBadge: '清晨现熬', scoreBadge: '热粥暖胃', serviceTags: ['粥点分装', '支持预约'], benefitLabel: '早餐券' },
    operationCard: { eyebrow: '清晨热卖', title: '粥暖着，包点刚出笼', description: '赶时间就选搭配好的早餐组合', action: '吃顿早餐' },
    waitingProfile: { tone: 'warm', stages: ['米粥正在小火翻滚，香气慢慢出来', '包点重新回温，鸡蛋刚刚煮好', '粥点分装封好，想象骑手取餐中', '这一口热乎早餐很快到门口'] },
    imagePrompt: { purpose: 'merchant-cover', prompt: '原创中式早餐外卖商家封面，一碗皮蛋瘦肉粥配小笼包、茶叶蛋和清爽小菜，暖米色桌面，晨光柔和，亲切真实的商业美食摄影，无文字无商标无人物，1:1' },
    menus: menus('r17', 'breakfast', [
      ['皮蛋瘦肉粥', '米粒绵滑，瘦肉鲜嫩，皮蛋切块清晰', 16, 2600], ['鲜虾干贝粥', '鲜虾与干贝小火熬出海味', 24, 1500], ['南瓜小米粥', '南瓜自然清甜，小米熬至绵密', 12, 1300], ['香菇鸡丝粥', '鸡丝、香菇与青菜暖胃不腻', 17, 1100],
      ['鲜肉小笼包六只', '薄皮锁住鲜肉汤汁，现蒸出笼', 15, 2200], ['虾皮鸡蛋肠粉', '软滑肠粉裹鸡蛋，酱汁另装', 14, 1800], ['元气上班早餐', '招牌粥、小笼包、鸡蛋和豆浆', 29, 1700], ['慢慢吃双人早餐', '两份粥、两笼点心与两杯豆浆', 49, 680],
    ]),
  },
  {
    ...common, id: 'r18', name: '一口到家饺子馆', foodCategory: 'dumplings', archetype: 'neighborhood-kitchen',
    description: '现包现煮的街坊饺子馆，水饺、煎饺和家常小菜都按份认真做。', slogan: '一口一个，今天也算回家吃饭。',
    image: '/images/merchants/r18-dumplings.png', coverImages: ['/images/merchants/r18-dumplings.png'], rating: 4.9, monthlySales: '6900+', distance: '0.8km', deliveryTime: 24, avgPrice: 27,
    categories: ['饺子', '锅贴'], tags: ['现包现煮', '蘸料分装'], businessHours: { open: '09:30', close: '22:00' }, promotionText: '满30减6', promotionRules: ['满30减6', '满50减11'],
    listProfile: { identity: '手工饺子馆', imageBadge: '现包现煮', scoreBadge: '皮薄馅足', serviceTags: ['蘸料另装', '支持自取'], benefitLabel: '加饺券' },
    operationCard: { eyebrow: '今日现包', title: '四种招牌馅刚刚拌好', description: '水煮、煎制和酸汤三种吃法都能选', action: '来一盘饺子' },
    waitingProfile: { tone: 'warm', stages: ['面皮已经擀开，馅料正在现包', '水已经滚开，饺子逐个下锅', '蘸料与饺子分装完成，想象骑手取餐中', '这一盘热饺子马上到家'] },
    imagePrompt: { purpose: 'merchant-cover', prompt: '原创手工饺子外卖商家封面，一盘十二只元宝形水饺，面皮薄润、猪肉白菜馅隐约可见，搭配醋碟和少量小菜，暖木桌与柔和家常光，真实中式商业美食摄影，无文字无商标无人物，1:1' },
    menus: menus('r18', 'dumplings', [
      ['猪肉白菜水饺十二只', '鲜嫩猪肉配脆甜白菜，经典家常馅', 26, 2300], ['韭菜鲜虾水饺十二只', '整颗虾仁配韭菜与鸡蛋，清鲜弹嫩', 32, 1800], ['玉米猪肉煎饺十只', '甜玉米猪肉馅，底部煎至金黄酥脆', 28, 1500], ['酸汤牛肉水饺十二只', '牛肉大葱馅浸入酸辣汤，暖胃开胃', 31, 1200],
      ['三鲜锅贴十只', '猪肉、虾仁与韭菜三鲜馅，脆底多汁', 30, 1600], ['凉拌海带丝', '蒜香微辣，清爽解腻', 9, 980], ['一人饺子满足餐', '十二只水饺、凉菜和紫菜蛋花汤', 36, 1300], ['双人手工饺子宴', '两份招牌饺子、两份小菜和酸梅汤', 68, 560],
    ]),
  },
  {
    ...common, id: 'r19', name: '灶边小炒', foodCategory: 'stirFry', archetype: 'neighborhood-kitchen',
    description: '一人也能点的小份现炒家常菜，锅气、米饭和热汤一起送到。', slogan: '锅气上桌，今天好好吃饭。',
    image: '/images/merchants/r19-stir-fry.png', coverImages: ['/images/merchants/r19-stir-fry.png'], rating: 4.8, monthlySales: '6300+', distance: '1.1km', deliveryTime: 30, avgPrice: 38,
    categories: ['家常菜', '小炒'], tags: ['现点现炒', '小份友好'], businessHours: { open: '10:30', close: '21:30' }, promotionText: '满40减8', promotionRules: ['满40减8', '满68减15'],
    listProfile: { identity: '现炒家常菜', imageBadge: '大火快炒', scoreBadge: '锅气很足', serviceTags: ['米饭可选', '小份友好'], benefitLabel: '下饭券' },
    operationCard: { eyebrow: '灶边热卖', title: '一个人也能点两道菜', description: '荤素小份搭配，不必为了凑单吃三顿', action: '选两道小炒' },
    waitingProfile: { tone: 'warm', stages: ['食材已经切配，炒锅正在烧热', '大火快炒，锅气刚刚起来', '菜饭分装封好，想象骑手正在取餐', '热乎家常菜马上送到'] },
    imagePrompt: { purpose: 'merchant-cover', prompt: '原创中式家常小炒外卖商家封面，一盘青椒小炒肉、一盘番茄炒蛋和一碗白米饭，食材自然、锅气热腾，暖灰桌面，真实中式商业美食摄影，无文字无商标无人物，1:1' },
    menus: menus('r19', 'stirFry', [
      ['青椒小炒肉', '五花肉煸香，青椒脆嫩，锅气十足', 32, 2100], ['番茄炒蛋', '熟番茄自然酸甜，鸡蛋蓬松滑嫩', 22, 1900], ['鱼香肉丝', '肉丝、木耳与笋丝酸甜微辣', 30, 1600], ['宫保鸡丁', '嫩鸡丁配花生与干辣椒，荔枝口味', 31, 1400],
      ['麻婆豆腐', '嫩豆腐裹满肉末豆瓣汁，麻辣下饭', 24, 1700], ['蒜蓉时蔬', '每日绿叶菜大火快炒，清爽蒜香', 18, 1100], ['打工人两菜一饭', '一荤一素、米饭和例汤', 42, 1800], ['灶边双人家常餐', '三道小炒、两份米饭与例汤', 78, 620],
    ]),
  },
  {
    ...common, id: 'r20', name: '麦香慢慢', foodCategory: 'bakery', archetype: 'chain-campaign',
    description: '每日现烤面包、咸点与小蛋糕，适合早餐、下午茶和突然想吃甜的时刻。', slogan: '让面包慢慢发酵，让今天慢一点。',
    image: '/images/merchants/r20-bakery.png', coverImages: ['/images/merchants/r20-bakery.png'], rating: 4.9, monthlySales: '5400+', distance: '1.0km', deliveryTime: 23, avgPrice: 29,
    categories: ['烘焙', '甜点'], tags: ['每日现烤', '独立包装'], businessHours: { open: '07:30', close: '21:30' }, promotionText: '满35减7', promotionRules: ['满35减7', '满58减12'],
    listProfile: { identity: '原创烘焙坊', imageBadge: '今日现烤', scoreBadge: '麦香浓郁', serviceTags: ['独立包装', '支持预约'], benefitLabel: '面包券' },
    operationCard: { eyebrow: '今日出炉', title: '咸甜面包刚刚排上架', description: '早餐选咸口，下午茶留给奶油和巧克力', action: '挑一袋面包' },
    waitingProfile: { tone: 'quiet', stages: ['面团完成最后醒发，烤箱正在预热', '面包烤至金黄，麦香慢慢出来', '每一只独立装好，想象骑手准备出发', '今天的现烤香气马上到达'] },
    imagePrompt: { purpose: 'merchant-cover', prompt: '原创现代烘焙外卖商家封面，牛角包、海盐卷、吐司和小块巴斯克蛋糕摆在浅木托盘，表面金黄、层次自然，米白暖光背景，真实商业烘焙摄影，无文字无商标无人物，1:1' },
    menus: menus('r20', 'bakery', [
      ['海盐黄油卷', '外皮微脆，内里柔软，底部黄油焦香', 12, 2600], ['经典原味可颂', '层层起酥，黄油香气干净自然', 15, 2100], ['火腿芝士恰巴塔', '火腿、芝士与生菜夹入现烤恰巴塔', 24, 1500], ['肉桂苹果贝果', '肉桂苹果丁夹心，嚼感扎实', 16, 1100],
      ['焦香巴斯克蛋糕', '奶酪浓郁，表面焦香，中心柔润', 22, 1800], ['巧克力熔岩软曲奇', '黑巧克力豆丰富，中心柔软', 14, 1600], ['元气早餐面包袋', '两款咸面包、酸奶和时令水果', 36, 1200], ['麦香双人下午茶', '四款面包甜点与两杯饮品', 58, 680],
    ]),
  },
]
