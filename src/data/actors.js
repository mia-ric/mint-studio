
const actors = new Map;

/**
 * Get Voice-Actors
 * @returns 
 */
function getActors() {
    if (actors.size == 0) {
        actors.set('narrator', {    // The Narrator-Voice of the first story only.
            name: 'Narrator',
            color: color(192, 38, 211),
        });
        actors.set('rey', {         // Rey is the Narrator-Voice in the first story (there is no narrator starting with second story)
            name: 'Rey',
            color: color(192, 38, 211),
        });
        actors.set('karai', {
            name: 'Oroku Karai',
            color: color(185, 28, 28),
        });
        actors.set('ninja', {
            name: 'Random Ninja',
            color: color(2, 132, 199),
        });
    }
    return actors;
}


/**
 * Get Voice-Actor
 * @param {string} name
 * @returns 
 */
function getActor(name) {
    return getActors().get(name);
}
