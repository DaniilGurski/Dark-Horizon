export default class DataUtils {
    static getAnimations(scene, key) {
        try {
            const data = scene.cache.json.get(key);
            return data;
        } catch (error) {
            console.error(`Error getting animations from cache: ${error}`);
            return [];
        }
    }
}