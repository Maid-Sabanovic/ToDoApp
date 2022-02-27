import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ItemListComponent } from "./item-list/item-list.component";
import { Item } from "./item.model";

@Injectable()
export class ItemService {
    //Behaviour Subject trägt den Value der mit allen Komponenten geteilt wird
    private _itemsSource = new BehaviorSubject([]);

    //Komponenten subscriben auf currentItems und bekommen dass BehaviorSubject ohne die Funktionalität den Value ändern zu können
    currentItems = this._itemsSource.asObservable();

    constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {

    }

    updateItems(items: Item[]): void {

        //Die next() Methode wird aufgerufen und das Behavior Subject bekommt einen neuen Value
        this._itemsSource.next(items);
        
      }

    fetchItems(): Item[] {
        const mock = [
            { id: 1, description: 'Test1', isComplete: false},
            { id: 2, description: 'Test2', isComplete: false},
            { id: 3, description: 'Test3', isComplete: false},
        ]

        return mock;
    }
}