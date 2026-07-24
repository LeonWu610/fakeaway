import restaurants from './restaurants.json'
import retailRestaurants from './retailRestaurants.js'
import foodRestaurants from './foodRestaurants.js'
import expandedFoodRestaurants from './expandedFoodRestaurants.js'

const DEFAULT_IMAGE_BASE_URL = 'https://pub-e72b8e0a3d2b466392dbb9007970e4b7.r2.dev'
const imageBaseUrl = (import.meta.env.VITE_IMAGE_BASE_URL || DEFAULT_IMAGE_BASE_URL).replace(/\/$/, '')

function remoteImage(image) {
  if (!imageBaseUrl || typeof image !== 'string' || !image.startsWith('/images/')) return image
  return `${imageBaseUrl}${image}`
}

function withRemoteImages(restaurant) {
  return {
    ...restaurant,
    image: remoteImage(restaurant.image),
    coverImages: restaurant.coverImages?.map(remoteImage),
    menus: restaurant.menus.map((category) => ({
      ...category,
      items: category.items.map((item) => ({ ...item, image: remoteImage(item.image) })),
    })),
  }
}

export default [...restaurants, ...foodRestaurants, ...expandedFoodRestaurants, ...retailRestaurants].map(withRemoteImages)
