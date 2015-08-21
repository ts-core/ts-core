/// <reference path="../../tscore.d.ts" />

module TSCore.Geometry {

    export class Size {

        public width:number;
        public height:number;

        constructor(width:number=0, height:number=0) {

            this.width = width;
            this.height = height;
        }
    }
}