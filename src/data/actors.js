
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
        actors.set('rey', {         // Rey, the same as the narrator-voice in the first story (there is no 'narrator' starting with second story)
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
        actors.set('obrian', {
            name: 'Det. Mark O\'Brian',
            color: color(5, 150, 105),
        });

        // Missing (No Voice Actors yet)
        actors.set('saki', {
            name: 'Oroku Saki',
            color: color(0, 0, 0),
        });
        actors.set('kitsune', {
            name: 'Kitsune',
            color: color(0, 0, 0),
        });
        actors.set('jennika', {
            name: 'Jennika',
            color: color(0, 0, 0),
        });
        actors.set('sira', {
            name: 'Sira',
            color: color(0, 0, 0),
        });
        actors.set('angel', {
            name: 'Angel',
            color: color(0, 0, 0),
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
