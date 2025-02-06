<template>
  <div class="field">
    <label class="label has-text-light">{{ label }}</label>
    <div class="control">
      <div class="box cont" :style="{ backgroundColor: backgroundColor, color: textColor }">
        {{ value }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchDetail',
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    backgroundColor: {
      type: String,
      default: '#5a4518' // สีพื้นหลังเริ่มต้น
    },
    textColor: {
      type: String,
      default: 'white' // สีข้อความเริ่มต้น
    }
  }
}
</script>

<style scoped>
.field {
  margin-bottom: 10px;
}

.label {
  font-size: 1.2rem;
}

.cont {
  font-size: 1.5rem;
}

.box {
  padding: 10px;
  border-radius: 5px;
}
</style>