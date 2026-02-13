import { RestaurantRepository } from '../repositories/restaurant.repository';

export class RestaurantService {
  private restaurantRepo: RestaurantRepository;

  constructor() {
    this.restaurantRepo = new RestaurantRepository();
  }

  async getAllRestaurants() {
    return this.restaurantRepo.findAll();
  }

  async getRestaurantById(id: number) {
    const restaurant = await this.restaurantRepo.findById(id);
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }
    return restaurant;
  }
}