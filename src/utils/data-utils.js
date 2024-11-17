export default class DataUtils {
    static getAnimations(scene) {
        const data = scene.cache.json.get("animations")
        return data;
    }
}