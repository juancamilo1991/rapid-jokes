function isSelected(selectedEntity, e) {
    if (selectedEntity.length === 0) return false;
    return selectedEntity.some((entity) => {
        if (entity.hasOwnProperty("_id")) {
            return entity._id === e.target.value;
        }
        else {
            return entity === e.target.value;
        }
    });
}

function filterEntity(e, entityArray) {
    entityArray = entityArray.filter((entity) => {
        console.log(entity);
        if (
            typeof entity === "object" &&
            !Array.isArray(entity) &&
            entity !== null
        ) {
            return entity._id !== e.detail;
        }
        return entity !== e.detail;
    });
    return entityArray;
}

export { isSelected, filterEntity }