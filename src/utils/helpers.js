export function getCustomProperty(object, propertyName) {
    const property = object.properties.find(p => p.name === propertyName);
    return property ? property.value : null;
}