import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Event, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Item } from '../item.model';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-item-add',
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.css']
})
export class ItemAddComponent implements OnInit {

  currentItems = [];
  id: number = 0;
  subscription: Subscription = new Subscription;
  editMode = false;
  itemForm: FormGroup;
  index: number;


  constructor(private itemService: ItemService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.subscription = this.itemService.currentItems.subscribe((items) => {
      this.currentItems = items;
    });
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    );
  }

  onSubmit() {
    if (this.editMode) {
      this.updateItem(this.itemForm.value);
    } else {
      this.addItem();
    }
    this.onCancel();
  }

  onCancel() {
    this.router.navigate([''], { relativeTo: this.route });
  }

  addItem() {
    this.itemForm.value.id = this.currentItems.length+1;
    this.currentItems.push(this.itemForm.value);
    this.itemService.updateItems(this.currentItems);
  }

  updateItem(item: Item) {
    
    this.index = this.currentItems.findIndex((specificItem => specificItem.id === this.id));
    this.currentItems[this.index] = item;
    this.itemService.updateItems(this.currentItems);

  }

  ngOnDestroy() {
    
    //Unnötig, denn das passiert automatisch und hat keinen Einfluss auf das Verhalten der App
    this.subscription.unsubscribe();

  }

  private initForm() {
    let itemId;
    let itemDescription;
    let itemIsComplete;

    if (this.editMode) {

      const item = this.currentItems.find(specificItem => specificItem.id === this.id);
      itemId = item.id;
      itemDescription = item.description;
      itemIsComplete = item.isComplete;

    } else {
      itemId = itemId;
      itemDescription = '';
      itemIsComplete = false;
    }

    this.itemForm = new FormGroup({
      id: new FormControl(itemId, Validators.required),
      description: new FormControl(itemDescription, Validators.required),
      isComplete: new FormControl(itemIsComplete, Validators.required)
    });
  }
}
