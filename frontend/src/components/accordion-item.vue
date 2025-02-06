<template>
  <li class="accordion__item">
    <div
      class="accordion__trigger"
      :class="{ 'accordion__trigger_active': isOpen }"
      @click="toggle"
    >
      <slot name="accordion-trigger"></slot>
    </div>

    <transition
      name="accordion"
      @enter="start"
      @after-enter="end"
      @before-leave="start"
      @after-leave="end"
    >
      <div class="accordion__content" v-show="isOpen">
        <slot name="accordion-content"></slot>
      </div>
    </transition>
  </li>
</template>


<script>
export default {
  name: 'AccordionItem', // Add component name
  props: {},
  inject: ['Accordion'],
  data() {
    return {
      isOpen: false, // Use a local isOpen flag
    };
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen; // Toggle local state
      if (this.isOpen) {
        this.Accordion.closeOthers(this); // Close others if opening
        this.Accordion.active = this.index;
      } else {
         this.Accordion.active = null; // Reset active if closing
      }
    },
    close() {
      this.isOpen = false; // Method to close this item
      this.Accordion.active = null;
    },
    start(el) {
      el.style.height = el.scrollHeight + 'px';
    },
    end(el) {
      el.style.height = '';
    },
  },
  created() {
    this.Accordion.registerItem(this); // Register with parent
    this.index = this.Accordion.count; // Get a unique index
    // No need to set this.Accordion.active here; just get the count
  },
  beforeDestroy() {
    this.Accordion.unregisterItem(this); // Unregister before destroying
  },
};
</script>

<style lang="scss" scoped>
.accordion__item {
  cursor: pointer;
  /* เอา padding-left ออก หรือปรับค่าตามต้องการ */
  padding: 10px 20px 10px 20px;
  position: relative;
}

.accordion__trigger {
  display: flex;
  justify-content: space-between;
}

.accordion-enter-active,
.accordion-leave-active {
  will-change: height, opacity;
  transition: height 0.3s ease, opacity 0.3s ease;
  overflow: hidden;
}

.accordion-enter,
.accordion-leave-to {
  height: 0 !important;
  opacity: 0;
}
</style>