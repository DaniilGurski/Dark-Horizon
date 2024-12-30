export function startKickback(object, duration, forceX, forceY, kickBackCondition = null, kickbackTween, onComplete) {
  let initialKickbackForce;

  if (kickBackCondition !== null) {
    initialKickbackForce = kickBackCondition ? forceX : -forceX;
  } else {
    initialKickbackForce = forceX * (object.flipX ? -1 : 1);
  }

  // stop any previous kickback tweens
  if (kickbackTween) {
    kickbackTween.stop();
  }

  object.setVelocityX(initialKickbackForce);
  object.setVelocityY(forceY ?? -300);

  kickbackTween = object.scene.tweens.add({
    targets: object.body.velocity,
    x: 0,
    ease: "Power1",
    duration: duration,
    onComplete: () => {
      onComplete && onComplete();
    },
  });
}
