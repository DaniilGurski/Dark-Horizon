import { Scene } from "phaser";
import { createTextTip } from "../utils/helpers";

export class Story extends Scene {
  constructor() {
    super("Story");

    this.lines = [
      "Welcome, Soldier ! You've almost made it to the mission.",
      "Site—good work so far, but the real challenge begins now.",
      "This area has been overrun by alien monstrosities, and your objective is clear:",
      "Eliminate the threat and reclaim this zone.",
      "Your primary weapon is the AR3, a powerful tool against these creatures.",
      "Also, keep an eye out for ammo and first aid kits; they'll be the difference between survival and failure.",
      "As for the enemy... our intel is limited.",
      "These creatures cannot see you, but if you cross their path, they'll attack without hesitation.",
      "Worse still, some of them possess unique traits. Stay sharp and adapt to their behaviors.",
      "That's all the briefing you get. Now go, soldier. Prove your worth and make every shot count.",
      "Good luck-you'll need it.",
    ];

    this.currentLine;
    this.fadingDot;
    this.progress = 0;
    this.cursor;
    this.typingSound;
    this.controlsEnabled = true;

    this.currentLineStyles = {
      fontSize: "1.5rem",
      color: "#ffffff",
      wordWrap: { width: 810 },
    };
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
        } else if ([".", ",", "!", ";", "-"].includes(newLine[charIndex - 2])) {
          this.typingSound.stop();
          timer.delay = 300; // Pause duration after punctuation
        } else {
          this.typingSound.play();
          timer.delay = 50; // Default typing speed
        }
      },
    });
  }

  startTransition() {
    this.typingSound.destroy();
    this.scene.start("Transition");
  }

  create() {
    const { width, height } = this.sys.game.config;
    this.add.image(0, 0, "story-bg").setOrigin(0, 0);

    this.cursor = this.input.keyboard.createCursorKeys();
    this.typingSound = this.sound.add("typing", { loop: true }).setVolume(0.2);
    this.sound.add("story-track").play({ loop: true });

    this.currentLine = this.add.text(width / 2, height / 2, "", this.currentLineStyles).setOrigin(0.5, 0.5);
    this.continue = createTextTip(this, width - 210, height - 80, "To continue", "next-icon");
    this.skip = createTextTip(this, width - 380, height - 80, "To skip", "cross-icon");

    // Add a blinking effect to the continue text
    this.add.tween({
      targets: this.continue,
      duration: 500,
      alpha: 0,
      yoyo: true,
      repeat: -1,
    });

    this.input.keyboard.on("keydown-X", this.startTransition, this);

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
