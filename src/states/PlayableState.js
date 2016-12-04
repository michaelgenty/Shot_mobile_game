class PlayableState extends Phaser.State {

    init() {
        this.itemsTab = [];
    }

    preload(){
        var that = this;

        this.game.add.sprite(0, 0, 'playable-bg');

        //Create clickable areas
        this.leftInput = new Phaser.Rectangle(0,this.game.height-200,160,this.game.height);
        this.centerInput = new Phaser.Rectangle(170,this.game.height-200,150,this.game.height);
        this.rightInput = new Phaser.Rectangle(330,this.game.height-200,160,this.game.height);

        this.drawRectangles(this.leftInput);
        this.drawRectangles(this.centerInput);
        this.drawRectangles(this.rightInput);

        //test if we click on part left, center or right
        this.game.input.onDown.add(function(pointer){
            if(that.leftInput.contains(pointer.x,pointer.y)){
                console.log('left input');
                that.destroyObject('left');
            } else if(that.centerInput.contains(pointer.x,pointer.y)){
                console.log('center input');
                that.destroyObject('center');
            } else if(that.rightInput.contains(pointer.x,pointer.y)){
                console.log('right input');
                that.destroyObject('right');
            }
        });
    }

    //For debug, just to see the clickable zones
    drawRectangles(rectangle){
        //  Create a graphic so we can see the bounds
        var graphics = this.game.add.graphics(rectangle.x, rectangle.y);
        graphics.beginFill(0x000077);
        graphics.drawRect(0, 0, rectangle.width, rectangle.height);
    }

    create() {
        this.timer1 = this.game.make.sprite(this.game.world.centerX, 200, 'timer-image-1');
        this.timer2 = this.game.make.sprite(this.game.world.centerX, 200, 'timer-image-2');
        this.timer3 = this.game.make.sprite(this.game.world.centerX, 200, 'timer-image-3');

       // this.launchTimer();
        this.populateTab();
    }

    //Launch a timer before the game start
    launchTimer(){
        var that = this;

        this.timerCount = 0;
        this.startTimer = setInterval(function(){

            switch(that.timerCount){
                case 1:
                    that.game.add.existing(that.timer3).scale.setTo(0.5);
                    break;
                case 2:
                    that.game.add.existing(that.timer2).scale.setTo(0.5);
                    that.timer3.destroy();
                    break;
                case 3:
                    that.game.add.existing(that.timer1).scale.setTo(0.5);
                    that.timer2.destroy();
                    break;
                case 4:
                    that.timer1.destroy();
                    clearInterval(that.startTimer);
                    that.populateTab();
                    break;
            }

            that.timerCount+=1;
        }, 1000);
    }

    //Create the first indexes with random position (left, center or right)
    populateTab(){
        var newObjectPosition;
        var randomPosition;

        for(var fill = 0; fill < 200; fill++){
            randomPosition = Math.floor(Math.random() * 3) + 1; //Range between 1 and 3 - 1: left - 2:center - 3:right

            if(randomPosition == 1){
                newObjectPosition = [1,0,0];
            } else if(randomPosition == 2){
                newObjectPosition = [0,1,0];
            } else if(randomPosition == 3){
                newObjectPosition = [0,0,1];
            }

            this.itemsTab.push(newObjectPosition);
        }

        console.log(this.itemsTab);

        this.launchParty();
    }

    launchParty(){
        var that = this;

        //Y position for created elements
        that.yPosition = 0;
        //All previous created objects
        that.previousObjects = [];

        //group for all pandas sprites
        that.pandas = this.game.add.group();
        this.lastPopulate = 20; //Populate tab objects with 20 entries

        //Create 20 entries
        for(var run = 0; run < this.lastPopulate; run++){
            this.itemsTab[run].forEach(function(element, index){

                //If the left position is set to 1 - [1,0,0]
                if(index == 0 && element == 1){
                    that.previousObjects[run] = that.pandas.create(that.game.world.centerX-220, that.game.world.height-240-that.yPosition, 'panda-image');
                    that.yPosition+=90; //Create elements at top of the others
                } else if(index == 1 && element == 1){ //Center position
                    that.previousObjects[run] = that.pandas.create(that.game.world.centerX-60, that.game.world.height-240-that.yPosition, 'panda-image');
                    that.yPosition+=90;
                } else if(index == 2 && element == 1){ //Right position
                    that.previousObjects[run] = that.pandas.create(that.game.world.centerX+100, that.game.world.height-240-that.yPosition, 'panda-image');
                    that.yPosition+=90;
                }


                //To pass above all previousObjects elements in the right order (most old to most recent)
                if(run == that.lastPopulate-1){ //If we added all elements
                    that.pandas.sort('y', Phaser.Group.SORT_ASCENDING);
                }

            });

        }
        console.log(this.itemsTab);
    }

    createElementToEnd(){

        //Move all the sprite group to bottom
        this.pandas.y+=90;

        //If there is more index elements to load
        if(this.itemsTab[this.lastPopulate]){
            //To enable if we want to crete object dynamically
            if (this.itemsTab[this.lastPopulate][0] == 1) {
                this.previousObjects.push(this.pandas.create(this.game.world.centerX - 220, this.game.world.height - 240 - this.yPosition, 'panda-image'));
            } else if (this.itemsTab[this.lastPopulate][1] == 1) {
                this.previousObjects.push(this.pandas.create(this.game.world.centerX - 60, this.game.world.height - 240 - this.yPosition, 'panda-image'));
            } else if (this.itemsTab[this.lastPopulate][2] == 1) {
                this.previousObjects.push(this.pandas.create(this.game.world.centerX + 100, this.game.world.height - 240 - this.yPosition, 'panda-image'));
            }
        }

        this.deleteElements();

        //Re-sort z-index for entire group with newly created objects
        this.pandas.sort('y', Phaser.Group.SORT_ASCENDING);
    }

    //Delete elements we tap on
    deleteElements(){
        this.itemsTab.shift(); //delete first element
        this.previousObjects[0].destroy(); //delete sprite
        this.previousObjects.shift();

        this.yPosition+=90;
    }



    //On position object click
    destroyObject(part){
        if(part == 'left' && this.itemsTab[0][0] == 1){
            console.log('destroy left');
            this.createElementToEnd();
        } else if(part == 'center' && this.itemsTab[0][1] == 1){
            console.log('destroy center');
            this.createElementToEnd();
        } else if(part == 'right' && this.itemsTab[0][2] == 1){
            console.log('destroy right');
            this.createElementToEnd();
        }
    }


}

export default PlayableState;
