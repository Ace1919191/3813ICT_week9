import { Component ,signal,computed} from '@angular/core';
import { Productfilter } from '../productfilter/productfilter';
import { Productlist } from '../productlist/productlist';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-products',
  imports: [Productfilter, FormsModule, Productlist],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products {
  title = signal("Products");
  listFilter = signal('');
  //filterLength = computed(() => this.listFilter().length);

 
}
