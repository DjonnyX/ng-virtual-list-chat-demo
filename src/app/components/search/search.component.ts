import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  search = output<string>();

  searchText = '';

  onSearchHandler() {
    this.search.emit(this.searchText);
  }
}
