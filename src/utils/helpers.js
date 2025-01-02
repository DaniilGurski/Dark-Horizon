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
