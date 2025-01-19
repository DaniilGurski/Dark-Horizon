import * as FontLoader from "webfontloader";
import { createTextTip } from "./utils/helpers";

export class PlayerInterface {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;

    // Add the health bar sprite using the atlas
    this.healthbar = this.scene.physics.add
      .sprite(0, 0, "healthbar", "healthbar0005")
      .setOrigin(0, 0)
      .setScale(3)
      .setScrollFactor(0)
      .setDepth(1000);
    this.healthbar.setImmovable(true);
    this.healthbar.body.allowGravity = false;

    this.healthbar.x = 260;
    this.healthbar.y = 200;

    // Set the initial frame based on the player's health
    this.updateHealthbar();

    // Ammo UI asset, positioned below the health bar
    this.ammoArrows = this.scene.add
      .image(this.healthbar.x, this.healthbar.y + 30, "ammo-arrows")
      .setScale(0.4)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(1000);

    // Ammo text centered on the ammoArrows
    this.ammoText = this.scene.add
      .text(
        this.ammoArrows.x + (this.ammoArrows.width * this.ammoArrows.scaleX) / 2,
        this.ammoArrows.y + (this.ammoArrows.height * this.ammoArrows.scaleY) / 2,
        `${this.player.ammo} / ${this.player.maxAmmo}`,
        {
          fontSize: "0.875rem",
          color: "#ffffff",

          resolution: 5,
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1001);

    // Create a text tip for the player
    const tutorialTextX = 20;
    const tutorialTextY = this.scene.game.config.height - 60;

    const movementText = this.scene.add
      .text(tutorialTextX + 250, tutorialTextY - 190, "Arrow Keys / WASD for movement", {
        fontSize: "0.875rem",
        fill: "#ffffff",
        fontWeight: "700",
        resolution: 5, // Increase the resolution
      })
      .setScrollFactor(0)
      .setDepth(1002);

    const shootText = this.scene.add
      .text(tutorialTextX + 250, tutorialTextY - 170, "X / Right mouse click to shoot", {
        fontSize: "0.875rem",
        fontWeight: "700",
        fill: "#ffffff",
        resolution: 5, // Increase the resolution
      })
      .setScrollFactor(0)
      .setDepth(1002);

    // Fade out the tutorial text after a few seconds
    this.scene.time.delayedCall(5000, () => {
      this.scene.tweens.add({
        targets: [movementText, shootText],
        alpha: 0,
        duration: 1000,
        onComplete: () => {
          movementText.destroy();
          shootText.destroy();
        },
      });
    });

    this.controlPanelText = this.scene.add
      .text(tutorialTextX + 250, tutorialTextY - 170, "Press SPACE to interact", {
        fontSize: "0.875rem",
        fill: "#ffffff",
        fontWeight: "700",
        resolution: 5, // Increase the resolution
      })
      .setScrollFactor(0)
      .setDepth(1002)
      .setVisible(false); // Initially hidden

    FontLoader.load({
      google: {
        families: ["Orbitron:400"],
      },
      active: () => {
        this.ammoText.setFontFamily("Orbitron");
        movementText.setFontFamily("Orbitron");
        shootText.setFontFamily("Orbitron");
        this.controlPanelText.setFontFamily("Orbitron");
      },
    });
  }

  updateHealthbar() {
    // Calculate the frame based on the player's health
    const frame = `healthbar000${Math.max(this.player?.health - 1, 0)}`;
    this.healthbar.setFrame(frame);
  }

  updateAmmoIndicator() {
    this.ammoText.setText(`${this.player.ammo}/${this.player.maxAmmo}`);
  }

  showControlPanelText(visible) {
    this.controlPanelText.setVisible(visible);
  }
}
