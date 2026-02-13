import { Request, Response } from 'express';
import { RestaurantService } from '../../services/restaurant.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { SUCCESS_MESSAGES } from '../../constants/message';

export class RestaurantController {
  private restaurantService: RestaurantService;

  constructor() {
    this.restaurantService = new RestaurantService();
  }

  getAllRestaurants = asyncHandler(async (req: Request, res: Response) => {
    const restaurants = await this.restaurantService.getAllRestaurants();

    res.status(200).json({
      success: true,
      message: SUCCESS_MESSAGES.RESTAURANT_FETCHED,
      data: restaurants,
    });
  });

  getRestaurantById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const restaurant = await this.restaurantService.getRestaurantById(Number(id));

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  });
}