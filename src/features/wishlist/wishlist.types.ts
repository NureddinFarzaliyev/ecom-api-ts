export interface IWishlist {
  _id: string;
  userId: string;
  products: string[];
}

export interface AddToWishlistBody {
  productId: string | string[];
}

export interface RemoveFromWishlistBody extends AddToWishlistBody { }
