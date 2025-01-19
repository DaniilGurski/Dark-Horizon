import { Scene } from "phaser";
import { createTextTip } from "../utils/helpers";

export class GameOver extends Scene {
  constructor() {
    super("GameOver");
  }

  create() {
    this.flatlineSound = this.sound.add("flatline");
    this.flatlineSound.volume = 0.2;
    this.flatlineSound.play();

    // Set initial background color to red
    this.cameras.main.setBackgroundColor("#ff0000");

    // Fade to black over 1 second
    this.cameras.main.fadeIn(3000, 0, 0, 0, () => {
      // After the fade completes, set background color to black
      this.cameras.main.setBackgroundColor("#000000");

      // Show the "Game Over" text after the transition
      this.showGameOverText();
    });

    this.input.keyboard.on("keydown-X", () => this.scene.start("LevelZero"), this);
  }

  showGameOverText() {
    const { width, height } = this.sys.game.config;

    // Add 'Game Over' text with zero alpha (invisible)
    const gameOverText = this.add
      .text(width / 2, height / 2 - 50, "Game Over", {
        fontSize: "48px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    gameOverText.alpha = 0;

    // Fade in the text smoothly
    this.tweens.add({
      targets: gameOverText,
      alpha: 1,
      duration: 1000,
      onComplete: () => {
        // After text appears, show the 'Play Again' button
        // this.createPlayAgainButton();
        this.restart = createTextTip(this, width - 210, height - 80, "Restart", "cross-icon");
      },
    });
  }
}
