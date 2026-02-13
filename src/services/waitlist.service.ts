import { WaitlistRepository } from '../repositories/waitlist.repository';
import { DateTimeUtil } from '../utils/dateTime';

interface JoinWaitlistData {
  restaurantId: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  requestedDate: Date;
  requestedTime: string;
  guestCount: number;
}

export class WaitlistService {
  private waitlistRepo: WaitlistRepository;

  constructor() {
    this.waitlistRepo = new WaitlistRepository();
  }

  async joinWaitlist(data: JoinWaitlistData) {
    // Check if date is in the past
    if (DateTimeUtil.isDateInPast(data.requestedDate)) {
      throw new Error('Cannot join waitlist for past dates');
    }

    // Add to waitlist
    const entry = await this.waitlistRepo.create(data);

    // Get position in queue
    const position = await this.waitlistRepo.getPosition(entry.id);

    return {
      message: 'Added to waitlist successfully',
      waitlistEntry: entry,
      position,
    };
  }

  async getWaitlistStatus(id: number) {
    const entry = await this.waitlistRepo.findById(id);
    if (!entry) {
      throw new Error('Waitlist entry not found');
    }

    const position = await this.waitlistRepo.getPosition(id);

    return {
      entry,
      position,
    };
  }
}