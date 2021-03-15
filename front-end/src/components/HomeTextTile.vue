<template>
    <v-card  class="roundBorderPanel">
        <div class="txTile">
            <h3 class="tileTitle">{{txTitle}}</h3>
            <div class="dataTileContent">{{data}}</div>
            <div class="bottomTextTile">{{txBottom}}</div>
        </div>
    </v-card>
</template>

<script>
export default {
  name: "HomeTextTile",
  props:{
    txTitle: String,
    txBottom: String,
    data: Number,
  }
}
</script>