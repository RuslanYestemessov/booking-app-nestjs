export interface CottageInterface {
  description: string;
  photos: Array<string>;
}

export interface UpdateCottageDto extends CottageInterface {
  bookedByUser: number;
  bookingExpired: number;
}
