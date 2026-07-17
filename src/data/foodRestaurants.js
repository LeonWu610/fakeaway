const common = { status: 'active', deliveryFee: 0, minPrice: 15, couponAmount: 6,
  coupons: [{ id: 'food-new', type: '新客券', amount: 6, threshold: 0, detail: '首次模拟下单可用' }, { id: 'food-full', type: '满减券', amount: 10, threshold: 39, detail: '满39元可用' }] }

const fallbackImages = {
  rice: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&q=80',
  malatang: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&q=80',
  noodles: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&q=80',
  bbq: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=300&q=80',
}

function makeItems(restaurantId, type, names) {
  return names.map(([name, description, price, sales], index) => ({
    id: `${restaurantId}_item${index + 1}`, name, description, price,
    image: index === 0 ? `/images/products/${restaurantId}-item1-${type}.png` : fallbackImages[type],
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
]
