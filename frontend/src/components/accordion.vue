<template>
  <ul class="accordion">
    <slot></slot>
  </ul>
</template>

<script>
export default {
  name: 'Accordion', // เพิ่ม name ให้ component
  data() {
    return {
      Accordion: {
        count: 0,
        active: null,
        registerItem: this.registerItem, // เพิ่ม method
        unregisterItem: this.unregisterItem,  // เพิ่ม method
        closeOthers: this.closeOthers
      },
      items: [] // เก็บ accordion items
    };
  },
  provide() {
    return { Accordion: this.Accordion }; //  provide object
  },
  methods: {
    registerItem(item) {
      this.items.push(item);
      this.Accordion.count++;
    },
    unregisterItem(item) {
      this.items = this.items.filter(i => i !== item);
      this.Accordion.count--;
    },
    closeOthers(activeItem) {
      this.items.forEach(item => {
        if (item !== activeItem) {
          item.close();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.accordion {
  list-style: none;
  margin: 0;
  padding: 0;

  &__item:last-child {
    border-bottom: none;
  }
}
</style>