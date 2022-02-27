import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { Subscription } from 'rxjs';
import { Item } from '../item.model';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {

  //Zum Löschen eines Items wichtig
  currentItems = [];

  //Zum Anzeigen der Details im HTML File
  item: Item;

  //Zum Speichern der params[id]
  id: number;

  //Eventuell unnötig da kein unsubscibe() nötig ist, der observer macht es automatisch
  subscription: Subscription = new Subscription;

  //Zum Löschen eines Items wichtig 
  index: number;

  constructor(private itemService: ItemService, private route: ActivatedRoute, private router: Router, private ngxBootstrapConfirmService: NgxBootstrapConfirmService) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.subscription = this.itemService.currentItems.subscribe((items) => {
          this.currentItems = items;
          this.item = items.find(specificItem => specificItem.id === this.id);
          console.log(this.subscription);
        });
      }
    );
  }

  onEditItem(): void {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteItem() {
    let options = {
      title: 'Are you sure you want to delete this Item?',
      confirmLabel: 'Yes',
      declineLabel: 'No'
    }
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        this.index = this.currentItems.findIndex((specificItem => specificItem.id === this.id));
        this.currentItems.splice(this.index, 1)
        this.itemService.updateItems(this.currentItems);
        this.router.navigate([''], { relativeTo: this.route });
      } else {
      }
    });
  }

}
