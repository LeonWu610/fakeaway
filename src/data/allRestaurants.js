import restaurants from './restaurants.json'
import retailRestaurants from './retailRestaurants.js'
import foodRestaurants from './foodRestaurants.js'

export default [...restaurants, ...foodRestaurants, ...retailRestaurants]
