const sentences = [
	"type this sentence to start",
	"great now keep typing",
	"save all the people",
	"the city is being evacuated right now",
	"so each keystroke is saving lives",

	"oh we have zome kommuncation ichues",
	"can yu styll haer us",
	"ze bomb iz cosyng interrrfrances",
	"kip tyipng ur diong a good zob",
	"yuo svaed allmoost eevrinoe",

	"quysd skjlij qsiap apzokh z",
	"faondzakjazhedluyedanljlcquef lol",
	"- you are not supposed to see this -",
	" - are you a hacker? - "
];


Game.Play = function (game) { };

Game.Play.prototype = {

	create: function () {
		this.key = this.game.input.keyboard;

		this.city = this.game.add.sprite(w/2, h-55, 'city');
    	this.city.anchor.setTo(0.5, 1);

		this.bomb = this.game.add.sprite(w/2, -40, 'bomb');
    	this.bomb.anchor.setTo(0.5, 0.5);

		this.i = 0;
		this.level = 0;
		this.dead = false;
		this.score = 0;
		this.group_text = game.add.group();
		this.keyReset = false;

		this.fire_s = game.add.audio("fire");
		this.exp_s = game.add.audio("exp");
		this.hit_s = game.add.audio("hit");

		this.tuto = game.add.text(w/2, h/2-80, "use your keyboad\nto type the sentence below", { font: "25px Courier", fill: "#fff", align: "center" });
		this.tuto.anchor.setTo(0.5, 0.5);

		this.draw_sentence();
	},

	update: function() {
		//THIS IS THE GAME LOOP WHICH MAKES SURE THE GAME RUNS
		if (this.dead)
			return;

		if (this.level == 1 && this.i == 1)
			game.add.tween(this.tuto).to({alpha:0}, 500).start();

		if (this.s[this.i] == " ")
			this.i += 1;

		var letter = this.s.charCodeAt(this.i);

		if (this.key.isDown(letter-32) && !this.keyReset) {
			this.keyReset = true;
			this.fire_letter(this.i);
			this.i += 1;
			this.score += 5;
		}
		else if (!this.key.isDown(letter-32))
			this.keyReset = false;


		if (this.i == this.s.length) {
			this.i = 0;
			this.draw_sentence();
		}

		this.group_text.forEachAlive(function(e){
			if (e.y+20 < 0) {
				e.alpha = 0;
				e.alive = false;				
			}
			else if (e.alpha > 0 && e.y+20 < this.bomb.bottomLeft.y) {
				this.hit_s.play('', 0, 0.2, false);
				e.alpha = 0;
				e.alive = false;
				game.add.tween(this.bomb).to({y:"-20"}, 50).start();
			}
		},this);

		if (this.bomb.y > h-115)
			this.end();
	},

	fire_letter: function() {
		this.fire_s.play('', 0, 0.2, false);
		var length = h-this.bomb.y;
		game.add.tween(this.text[this.i]).to({y:this.bomb.y-20, x:w/2}, length*3).start();
	},

	draw_sentence: function() {
		this.text = [];
		//We go trough the levels here
		this.s = sentences[this.level];

		for (var i = 0; i < this.s.length; i++) 
			if (this.s[i] != " ") {
				var offset = (w-(this.s.length*13))/2 + i*13;
				this.text[i] = game.add.text(offset, h-40, this.s[i], { font: "20px Courier", fill: "#fff" });
				this.text[i].alpha = 0;
				game.add.tween(this.text[i]).delay(i*20).to({alpha:1}, 200).start();
				this.group_text.add(this.text[i]);
			}
		//Increments level
		this.level += 1;

		if (this.level == 2)
			this.bomb.body.velocity.y = 90;
	},

	end: function() {
		game.stage.backgroundColor = "#FF0000";
		this.exp_s.play('', 0, 0.3, false);
		this.dead = true;
		this.bomb.kill();

		this.group_text.forEachAlive(function(e){e.alpha=0;e.alive = false;},this);

		var exp = this.game.add.sprite(w/2, h-55, 'explosion');
    	exp.anchor.setTo(0.5, 1);
    	exp.scale.setTo(0.3, 0.3);

    	const t = game.add.tween(exp.scale).to({x:1, y: 1}, 500).start();
    	t.onComplete.add(this.animation_ended, this);
    	game.add.tween(exp).delay(1500).to({alpha:0}, 2000).start();

    	var grp = game.add.group();
    	grp.add(exp);
    	grp.add(this.city);
    	this.shake_effect(grp);
	},

	shake_effect: function(g) {
		var move = 25;
		var time = 50;

		game.add.tween(g)
			.to({y:"-"+move}, time).to({y:"+"+move*2}, time*2).to({y:"-"+move}, time)
			.to({y:"-"+move}, time).to({y:"+"+move*2}, time*2).to({y:"-"+move}, time)
			.to({y:"-"+move/2}, time).to({y:"+"+move}, time*2).to({y:"-"+move/2}, time)
			.start();	
	},

	animation_ended: function() {
		
		this.city.frame = 1;


		var dead = game.add.text(w/2, 100, "the city is gone. you saved " + this.score + " lives", { font: "18px Courier", fill: "#fff" });
		dead.anchor.setTo(0.5, 0);
		dead.alpha = 0;
		game.add.tween(dead).delay(1000).to({alpha:1}, 1000).start();
		
		var restart = this.game.add.button(w/2, 200, 'restart', this.restart, this);
		restart.anchor.setTo(0.5, 0.5);
		restart.alpha = 0;
		game.add.tween(restart).delay(2000).to({alpha:1}, 1000).start();		
	},

	restart: function() {
		this.game.state.start('Play');
		game.stage.backgroundColor = '#D7A9E3FF';
	}
};
