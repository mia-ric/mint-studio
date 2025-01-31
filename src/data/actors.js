
const actors = new Map;

/**
 * Get Voice-Actors
 * @returns 
 */
function getActors() {
    if (actors.size == 0) {
        actors.set('narrator', {    // The Narrator-Voice of the first story only.
            name: 'Narrator',
            color: color(192, 38, 211),     // Violet
        });
        actors.set('rey', {         // Rey, the same as the narrator-voice in the first story (there is no 'narrator' starting with second story)
            name: 'Rey',
            color: color(192, 38, 211),     // Violet
        });
        actors.set('karai', {
            name: 'Oroku Karai',
            color: color(185, 28, 28),      // Red
        });
        actors.set('ninja', {
            name: 'Random Ninja',
            color: color(2, 132, 199),      // Blue
        });
        actors.set('obrian', {
            name: 'Det. Mark O\'Brian',
            color: color(5, 150, 105),      // Green
        });
        actors.set('bridge', {
            name: 'Bridge',
            color: color(101, 163, 13),     // Lime
        });
        actors.set('random', {
            name: 'Random Statisten',
            color: color(100, 116, 139),    // Slate
        });
        actors.set('sira', {
            name: 'Sira',
            color: color(219, 39, 119),     // Pink
        });
        actors.set('yamamoto', {
            name: 'Yamamoto Ryu',
            color: color(6, 182, 212),      // Cyan
        });
        actors.set('tanaka', {
            name: 'Tanaka Hiroshi',
            color: color(82, 82, 91),       // Dark Zinc
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
