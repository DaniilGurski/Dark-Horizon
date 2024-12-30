export function getCustomProperty(object, propertyName) {
  const property = object.properties.find((p) => p.name === propertyName);
  return property ? property.value : null;
}

// Ignore this for now
// export function animateTiles(layer, tileset, scene) {
//   const tileAnimData = [];

//   // Gather animation frame data
//   tileset.tileData[0].animation.forEach((tile, index) => {
//     if (tile.animation) {
//       tileAnimData.push({
//         firstTileId: tileset.firstgid + index,
//         frames: tile.animation,
//         currentFrame: 0,
//         currentDelay: 0,
//       });
//     }
//   });

//   scene.events.on("update", (_, delta) => {
//     tileAnimData.forEach((anim) => {
//       const currentAnimFrame = anim.frames[anim.currentFrame];
//       anim.currentDelay += delta;
//       if (anim.currentDelay >= currentAnimFrame.duration) {
//         anim.currentDelay = 0;
//         anim.currentFrame = (anim.currentFrame + 1) % anim.frames.length;
//         layer.forEachTile((t) => {
//           if (t.index === anim.firstTileId + currentAnimFrame.tileid) {
//             t.index = anim.firstTileId + anim.frames[anim.currentFrame].tileid;
//           }
//         });
//       }
//     });
//   });
// }
