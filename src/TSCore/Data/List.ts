module TSCore.Data {

    export class List<T> {

        protected _data:T[];
        public events: TSCore.Events.EventEmitter = new TSCore.Events.EventEmitter();

        constructor(data?:T[]){
            this._data = data || [];
        }

        /**
         * Get length of List. (same as method count)
         *
         * @returns {number}
         */
        public get length():number {
            return this.count();
        }

        /**
         * Get count of List. (same as property length)
         *
         * @returns {number}
         */
        public count(): number {
            return this._data.length;
        }

        /**
         * Add (push) item to List.
         *
         * @param item Item to be added.
         */
        public add(item:T) {

            this._data.push(item);

            this.events.trigger(TSCore.Data.List.Events.ADD, { items: [item] });
            this.events.trigger(TSCore.Data.List.Events.CHANGE);
        }

        /**
         * Add multiple (concat) items to List.
         *
         * @param items Items to be added.
         */
        public addMany(items:T[] = []) {

            this._data = this._data.concat(items);

            this.events.trigger(TSCore.Data.List.Events.ADD, { items: items });
            this.events.trigger(TSCore.Data.List.Events.CHANGE);
        }

        /**
         * Prepend item to list.
         *
         * @param item  Item to be inserted.
         */
        public prepend(item:T) {
            this.insert(item, 0);
        }

        /**
         * Prepend multiple items to list.
         *
         * @param items Items to be inserted
         */
        public prependMany(items:T[]) {

            this._data = items.concat(this._data);

            this.events.trigger(TSCore.Data.List.Events.ADD, { items: items });
            this.events.trigger(TSCore.Data.List.Events.CHANGE);
        }

        /**
         * Insert an item at a certain index.
         *
         * @param item  Item to be inserted.
         * @param index Index to insert item at.
         */
        public insert(item:T, index:number){

            this._data.splice(index, 0, item);

            this.events.trigger(TSCore.Data.List.Events.ADD, { items: [item] });
            this.events.trigger(TSCore.Data.List.Events.CHANGE);
        }

        /**
         * Remove item from List.
         *
         * @param item Item to be removed.
         */
        public remove(item: T) {

            this._data = _.without(this._data, item);

            this.events.trigger(TSCore.Data.List.Events.REMOVE, { items: [item] });
            this.events.trigger(TSCore.Data.List.Events.CHANGE);
        }

        /**
         * Remove multiple items from List.
         *
         * @param items Items to be removed.
         */
        public removeMany(items: T[]) {

            this._data = _.difference(this._data, items);

            this.events.trigger(TSCore.Data.List.Events.REMOVE, { items: items });
            this.events.trigger(TSCore.Data.List.Events.CHANGE);
        }

        /**
         * Remove items using properties.
         *
         * @param properties    Object containing key-value pairs.
         */
        public removeWhere(properties: any) {
            this.removeMany(this.where(properties));
        }

        /**
         * Replace an item with another item.
         *
         * @param source        The item that gets replaced inside the list.
         * @param replacement   The item that replaces the source item.
         * @returns {T}
         */
        public replaceItem(source:T, replacement:T): T {
            return this.replace(this.indexOf(source), replacement);
        }

        /**
         * Replace an item at a certain index.
         *
         * @param index         Index of the item that gets replaced.
         * @param replacement   The item the replaces the source item.
         * @returns {any}
         */
        public replace(index:number, replacement:T): T {

            if(index < 0 || index >= this.count()){
                return null;
            }

            var currentItem = this._data[index];
            this._data[index] = replacement;

            this.events.trigger(TSCore.Data.List.Events.REPLACE, { source: currentItem, replacement: replacement });
            this.events.trigger(TSCore.Data.List.Events.CHANGE);

            return currentItem;
        }

        /**
         * Clears the List.
         */
        public clear() {

            this._data = [];

            this.events.trigger(TSCore.Data.List.Events.REMOVE, { items: this.toArray() });
            this.events.trigger(TSCore.Data.List.Events.CLEAR);
            this.events.trigger(TSCore.Data.List.Events.CHANGE);
        }

        /**
         * Iterates over all item in List, yielding each in turn to an iteratee function.
         *
         * @param iterator Iteratee function.
         */
        public each(iterator:_.ListIterator<T, void>){
            _.each(this._data, iterator);
        }

        /**
         * A convenient version of what is perhaps the most common use-case for map:
         * extracting a list of property values.
         *
         * @param propertyName Property name to pluck.
         * @returns {any[]}
         */
        public pluck(propertyName:string) : any[] {
            return _.pluck(this._data, propertyName);
        }

        /**
         * Check whether the List is empty.
         *
         * @returns {boolean}
         */
        public isEmpty(): boolean {
            return this.count() === 0;
        }

        /**
         * Get the first item from list.
         *
         * @returns {T}
         */
        public first(): T {
            return _.first(this._data);
        }

        /**
         * Get the last item from list.
         * @returns {T}
         */
        public last(): T {
            return _.last(this._data);
        }

        /**
         * Get an item at a specified index in list.
         *
         * @param index Index of the item to be returned.
         * @returns {T}
         */
        public get(index:number): T {
            return this._data[index];
        }

        /**
         * Get the index of an item in list.
         *
         * @param item Item to return index for.
         * @returns {number}
         */
        public indexOf(item:T): number {
            return _.indexOf(this._data, item);
        }

        /**
         * Sort list.
         *
         * @returns {void}
         */
        public sort(sortPredicate: any): void {

            this._data = _.sortBy(this._data, sortPredicate);

            this.events.trigger(TSCore.Data.List.Events.CHANGE);
        }

        /**
         * Find items using an optional iterator.
         *
         * @param iterator Iterator to use.
         * @returns {T[]}
         */
        public find(iterator?:_.ListIterator<T, boolean>): T[] {
            return _.filter(this._data, iterator);
        }

        /**
         * Find first item using an iterator.
         *
         * @param iterator
         * @returns {T}
         */
        public findFirst(iterator?:_.ListIterator<T, boolean>): T {
            return _.find(this._data, iterator);
        }

        /**
         * Looks through each value in the list, returning an array of all the values that contain all
         * of the key-value pairs listed in properties.
         *
         * ````js
         * list.where({author: "Shakespeare", year: 1611});
         *     => [{title: "Cymbeline", author: "Shakespeare", year: 1611},
         *         {title: "The Tempest", author: "Shakespeare", year: 1611}]
         * ````
         * @param properties Object containing key-value pairs.
         * @returns {T[]}
         */
        public where(properties:{}): T[] {
            return _.where(this._data, properties);
        }

        /**
         * Looks through the list and returns the first value that matches all of the key-value pairs
         * listed in properties.
         *
         * @param properties Object containing key-value pairs.
         * @returns {T}
         */
        public whereFirst(properties:{}): T {
            return _.findWhere(this._data, properties);
        }

        /**
         * Check if List contains item.
         *
         * @param item Item to check against.
         * @returns {boolean}
         */
        public contains(item:T): boolean {
            return _.contains(this._data, item);
        }

        /**
         * Convert List to array.
         *
         * @returns {any[]}
         */
        public toArray():T[] {
            return _.clone(this._data);
        }
    }

    export module List.Events {

        export const ADD:string = "add";
        export const CHANGE:string = "change";
        export const REMOVE:string = "remove";
        export const REPLACE:string = "replace";
        export const CLEAR:string = "clear";

        export interface IChangeParams<T> {}
        export interface IClearParams<T> {}

        export interface IAddParams<T> {
            items: T[]
        }

        export interface IRemoveParams<T> {
            items: T[]
        }

        export interface IReplaceParams<T> {
            source: T,
            replacement: T
        }
    }
}