import * as FontLoader from "webfontloader";

export function getCustomProperty(object, propertyName) {
  const property = object.properties.find((p) => p.name === propertyName);
  return property ? property.value : null;
}

export function replaceDataTileWithSprite(tile, spriteAssetKey, sizeX, sizeY) {
  const sprite = this.physics.add
    .sprite(tile.pixelX + tile.width / 2, tile.pixelY + tile.height / 2, spriteAssetKey)
    .setSize(sizeX, sizeY)
    .setImmovable(true);
  sprite.body.allowGravity = false;
  sprite.isOnCooldown = false;
}

export function createTextTip(scene, x, y, text, icon, size = "1.2rem") {
  const iconImage = scene.add.image(0, 0, icon).setScale(0.6).setOrigin(0, 0);
  const textObject = scene.add
    .text(54, 0, text, {
      fontSize: size,
      color: "#ffffff",
      resolution: 5,
    })
    .setOrigin(0, 0);

  // Position the text in the center of the icon
  const containerHeight = iconImage.displayHeight;
  const textHeight = textObject.height;
  const textY = (containerHeight - textHeight) / 2;
  textObject.y = textY;

  return scene.add.container(x, y, [iconImage, textObject]);
}
