<template>
    <div class="row mt-4">
        <div class="col-3"></div>
        <div class="col-6">
            <iframe :src="randomLink['a']" width="300" height="300" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a :href="randomLink['b']"></a></p>
        </div>
        <div class="col-3"></div>
    </div>
</template>

<script scoped>
let links = [
    {a: 'https://giphy.com/embed/5IFo5UWAYXp93BfJMM', b: 'https://giphy.com/gifs/5IFo5UWAYXp93BfJMM'},
    {a: 'https://giphy.com/embed/Cbew5DcXgBqRkyIQ5s', b: 'https://giphy.com/gifs/BuckedUp-Cbew5DcXgBqRkyIQ5s'},
    {a: 'https://giphy.com/embed/YlSat0ayBTMackvQbW', b: 'https://giphy.com/gifs/MyNaturalForce-flex-muscle-protein-YlSat0ayBTMackvQbW'},
    {a: 'https://giphy.com/embed/ubudypfaNYk24', b: 'https://giphy.com/gifs/drink-hardcore-protein-ubudypfaNYk24'},
    {a: 'https://giphy.com/embed/GlUlUGdHQuRkA', b: 'https://giphy.com/gifs/like-deadlift-completed-GlUlUGdHQuRkA'},
    {a: 'https://giphy.com/embed/1d5TneWoAtssvR7LSE', b: 'https://giphy.com/gifs/RobertEBlackmon-reaction-fail-1d5TneWoAtssvR7LSE'},
    {a: 'https://giphy.com/embed/MBUtbumAgz5MAo6j7v', b: 'https://giphy.com/gifs/mtvridiculousness-ridiculousness-mtv-MBUtbumAgz5MAo6j7v'},
    {a: 'https://giphy.com/embed/EzjCaYFnApVy8', b: 'https://giphy.com/gifs/acid-october-gifdump-EzjCaYFnApVy8'},
    {a: 'https://giphy.com/embed/4IlBRhYAiB8Na', b: 'https://giphy.com/gifs/fail-gym-noobie-4IlBRhYAiB8Na'},
]
export default {
    computed: {
        randomLink() {
            let index = Math.floor(Math.random() * links.length);
            return links[index]
        }
    }
}
</script>