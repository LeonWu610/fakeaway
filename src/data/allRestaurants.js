import restaurants from './restaurants.json'
import retailRestaurants from './retailRestaurants.js'
import foodRestaurants from './foodRestaurants.js'

const imageBaseUrl = (import.meta.env.VITE_IMAGE_BASE_URL || '').replace(/\/$/, '')

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

export default [...restaurants, ...foodRestaurants, ...retailRestaurants].map(withRemoteImages)
