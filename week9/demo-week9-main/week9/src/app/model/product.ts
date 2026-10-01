export class Product {
  _id?: string;
  id: number;
  name: string;
  type?: string;
  description: string;
  price: number;
  units: number;

  constructor(
    name: string,
    price: number,
    description: string = '',
    units: number = 0,
    id: number = 0,
    _id?: string
  ) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.units = units;
    this.id = id;
    this._id = _id;
  }
}