export function startKickback(object, duration, force, kickBackCondition, kickbackTween, onComplete) {
    const initialKickbackForce = kickBackCondition? force : -force;

    // stop any previous kickback tweens
    if (kickbackTween) {
        kickbackTween.stop();
    }

    kickbackTween = object.scene.tweens.add({
        targets: object.body.velocity,
        x: 0,
        ease: 'Power1',
        duration: duration,
        onComplete: () => { onComplete && onComplete() }
    });

    object.setVelocityX(initialKickbackForce);
}