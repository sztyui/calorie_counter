<template>
    <h3>
        <div class="row">
            <div class="col text-start">
                Bevásárló lista
                <small class="text-muted">az elkövetkezendő {{ number_of_days }} napra...</small>
            </div>
            <div class="col text-end">
                <button type="button" class="btn btn-light" @click="hideTable">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-octagon-fill" viewBox="0 0 16 16">
                        <path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353L11.46.146zm-6.106 4.5L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/>
                    </svg>
                </button>
            </div>
        </div>
    </h3>
    <table class="table m-4">
        <thead>
            <tr>
            <th scope="col">#</th>
            <th scope="col">Alapanyag</th>
            <th scope="col">Mennyiség</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in shoppingList" :key="index">
            <th scope="row">{{ index +1 }}</th>
            <td>{{ item.name }}</td>
            <td>{{ item.quantity }} gramm</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
export default { 
    props: ['items', 'number_of_days'],
    emits: ['hide-myself'],
    computed: {
        shoppingList() {
            return this.items.map(item => {
                return {name: item.name, quantity: item.quantity * this.number_of_days}
            })
        }
    },
    methods: {
        hideTable() {
            this.$emit('hide-myself');
        }
    }
}
</script>