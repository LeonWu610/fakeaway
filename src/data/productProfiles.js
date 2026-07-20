const NEGATIVE_PROMPT = 'logo, trademark, watermark, readable text, real person, recognizable storefront, copyrighted character, platform UI, distorted food, extra utensils'

const drinkTemperature = { id: 'temperature', name: '温度', required: true, options: [{ id: 'iced', name: '冰', priceDelta: 0, default: true }, { id: 'less_ice', name: '少冰', priceDelta: 0 }, { id: 'hot', name: '热', priceDelta: 0 }] }
const drinkSugar = { id: 'sugar', name: '糖度', required: true, options: [{ id: 'standard', name: '标准糖', priceDelta: 0, default: true }, { id: 'half', name: '半糖', priceDelta: 0 }, { id: 'light', name: '微糖', priceDelta: 0 }] }
const drinkAddons = { id: 'addons', name: '加料', multiple: true, max: 2, options: [{ id: 'jelly', name: '茶冻', priceDelta: 2 }, { id: 'boba', name: '脆啵啵', priceDelta: 2 }, { id: 'cream', name: '奶盖', priceDelta: 3 }] }
const fastFlavor = { id: 'flavor', name: '口味', required: true, options: [{ id: 'classic', name: '经典原味', priceDelta: 0, default: true }, { id: 'spicy', name: '香辣风味', priceDelta: 1 }] }
const FAST_COMBOS = {
  r3: { snack: '海盐脆薯条', drink: '冰柠气泡可乐' },
  r4: { snack: '香甜玉米杯', drink: '冰柠乌梅气泡饮' },
}

function fastComboFor(restaurant) {
  const pairing = FAST_COMBOS[restaurant.id] || { snack: '椒盐薯角', drink: '清爽柠檬气泡饮' }
  return {
    id: 'combo', name: '搭配', required: true,
    options: [
      { id: 'single', name: '单品', priceDelta: 0, default: true },
      { id: 'snack', name: `配${pairing.snack}`, priceDelta: 6 },
      { id: 'full', name: `${pairing.snack}+${pairing.drink}`, priceDelta: 10 },
    ],
  }
}
const hotpotSpicy = { id: 'spicy', name: '辣度', required: true, options: [{ id: 'mild', name: '微辣', priceDelta: 0, default: true }, { id: 'medium', name: '中辣', priceDelta: 0 }, { id: 'hot', name: '重辣', priceDelta: 0 }] }
const ricePortion = { id: 'portion', name: '饭量', required: true, options: [{ id: 'regular', name: '标准饭量', priceDelta: 0, default: true }, { id: 'less', name: '少饭', priceDelta: 0 }, { id: 'extra', name: '加饭', priceDelta: 2 }] }
const noodleStyle = { id: 'noodle-style', name: '面条口感', required: true, options: [{ id: 'firm', name: '偏硬筋道', priceDelta: 0 }, { id: 'regular', name: '标准口感', priceDelta: 0, default: true }, { id: 'soft', name: '偏软', priceDelta: 0 }] }
const bbqSeasoning = { id: 'seasoning', name: '烧烤口味', required: true, options: [{ id: 'classic', name: '孜然香辣', priceDelta: 0, default: true }, { id: 'mild', name: '少辣少孜然', priceDelta: 0 }, { id: 'dry', name: '干香重孜然', priceDelta: 0 }] }
const japaneseCondiments = { id: 'condiments', name: '佐料', required: true, options: [{ id: 'standard', name: '芥末酱油', priceDelta: 0, default: true }, { id: 'soy-only', name: '仅酱油', priceDelta: 0 }, { id: 'none', name: '不需要佐料', priceDelta: 0 }] }
const lightMealStaple = { id: 'staple', name: '主食', required: true, options: [{ id: 'mixed-grain', name: '杂粮饭', priceDelta: 0, default: true }, { id: 'quinoa', name: '藜麦加量', priceDelta: 3 }, { id: 'no-staple', name: '不要主食', priceDelta: 0 }] }
const lightMealSauce = { id: 'sauce', name: '酱汁', required: true, options: [{ id: 'vinaigrette', name: '油醋汁', priceDelta: 0, default: true }, { id: 'sesame', name: '焙煎芝麻汁', priceDelta: 1 }, { id: 'none', name: '不要酱汁', priceDelta: 0 }] }
const breakfastPortion = { id: 'portion', name: '份量', required: true, options: [{ id: 'regular', name: '标准份', priceDelta: 0, default: true }, { id: 'large', name: '加量大碗', priceDelta: 3 }] }
const dumplingMethod = { id: 'method', name: '做法', required: true, options: [{ id: 'boiled', name: '水煮', priceDelta: 0, default: true }, { id: 'pan-fried', name: '香煎', priceDelta: 2 }, { id: 'sour-soup', name: '酸汤', priceDelta: 3 }] }
const dumplingCondiments = { id: 'condiments', name: '蘸料', required: true, options: [{ id: 'vinegar', name: '蒜醋汁', priceDelta: 0, default: true }, { id: 'chili', name: '红油蘸料', priceDelta: 0 }, { id: 'none', name: '不需要蘸料', priceDelta: 0 }] }
const stirFryStaple = { id: 'staple', name: '主食', required: true, options: [{ id: 'none', name: '单点菜品', priceDelta: 0, default: true }, { id: 'rice', name: '配一份米饭', priceDelta: 3 }, { id: 'double-rice', name: '配两份米饭', priceDelta: 6 }] }
const bakeryHeating = { id: 'heating', name: '食用方式', required: true, options: [{ id: 'room', name: '常温', priceDelta: 0, default: true }, { id: 'warm', name: '加热', priceDelta: 0 }] }
const bakeryPackaging = { id: 'packaging', name: '包装', required: true, options: [{ id: 'standard', name: '独立纸袋', priceDelta: 0, default: true }, { id: 'gift', name: '分享礼盒', priceDelta: 5 }] }
const errandDistance = { id: 'distance', name: '服务范围', required: true, options: [{ id: 'nearby', name: '2公里内', priceDelta: 0, default: true }, { id: 'medium', name: '2-5公里', priceDelta: 6 }, { id: 'far', name: '5-8公里', priceDelta: 12 }] }
const errandSize = { id: 'item-size', name: '物品大小', required: true, options: [{ id: 'small', name: '随身小件', priceDelta: 0, default: true }, { id: 'medium', name: '手提袋大小', priceDelta: 3 }, { id: 'large', name: '较大件', priceDelta: 8 }] }
const errandHandling = { id: 'handling', name: '服务要求', multiple: true, max: 2, options: [{ id: 'call', name: '取到后联系', priceDelta: 0 }, { id: 'photo', name: '模拟拍照确认', priceDelta: 0 }, { id: 'careful', name: '轻拿轻放', priceDelta: 2 }] }

function includesAny(text, words) {
  return words.some((word) => text.includes(word))
}

function classifyProduct(item, restaurant, categoryName) {
  if (restaurant.retailCategory === 'errand') return 'errand'
  if (restaurant.retailCategory) return 'retail'
  if (restaurant.foodCategory) return restaurant.foodCategory
  const text = `${item.name} ${item.description || ''} ${categoryName}`
  if (includesAny(text, ['茶', '咖啡', '拿铁', '奶', '果', '葡萄', '红柚', '青提', '桃桃', '暖饮', '特调', '杯'])) return 'drink'
  if (restaurant.archetype === 'late-night-story') return 'coffee'
  if (restaurant.archetype === 'chain-campaign' || restaurant.archetype === 'specialty-menu') return 'drink'
  if (restaurant.archetype === 'instant-retail' || restaurant.archetype === 'neighborhood-kitchen') return 'fast-food'
  return 'hotpot'
}

function profileFor(type, restaurant) {
  if (type === 'errand') {
    return {
      unit: '单', ingredients: ['模拟服务范围', '取送事项说明'], allergens: [], specGroups: [errandDistance, errandSize, errandHandling], estimatedPrepMinutes: 3,
      availabilitySchedule: { label: '可发布委托', start: restaurant.businessHours?.open || '07:00', end: restaurant.businessHours?.close || '23:30' },
      imageSubject: '一位不露脸的原创跑腿员携带素色配送袋，表现高效同城取送服务',
    }
  }
  if (type === 'retail') {
    return {
      unit: '件', ingredients: ['商品原包装信息见详情'], allergens: [], specGroups: [], estimatedPrepMinutes: 4,
      availabilitySchedule: { label: '库存可售', start: restaurant.businessHours?.open || '00:00', end: restaurant.businessHours?.close || '24:00' },
      imageSubject: '一个包装干净、无品牌文字的原创即时零售商品',
    }
  }
  if (type === 'drink' || type === 'coffee') {
    return {
      unit: '杯', ingredients: type === 'coffee' ? ['咖啡液', '鲜奶或植物乳', '风味基底'] : ['现萃茶汤', '鲜果或风味原料', '乳制品'],
      allergens: ['乳及乳制品'], specGroups: [drinkTemperature, drinkSugar, drinkAddons], estimatedPrepMinutes: 6,
      availabilitySchedule: { label: '全天供应', start: restaurant.businessHours?.open || '10:00', end: restaurant.businessHours?.close || '23:00' },
      imageSubject: type === 'coffee' ? '一杯层次清晰的原创咖啡饮品' : '一杯色彩自然、配料清晰的原创茶饮',
    }
  }
  if (type === 'rice') {
    return {
      unit: '份', ingredients: ['米饭', '现制肉类或蔬菜', '自调酱汁'], allergens: ['大豆及豆制品'], specGroups: [ricePortion], estimatedPrepMinutes: 16,
      availabilitySchedule: { label: '午晚餐供应', start: restaurant.businessHours?.open || '10:30', end: restaurant.businessHours?.close || '21:30' }, imageSubject: '一份米粒清晰、主料丰盛的原创中式米饭套餐',
    }
  }
  if (type === 'malatang') {
    return {
      unit: '份', ingredients: ['牛肉或豆制品', '新鲜蔬菜', '自制汤底'], allergens: ['大豆及豆制品'], specGroups: [hotpotSpicy], estimatedPrepMinutes: 14,
      availabilitySchedule: { label: '全天热卖', start: restaurant.businessHours?.open || '10:00', end: restaurant.businessHours?.close || '23:30' }, imageSubject: '一碗汤底浓郁、荤素层次丰富的原创麻辣烫或冒菜',
    }
  }
  if (type === 'noodles') {
    return {
      unit: '碗', ingredients: ['现煮面条或米粉', '高汤', '现制浇头'], allergens: ['麸质谷物', '大豆'], specGroups: [noodleStyle, hotpotSpicy], estimatedPrepMinutes: 11,
      availabilitySchedule: { label: '现点现煮', start: restaurant.businessHours?.open || '09:00', end: restaurant.businessHours?.close || '22:30' }, imageSubject: '一碗面条筋道、浇头清晰、热气自然的原创面食',
    }
  }
  if (type === 'bbq') {
    return {
      unit: '份', ingredients: ['新鲜肉类或蔬菜', '孜然', '烧烤调味料'], allergens: ['芝麻'], specGroups: [bbqSeasoning], estimatedPrepMinutes: 18,
      availabilitySchedule: { label: '晚市供应', start: restaurant.businessHours?.open || '17:00', end: restaurant.businessHours?.close || '02:00' }, imageSubject: '一份炭火焦香、油脂光泽真实的原创烧烤或烤串',
    }
  }
  if (type === 'japanese') {
    return {
      unit: '份', ingredients: ['寿司米或米饭', '现制鱼料或肉类', '海苔与配菜'], allergens: ['鱼类', '甲壳类', '大豆'], specGroups: [japaneseCondiments], estimatedPrepMinutes: 15,
      availabilitySchedule: { label: '现点现做', start: restaurant.businessHours?.open || '10:30', end: restaurant.businessHours?.close || '22:30' }, imageSubject: '一份鱼料纹理自然、醋饭颗粒清晰的原创日料或寿司',
    }
  }
  if (type === 'lightMeal') {
    return {
      unit: '份', ingredients: ['现烤蛋白', '新鲜蔬菜', '谷物主食'], allergens: ['蛋类', '大豆', '芝麻'], specGroups: [lightMealStaple, lightMealSauce], estimatedPrepMinutes: 12,
      availabilitySchedule: { label: '全天轻食', start: restaurant.businessHours?.open || '08:30', end: restaurant.businessHours?.close || '21:00' }, imageSubject: '一碗蛋白、谷物和蔬菜搭配清晰的原创轻食能量碗',
    }
  }
  if (type === 'breakfast') {
    return {
      unit: '份', ingredients: ['现熬米粥或现蒸面点', '鸡蛋或肉类', '清爽配菜'], allergens: ['麸质谷物', '蛋类', '大豆'], specGroups: [breakfastPortion], estimatedPrepMinutes: 8,
      availabilitySchedule: { label: '早餐午市供应', start: restaurant.businessHours?.open || '06:30', end: restaurant.businessHours?.close || '14:30' }, imageSubject: '一份热气自然、米粥绵密或面点松软的原创中式早餐',
    }
  }
  if (type === 'dumplings') {
    return {
      unit: '份', ingredients: ['手工面皮', '现拌肉类或蔬菜馅', '自制蘸料'], allergens: ['麸质谷物', '大豆', '蛋类'], specGroups: [dumplingMethod, dumplingCondiments], estimatedPrepMinutes: 13,
      availabilitySchedule: { label: '现包现煮', start: restaurant.businessHours?.open || '09:30', end: restaurant.businessHours?.close || '22:00' }, imageSubject: '一份面皮薄润、馅料自然的原创手工水饺或锅贴',
    }
  }
  if (type === 'stirFry') {
    return {
      unit: '份', ingredients: ['新鲜肉类或蔬菜', '家常调味料', '现炒酱汁'], allergens: ['大豆', '花生'], specGroups: [hotpotSpicy, stirFryStaple], estimatedPrepMinutes: 14,
      availabilitySchedule: { label: '午晚餐现炒', start: restaurant.businessHours?.open || '10:30', end: restaurant.businessHours?.close || '21:30' }, imageSubject: '一份锅气自然、食材熟度清晰的原创中式家常小炒',
    }
  }
  if (type === 'bakery') {
    return {
      unit: '个', ingredients: ['小麦粉', '黄油或植物油', '鸡蛋与风味馅料'], allergens: ['麸质谷物', '蛋类', '乳及乳制品'], specGroups: [bakeryHeating, bakeryPackaging], estimatedPrepMinutes: 5,
      availabilitySchedule: { label: '当日现烤', start: restaurant.businessHours?.open || '07:30', end: restaurant.businessHours?.close || '21:30' }, imageSubject: '一份表面金黄、层次自然的原创面包或烘焙甜点',
    }
  }
  if (type === 'fast-food') {
    return {
      unit: '份', ingredients: ['谷物或面包胚', '现制主料', '调味酱料'], allergens: ['麸质谷物', '蛋类', '大豆'], specGroups: [fastFlavor, fastComboFor(restaurant)], estimatedPrepMinutes: 12,
      availabilitySchedule: { label: '正餐时段供应', start: '10:30', end: '22:30' }, imageSubject: '一份热气自然、层次清晰的原创快餐单品',
    }
  }
  return {
    unit: '份', ingredients: ['新鲜蔬菜', '豆制品或肉类', '原创汤底'], allergens: ['大豆及豆制品'], specGroups: [hotpotSpicy], estimatedPrepMinutes: 18,
    availabilitySchedule: { label: '午晚餐供应', start: '11:00', end: restaurant.businessHours?.close || '02:00' }, imageSubject: '一份热气腾腾、食材丰富的原创锅物或夜宵',
  }
}

export function enrichProduct(item, restaurant, categoryName) {
  const type = classifyProduct(item, restaurant, categoryName)
  const defaults = profileFor(type, restaurant)
  return {
    ...defaults,
    popularityLabel: item.isRecommended ? '熟客回购' : item.isHot ? '本店热销' : '稳定供应',
    tags: [item.isHot && '热销', item.isRecommended && '推荐', defaults.availabilitySchedule.label].filter(Boolean),
    addons: defaults.specGroups.find((group) => group.multiple)?.options || [],
    packingFee: 0,
    stockStatus: 'in-stock',
    ...item,
    specGroups: item.specGroups || defaults.specGroups,
    ingredients: item.ingredients || defaults.ingredients,
    allergens: item.allergens || defaults.allergens,
    availabilitySchedule: item.availabilitySchedule || defaults.availabilitySchedule,
    imagePrompt: item.imagePrompt || {
      purpose: 'product-main',
      prompt: `原创虚构外卖商品或服务「${item.name}」，${defaults.imageSubject}，45度近景主体居中，柔和自然光，符合「${restaurant.name}」的原创配色，真实商业摄影质感但不包含任何文字、商标、真实人物或可识别门店，1:1`,
      negativePrompt: NEGATIVE_PROMPT,
      stylePreset: 'realistic-food-editorial', aspectRatio: '1:1', reviewStatus: 'draft', rightsNotes: '原创虚构商品；生成后人工检查文字、商标、人物与食物畸变',
    },
  }
}
