<template>
    <div class="row mt-4">
        <div class="col-3"></div>
        <div class="col-6">
            <iframe :src="randomLink['a']" width="300" height="300" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a :href="randomLink['b']"></a></p>
        </div>
        <div class="col-3"></div>
    </div>
</template>

<script>
let links = [
    {a: 'https://giphy.com/embed/5IFo5UWAYXp93BfJMM', b: 'https://giphy.com/gifs/5IFo5UWAYXp93BfJMM'},
    {a: 'https://giphy.com/embed/Cbew5DcXgBqRkyIQ5s', b: 'https://giphy.com/gifs/BuckedUp-Cbew5DcXgBqRkyIQ5s'},
    {a: 'https://giphy.com/embed/YlSat0ayBTMackvQbW', b: 'https://giphy.com/gifs/MyNaturalForce-flex-muscle-protein-YlSat0ayBTMackvQbW'}
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