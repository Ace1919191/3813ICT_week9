import { Component,model} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-productfilter',
  imports: [FormsModule],
  templateUrl: './productfilter.html',
  styleUrl: './productfilter.css'
})
export class Productfilter {
  filter = model.required({
    alias:'filterCriteria'
  });
}
