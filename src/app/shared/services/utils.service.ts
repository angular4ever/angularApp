import { Injectable } from "@angular/core";

@Injectable()
export class UtilsService {

	constructor() {
	}

	getElementIndexByKey(array: any, property: string, key: string): any {
		for (let i = 0; i < array.length; i++) {
			if (array[i][property] === key) {
				return i;
			}
		}
	}

	getArrayWithValues(numberOfValues: number): Array<object> {
		const array = [];
		for (let i = 0; i < numberOfValues; i++) {
			array[i] = {
				value: i + 1
			};
		}
		return array;
	}
}
