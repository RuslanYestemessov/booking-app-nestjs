export interface CottageInterface {
  description: string;
  photos: Array<string>;
  guests: number;
}

export interface UpdateCottageDto extends Partial<CottageInterface> {
  bookedByUser: number;
  bookingExpired: number;
}
