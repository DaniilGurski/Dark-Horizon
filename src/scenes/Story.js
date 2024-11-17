import { Scene } from 'phaser';

export class Story extends Scene
{
    constructor ()
    {
        super('Story');

        this.lines = [
            "First Line.",
            "Second Line.",
            "Third Line.",
        ];

        this.currentLine;
        this.fadingDot;
        this.progress = 0;
        this.cursor;
        this.typingSound;
        this.controlsEnabled = true;

        this.currentLineStyles = {
            fontSize: '1.5rem',
            color: '#ffffff',
            // wordWrap: { width: 800 }
        }
    }


    typeNextLine() {
        const newLine = this.lines[this.progress];
        let charIndex = 0;
        let displayText = "";
        
        this.controlsEnabled = false;

        // Erase previous line
        this.currentLine.setText("");
        this.typingSound.play();

        // Display new line
        const timer = this.time.addEvent({
            delay: 50,
            loop: true,
            callback: () => {
                displayText = newLine.substring(0, charIndex);
                this.currentLine.setText(displayText);
                charIndex++;

                if (charIndex > newLine.length) {
                    timer.remove();
                    this.typingSound.stop();
                    this.controlsEnabled = true;
                }
            }
        })
    };


    createTextTip(x, y, text, icon) {
        const iconImage = this.add.image(0, 0, icon).setScale(0.6).setOrigin(0, 0);
        const textObject = this.add.text(54, 0, text, {
            fontSize: '1.2rem',
            color: '#ffffff'
        }).setOrigin(0, 0);

        // Position the text in the center of the icon
        const containerHeight = iconImage.displayHeight;
        const textHeight = textObject.height;
        const textY = (containerHeight - textHeight) / 2;
        textObject.y = textY;

        return this.add.container(x, y, [
            iconImage,
            textObject
        ]);
    }


    startTransition() {
        this.typingSound.destroy();
        this.scene.start('Transition');
    }


    create ()
    {
        const { width, height } = this.sys.game.config;
        this.add.image(0, 0, 'story-bg').setOrigin(0, 0);

        this.cursor = this.input.keyboard.createCursorKeys();
        this.typingSound = this.sound.add("typing", { loop: true }).setVolume(0.2);

        this.currentLine = this.add.text(width / 2, height / 2, "", this.currentLineStyles).setOrigin(0.5, 0.5);
        this.continue = this.createTextTip(width - 210, height - 80, "To continue", "next-icon");
        this.skip = this.createTextTip(width - 380, height - 80, "To skip", "cross-icon");

        // Add a blinking effect to the continue text
        this.add.tween({
            targets: this.continue,
            duration: 500,
            alpha: 0,
            yoyo: true,
            repeat: -1
        });

        this.input.keyboard.on('keydown-X', this.startTransition, this);

        this.typeNextLine(); 
    }


    update() {
        const { right } = this.cursor;

        if (this.progress >= this.lines.length) {
            this.startTransition();
        }

        // Move to the next line of text on right arrow key press
        else if (Phaser.Input.Keyboard.JustDown(right) && this.controlsEnabled) {
            this.progress += 1;
            this.typeNextLine();
        }
    }
}

// NOTE: Instead of a black screen you can use a slow zoom view of the planet ? 