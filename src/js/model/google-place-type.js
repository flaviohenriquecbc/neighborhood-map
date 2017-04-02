/**
 * Represents the type on google places
 */
export default class GooglePlaceType {
    constructor(data) {
        this.type = ko.observable(data);
        this.name = ko.observable(this.formatName(data));
    }

    /**
     * Transform the google place type in a readable name. For example:
     * electronics_store becomes Electronics Store
     * @param {string} name 
     */
    formatName(name){
        return name.split('_').map((word) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()).join(' ');
    }
}