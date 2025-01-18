import { Scene } from "phaser";
import { createTextTip } from "../utils/helpers";

export class Win extends Scene {
  constructor() {
    super("Win");
  }

  create(data) {
    this.endingTrack = this.sound.add("end-track");
    this.endingTrack.play();

    // Set initial background color to red
    this.cameras.main.setBackgroundColor("#ff0000");

    // Fade to black over 1 second
    this.cameras.main.fadeIn(3000, 0, 0, 0, () => {
      // After the fade completes, set background color to black
      this.cameras.main.setBackgroundColor("#000000");

      // Show the "Thanks for playing" text after the transition
      this.showEndingText(data);
    });

    this.input.keyboard.on(
      "keydown-X",
      () => {
        this.endingTrack.stop();
        this.scene.start("LevelZero");
      },
      this
    );
  }

  showEndingText(data) {
    const { width, height } = this.sys.game.config;

    const endingText = this.add
      .text(width / 2, height / 2 - 50, "You made it !", {
        fontSize: "48px",
        color: "#ffffff",
      })
      .setOrigin(0.5);
    const scoreText = this.add
      .text(width / 2, height / 2 + 30, `Your score: ${data.score}`, {
        fontSize: "28px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    endingText.alpha = 0;
    scoreText.alpha = 0;

    // Fade in the text smoothly
    this.tweens.add({
      targets: endingText,
      alpha: 1,
      duration: 1000,
      onComplete: () => {
        // After text appears, show the 'Play Again' button
        // this.createPlayAgainButton();
        this.restart = createTextTip(this, width - 210, height - 80, "Play Again", "cross-icon");
      },
    });
    this.tweens.add({
      targets: scoreText,
      alpha: 1,
      duration: 4000,
      onComplete: () => {
        // After text appears, show the 'Play Again' button
        // this.createPlayAgainButton();
        this.restart = createTextTip(this, width - 210, height - 80, "Play Again", "cross-icon");
      },
    });
  }
}
