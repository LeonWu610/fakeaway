const LEGACY_CATEGORY_KEYS = {
  r1: ['drink'],
  r2: ['drink'],
  r3: ['fast'],
  r4: ['fast'],
  r5: ['drink'],
  r6: ['night'],
}

const FOOD_CATEGORY_KEYS = {
  drink: ['drink'],
  fast: ['friedSnack'],
  rice: ['rice', 'noodles', 'malatang', 'snailNoodles'],
  fresh: ['japanese', 'lightMeal'],
  breakfast: ['breakfast'],
  home: ['dumplings', 'stirFry', 'nightStirFry'],
  bakery: ['bakery'],
  night: ['bbq', 'hotpot', 'snailNoodles', 'frogPot', 'seafoodGrill', 'crayfish', 'nightStirFry', 'claypotStew', 'friedSnack'],
}

export function numberFrom(value) {
  return Number.parseFloat(String(value).replace(/[^\d.]/g, '')) || 0
}

export function salesFrom(value) {
  const text = String(value || '')
  const amount = numberFrom(text)
  return text.includes('万') ? amount * 10000 : amount
}

export function restaurantText(restaurant) {
  const menuText = (restaurant.menus || [])
    .flatMap((category) => [
      category.categoryName,
      ...(category.items || []).flatMap((item) => [item.name, item.description]),
    ])
    .join(' ')

  return [
    restaurant.name,
    restaurant.description,
    restaurant.listProfile?.identity,
    menuText,
  ].filter(Boolean).join(' ').toLowerCase()
}

export function isNightRestaurant(restaurant) {
  const closeHour = Number.parseInt(restaurant.businessHours?.close?.split(':')[0], 10)
  return FOOD_CATEGORY_KEYS.night.includes(restaurant.foodCategory)
    || LEGACY_CATEGORY_KEYS[restaurant.id]?.includes('night')
    || (Number.isFinite(closeHour) && closeHour <= 5)
    || /夜宵|深夜|烤串|火锅|不打烊|营业到/.test(restaurantText(restaurant))
}

export function inRestaurantCategory(restaurant, category) {
  if (category === 'all') return restaurant.retailCategory !== 'errand'
  if (category === 'food') return restaurant.retailCategory !== 'errand'
    && (Boolean(restaurant.foodCategory) || !restaurant.retailCategory)
  if (category === 'retail') return ['market', 'fruits', 'medicine'].includes(restaurant.retailCategory)
  if (category === 'market') return restaurant.retailCategory === 'market'
  if (category === 'fruits') return restaurant.retailCategory === 'fruits'
  if (category === 'medicine') return restaurant.retailCategory === 'medicine'
  if (category === 'errand') return restaurant.retailCategory === 'errand'
  if (category === 'night') return isNightRestaurant(restaurant)

  const legacyCategories = LEGACY_CATEGORY_KEYS[restaurant.id] || []
  const foodCategories = FOOD_CATEGORY_KEYS[category] || []
  return legacyCategories.includes(category) || foodCategories.includes(restaurant.foodCategory)
}
